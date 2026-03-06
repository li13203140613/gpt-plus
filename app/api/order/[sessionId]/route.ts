import { NextRequest, NextResponse } from 'next/server'
import { getOrderBySessionId, completePayment } from '@/lib/payment/service'
import { getStripe } from '@/lib/payment/stripe'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params

  if (!sessionId) {
    return NextResponse.json({ error: '缺少 session ID' }, { status: 400 })
  }

  let order = await getOrderBySessionId(sessionId)

  // Fallback: if order is still pending, check Stripe directly
  if (order && order.status === 'pending') {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId)
      if (session.payment_status === 'paid') {
        await completePayment(sessionId, session.customer_details?.email ?? undefined)
        order = await getOrderBySessionId(sessionId)
      }
    } catch {
      // Stripe query failed, continue with current status
    }
  }

  if (!order) {
    return NextResponse.json({ status: 'expired' })
  }

  return NextResponse.json(order)
}
