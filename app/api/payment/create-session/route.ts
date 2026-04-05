import { NextRequest, NextResponse } from 'next/server'
import { ORDER_HISTORY_COOKIE, serializeOrderHistoryCookie } from '@/lib/order-history'
import { createPaymentSession } from '@/lib/payment/service'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/config'

export async function POST(request: NextRequest) {
  try {
    const { buyerEmail, priceOverride, locale: rawLocale, sourcePage, gclid, source, isMobile: rawIsMobile } = await request.json()
    const email = typeof buyerEmail === 'string' ? buyerEmail.trim().toLowerCase() : ''
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!isValidEmail) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 })
    }

    // Validate locale
    const locale: Locale = (SUPPORTED_LOCALES as readonly string[]).includes(rawLocale) ? rawLocale : 'zh'

    // Only allow whitelisted price overrides
    const ALLOWED_PRICES = [99]
    const validatedPrice = ALLOWED_PRICES.includes(priceOverride) ? priceOverride : undefined

    const cancelPath = typeof sourcePage === 'string' && sourcePage.startsWith('/') ? sourcePage : '/'
    const validGclid = typeof gclid === 'string' && gclid.length > 0 ? gclid : undefined
    const validSource = typeof source === 'string' && source.length > 0 ? source : undefined
    const userAgent = request.headers.get('user-agent') || ''
    const isMobileByUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)
    const isMobile = typeof rawIsMobile === 'boolean' ? rawIsMobile : isMobileByUA
    const { url, sessionId } = await createPaymentSession({
      buyerEmail: email,
      priceOverride: validatedPrice,
      locale,
      cancelPath,
      gclid: validGclid,
      source: validSource,
      isMobile,
    })
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
