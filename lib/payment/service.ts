import { getDb } from '@/lib/db'
import { getStripe } from './stripe'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
const RESERVE_TIMEOUT_MINUTES = 5

export async function releaseExpiredReservations() {
  const sql = getDb()
  const cutoff = new Date(Date.now() - RESERVE_TIMEOUT_MINUTES * 60 * 1000).toISOString()

  await sql`
    WITH expired_codes AS (
      UPDATE activation_codes
      SET status = 'available', stripe_session_id = NULL, reserved_at = NULL
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

export async function createPaymentSession(codeId: string) {
  const sql = getDb()

  await releaseExpiredReservations()

  const codes = await sql`
    UPDATE activation_codes
    SET status = 'reserved', reserved_at = NOW()
    WHERE id = ${codeId} AND status = 'available'
    RETURNING *
  `

  if (codes.length === 0) {
    throw new Error('激活码不可用')
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
            name: 'ChatGPT Plus 激活码',
            description: 'ChatGPT Plus 会员激活码，即买即用',
          },
          unit_amount: Math.round(Number(code.price) * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: SITE_URL,
    metadata: { code_id: codeId },
  })

  await sql`
    UPDATE activation_codes
    SET stripe_session_id = ${session.id}
    WHERE id = ${codeId}
  `

  await sql`
    INSERT INTO gptplus_orders (code_id, stripe_session_id, amount, status)
    VALUES (${codeId}, ${session.id}, ${code.price}, 'pending')
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
  if (order.status === 'completed' || order.status !== 'pending') return

  const soldCodes = await sql`
    UPDATE activation_codes
    SET status = 'sold', buyer_email = ${buyerEmail ?? null}, sold_at = NOW()
    WHERE id = ${order.code_id}
      AND status = 'reserved'
      AND stripe_session_id = ${sessionId}
    RETURNING id
  `

  if (soldCodes.length === 0) return

  await sql`
    UPDATE gptplus_orders
    SET status = 'completed', buyer_email = ${buyerEmail ?? null}, completed_at = NOW()
    WHERE stripe_session_id = ${sessionId}
  `
}

export async function handleSessionExpired(sessionId: string) {
  const sql = getDb()

  await sql`
    UPDATE activation_codes
    SET status = 'available', stripe_session_id = NULL, reserved_at = NULL
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
