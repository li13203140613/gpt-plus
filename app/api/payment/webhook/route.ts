import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/payment/stripe'
import { completePayment, handleSessionExpired } from '@/lib/payment/service'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event

  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      await completePayment(session.id, session.customer_details?.email ?? undefined)
      break
    }
    case 'checkout.session.expired': {
      const session = event.data.object
      await handleSessionExpired(session.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
