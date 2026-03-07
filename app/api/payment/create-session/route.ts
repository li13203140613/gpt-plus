import { NextRequest, NextResponse } from 'next/server'
import { ORDER_HISTORY_COOKIE, serializeOrderHistoryCookie } from '@/lib/order-history'
import { createPaymentSession } from '@/lib/payment/service'

export async function POST(request: NextRequest) {
  try {
    const { buyerEmail } = await request.json()
    const email = typeof buyerEmail === 'string' ? buyerEmail.trim().toLowerCase() : ''
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!isValidEmail) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 })
    }

    const { url, sessionId } = await createPaymentSession({ buyerEmail: email })
    const response = NextResponse.json({ url, sessionId })

    response.cookies.set({
      name: ORDER_HISTORY_COOKIE,
      value: serializeOrderHistoryCookie(sessionId),
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create payment session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
