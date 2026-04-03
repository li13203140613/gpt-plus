import { getDb } from '@/lib/db'
import { sendActivationCodeEmail, sendPaymentFailedEmail } from '@/lib/email'
import { notifyNewOrder, notifyPaymentSuccess, notifyPaymentExpired, notifyPaymentAnomaly, notifyLowStock } from '@/lib/feishu-notify'
import { getStripe } from './stripe'
import { LOCALE_CONFIGS, type Locale } from '@/lib/i18n/config'
import { uploadPurchaseConversion } from '@/lib/conversion-upload'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3001'
const RESERVE_TIMEOUT_MINUTES = 10

interface CreatePaymentSessionInput {
  buyerEmail: string
  priceOverride?: number
  locale?: Locale
  cancelPath?: string
  gclid?: string
  source?: string
}

export async function releaseExpiredReservations() {
  const sql = getDb()
  const cutoff = new Date(Date.now() - RESERVE_TIMEOUT_MINUTES * 60 * 1000).toISOString()

  await sql`
    WITH expired_codes AS (
      UPDATE activation_codes
      SET status = 'available', stripe_session_id = NULL, reserved_at = NULL, buyer_email = NULL
      WHERE status = 'reserved' AND reserved_at < ${cutoff}
      RETURNING stripe_session_id
    )
    UPDATE gptplus_orders
    SET status = 'expired'
    WHERE status = 'pending'
      AND stripe_session_id IN (
        SELECT stripe_session_id
        FROM expired_codes
        WHERE stripe_session_id IS NOT NULL
      )
  `
}

export async function createPaymentSession({ buyerEmail, priceOverride, locale = 'zh', cancelPath = '/', gclid, source }: CreatePaymentSessionInput) {
  const sql = getDb()

  await releaseExpiredReservations()

  const codes = await sql`
    WITH selected_code AS (
      SELECT id
      FROM activation_codes
      WHERE status = 'available'
      ORDER BY created_at ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    UPDATE activation_codes AS ac
    SET status = 'reserved', reserved_at = NOW(), buyer_email = ${buyerEmail}
    FROM selected_code
    WHERE ac.id = selected_code.id
    RETURNING ac.*
  `

  if (codes.length === 0) {
    throw new Error('No activation code is currently available')
  }

  const code = codes[0]
  const localeConfig = LOCALE_CONFIGS[locale] || LOCALE_CONFIGS.zh

  // Use locale-specific price; for zh with priceOverride, use the override directly
  const finalPrice = priceOverride
    ? localeConfig.priceOverride
    : localeConfig.price

  // For CNY amount stored in DB (used for Feishu notifications & order tracking)
  const cnyAmount = priceOverride ?? Number(code.price)

  // Compute unit_amount: JPY and KRW have zero-decimal currencies
  const zeroDecimalCurrencies = ['jpy', 'krw']
  const unitAmount = zeroDecimalCurrencies.includes(localeConfig.currency)
    ? Math.round(finalPrice)
    : Math.round(finalPrice * 100)

  // Build payment method types and options
  const paymentMethodTypes = localeConfig.paymentMethods as ('card' | 'alipay' | 'wechat_pay')[]
  const paymentMethodOptions: Record<string, unknown> = {}
  if (paymentMethodTypes.includes('wechat_pay')) {
    paymentMethodOptions.wechat_pay = { client: 'web' }
  }

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: paymentMethodTypes,
    ...(Object.keys(paymentMethodOptions).length > 0 ? { payment_method_options: paymentMethodOptions } : {}),
    line_items: [
      {
        price_data: {
          currency: localeConfig.currency,
          product_data: {
            name: 'ChatGPT Plus 1-Month Activation Code',
            description: 'ChatGPT Plus monthly membership activation code',
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    locale: localeConfig.stripeLocale as 'zh' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es',
    customer_email: buyerEmail,
    success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}${cancelPath}`,
    metadata: {
      buyer_email: buyerEmail,
      code_id: String(code.id),
      locale,
    },
  })

  if (!session.url) {
    throw new Error('Stripe checkout URL is missing')
  }

  await sql`
    UPDATE activation_codes
    SET stripe_session_id = ${session.id}
    WHERE id = ${code.id}
  `

  await sql`
    INSERT INTO gptplus_orders (code_id, stripe_session_id, amount, status, buyer_email, currency, paid_amount, gclid, source)
    VALUES (${code.id}, ${session.id}, ${cnyAmount}, 'pending', ${buyerEmail}, ${localeConfig.currency}, ${finalPrice}, ${gclid || null}, ${source || null})
  `

  // Notify new order to Feishu (use CNY amount for internal tracking)
  try {
    await notifyNewOrder({ email: buyerEmail, amount: cnyAmount, sessionId: session.id })
  } catch (err) {
    console.error('Feishu new order notify failed:', err)
  }


  return { url: session.url, sessionId: session.id }
}

export async function completePayment(sessionId: string, buyerEmail?: string) {
  const sql = getDb()

  const orders = await sql`
    SELECT o.*, ac.code as activation_code
    FROM gptplus_orders o
    JOIN activation_codes ac ON o.code_id = ac.id
    WHERE o.stripe_session_id = ${sessionId}
    LIMIT 1
  `

  if (orders.length === 0) {
    console.warn(`[completePayment] No order found for session: ${sessionId}`)
    return
  }

  const order = orders[0]
  const recipientEmail = buyerEmail ?? order.buyer_email ?? null

  if (order.status === 'completed') {
    console.log(`[completePayment] Order already completed for session: ${sessionId}`)
    return
  }

  if (order.status !== 'pending') {
    console.warn(`[completePayment] Order status is '${order.status}', expected 'pending' for session: ${sessionId}`)
    return
  }

  const soldCodes = await sql`
    UPDATE activation_codes
    SET status = 'sold', buyer_email = ${recipientEmail}, sold_at = NOW()
    WHERE id = ${order.code_id}
      AND status = 'reserved'
      AND stripe_session_id = ${sessionId}
    RETURNING id
  `

  if (soldCodes.length === 0) {
    console.error(`[completePayment] Failed to mark code as sold - code may have been released. Session: ${sessionId}, Code ID: ${order.code_id}`)

    // Send Feishu anomaly alert - payment received but code not assigned (must await)
    if (recipientEmail) {
      try {
        await notifyPaymentAnomaly({
          email: recipientEmail,
          amount: order.amount,
          sessionId,
          reason: '已收款但激活码已释放，需人工补发',
        })
      } catch (err) {
        console.error('Feishu anomaly notify failed:', err)
      }
    }
    return
  }

  await sql`
    UPDATE gptplus_orders
    SET status = 'completed', buyer_email = ${recipientEmail}, completed_at = NOW()
    WHERE stripe_session_id = ${sessionId}
  `

  console.log(`[completePayment] Order completed for session: ${sessionId}, email: ${recipientEmail}`)

  if (recipientEmail && order.activation_code) {
    try {
      await sendActivationCodeEmail({
        code: order.activation_code,
        to: recipientEmail,
      })
    } catch (error) {
      console.error('Failed to send activation code email:', error)
    }

    // Notify payment success to Feishu (must await to prevent Vercel from killing the request)
    try {
      await notifyPaymentSuccess({
        email: recipientEmail,
        amount: order.amount,
        code: order.activation_code,
        sessionId: sessionId,
      })
    } catch (err) {
      console.error('Feishu payment success notify failed:', err)
    }
  } else {
    console.warn(`[completePayment] Missing email or code, skipping notifications. email: ${recipientEmail}, hasCode: ${!!order.activation_code}`)

    // Still notify Feishu even if email is missing (must await)
    try {
      await notifyPaymentSuccess({
        email: recipientEmail || '未知邮箱',
        amount: order.amount,
        code: order.activation_code || '未知',
        sessionId: sessionId,
      })
    } catch (err) {
      console.error('Feishu payment success notify failed:', err)
    }
  }

  // Check stock level and notify if low (≤3)
  try {
    const stockResult = await sql`
      SELECT COUNT(*)::int AS remaining FROM activation_codes WHERE status = 'available'
    `
    const remaining = stockResult[0]?.remaining ?? 0
    if (remaining <= 3) {
      await notifyLowStock({ remaining })
    }
  } catch (err) {
    console.error('[completePayment] Stock check notify failed:', err)
  }

  // Server-side GA4 conversion tracking (doesn't depend on client-side gtag)
  try {
    const convValue = order.paid_amount ? Number(order.paid_amount) : Number(order.amount)
    const convCurrency = order.currency || 'cny'
    await uploadPurchaseConversion({
      sessionId,
      value: convValue,
      currency: convCurrency,
      email: recipientEmail || undefined,
      gclid: order.gclid || undefined,
    })
  } catch (err) {
    console.error('[completePayment] Server-side conversion upload failed:', err)
  }
}

export async function handleSessionExpired(sessionId: string) {
  const sql = getDb()

  // Get buyer email and order amount before clearing
  const codes = await sql`
    SELECT ac.buyer_email, o.amount
    FROM activation_codes ac
    LEFT JOIN gptplus_orders o ON o.stripe_session_id = ac.stripe_session_id AND o.status = 'pending'
    WHERE ac.stripe_session_id = ${sessionId} AND ac.status = 'reserved'
    LIMIT 1
  `
  const buyerEmail = codes[0]?.buyer_email ?? null
  const orderAmount = codes[0]?.amount ?? 128

  await sql`
    UPDATE activation_codes
    SET status = 'available', stripe_session_id = NULL, reserved_at = NULL, buyer_email = NULL
    WHERE stripe_session_id = ${sessionId} AND status = 'reserved'
  `

  await sql`
    UPDATE gptplus_orders
    SET status = 'expired'
    WHERE stripe_session_id = ${sessionId} AND status = 'pending'
  `

  // Send payment failed email + Feishu notification
  if (buyerEmail) {
    try {
      await sendPaymentFailedEmail({ to: buyerEmail })
    } catch (error) {
      console.error('Failed to send payment failed email:', error)
    }

    try {
      await notifyPaymentExpired({
        email: buyerEmail,
        amount: orderAmount,
        sessionId,
        reason: '未支付过期',
      })
    } catch (err) {
      console.error('Feishu expired notify failed:', err)
    }
  }
}

export async function handlePaymentFailed(sessionId: string, buyerEmail?: string) {
  const sql = getDb()

  // Look up buyer email and amount from order if not provided
  const orders = await sql`
    SELECT buyer_email, amount FROM gptplus_orders
    WHERE stripe_session_id = ${sessionId} LIMIT 1
  `
  if (!buyerEmail) {
    buyerEmail = orders[0]?.buyer_email ?? undefined
  }
  const failedAmount = orders[0]?.amount ?? 128

  if (buyerEmail) {
    try {
      await sendPaymentFailedEmail({ to: buyerEmail })
    } catch (error) {
      console.error('Failed to send payment failed email:', error)
    }

    try {
      await notifyPaymentExpired({
        email: buyerEmail,
        amount: failedAmount,
        sessionId,
        reason: '支付失败',
      })
    } catch (err) {
      console.error('Feishu payment failed notify failed:', err)
    }
  }

  // Release the reserved code
  await sql`
    UPDATE activation_codes
    SET status = 'available', stripe_session_id = NULL, reserved_at = NULL, buyer_email = NULL
    WHERE stripe_session_id = ${sessionId} AND status = 'reserved'
  `

  await sql`
    UPDATE gptplus_orders
    SET status = 'expired'
    WHERE stripe_session_id = ${sessionId} AND status = 'pending'
  `
}

export async function getOrderBySessionId(sessionId: string) {
  const sql = getDb()

  await releaseExpiredReservations()

  const orders = await sql`
    SELECT o.status, o.buyer_email, o.currency, o.paid_amount, ac.code
    FROM gptplus_orders o
    JOIN activation_codes ac ON o.code_id = ac.id
    WHERE o.stripe_session_id = ${sessionId}
    LIMIT 1
  `

  if (orders.length === 0) return null

  const order = orders[0]

  return {
    status: order.status,
    code: order.status === 'completed' ? order.code : null,
    email: order.buyer_email,
    currency: order.currency || 'cny',
    paidAmount: order.paid_amount ? Number(order.paid_amount) : null,
  }
}
