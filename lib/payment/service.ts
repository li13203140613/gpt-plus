import { getDb } from '@/lib/db'
import { sendActivationCodeEmail } from '@/lib/email'
import { getStripe } from './stripe'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3001'
const RESERVE_TIMEOUT_MINUTES = 5

interface CreatePaymentSessionInput {
  buyerEmail: string
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

export async function createPaymentSession({ buyerEmail }: CreatePaymentSessionInput) {
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

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card', 'alipay', 'wechat_pay'],
    payment_method_options: {
      wechat_pay: { client: 'web' },
    },
    line_items: [
      {
        price_data: {
          currency: 'cny',
          product_data: {
            name: 'ChatGPT Plus 一个月会员充值卡',
            description: '月度 ChatGPT Plus 代充值卡',
          },
          unit_amount: Math.round(Number(code.price) * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: buyerEmail,
    success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: SITE_URL,
    metadata: {
      buyer_email: buyerEmail,
      code_id: String(code.id),
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
    INSERT INTO gptplus_orders (code_id, stripe_session_id, amount, status, buyer_email)
    VALUES (${code.id}, ${session.id}, ${code.price}, 'pending', ${buyerEmail})
  `

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

  if (orders.length === 0) return

  const order = orders[0]
  const recipientEmail = buyerEmail ?? order.buyer_email ?? null

  if (order.status === 'completed' || order.status !== 'pending') return

  const soldCodes = await sql`
    UPDATE activation_codes
    SET status = 'sold', buyer_email = ${recipientEmail}, sold_at = NOW()
    WHERE id = ${order.code_id}
      AND status = 'reserved'
      AND stripe_session_id = ${sessionId}
    RETURNING id
  `

  if (soldCodes.length === 0) return

  await sql`
    UPDATE gptplus_orders
    SET status = 'completed', buyer_email = ${recipientEmail}, completed_at = NOW()
    WHERE stripe_session_id = ${sessionId}
  `

  if (recipientEmail && order.activation_code) {
    try {
      await sendActivationCodeEmail({
        code: order.activation_code,
        to: recipientEmail,
      })
    } catch (error) {
      console.error('Failed to send activation code email:', error)
    }
  }
}

export async function handleSessionExpired(sessionId: string) {
  const sql = getDb()

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
    SELECT o.status, o.buyer_email, ac.code
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
  }
}
