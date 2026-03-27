/**
 * Server-side conversion tracking via GA4 Measurement Protocol.
 *
 * Called from the Stripe webhook after payment is confirmed,
 * ensuring conversions are tracked even when the user doesn't
 * return to the success page (common with Alipay/WeChat Pay).
 *
 * GA4 receives the purchase event → auto-imports to linked Google Ads account.
 * No need for Google Ads API credentials or conversion action IDs.
 *
 * Required env vars:
 *   GA4_MEASUREMENT_ID  — e.g. "G-WW5E5CHYQT"
 *   GA4_API_SECRET      — create in GA4 Admin → Data Streams → Measurement Protocol API secrets
 */

const GA4_ENDPOINT = 'https://www.google-analytics.com/mp/collect'

interface ServerPurchaseEvent {
  /** Stripe session ID (used as both client_id and transaction_id) */
  sessionId: string
  /** Payment value in the user's currency */
  value: number
  /** Currency code, e.g. "CNY", "USD" */
  currency: string
  /** Buyer email (for Enhanced Conversions matching) */
  email?: string
  /** Google Click ID from the ad click */
  gclid?: string
}

/**
 * Send a purchase event to GA4 via Measurement Protocol (server-side).
 * This is the server-side counterpart to the client-side gtag('event', 'purchase', ...).
 */
export async function uploadPurchaseConversion({
  sessionId,
  value,
  currency,
  email,
  gclid,
}: ServerPurchaseEvent): Promise<boolean> {
  const measurementId = process.env.GA4_MEASUREMENT_ID?.trim() || process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim()
  const apiSecret = process.env.GA4_API_SECRET?.trim()

  if (!measurementId || !apiSecret) {
    console.warn('[conversion-upload] GA4_MEASUREMENT_ID or GA4_API_SECRET not set, skipping server-side tracking')
    return false
  }

  // Use Stripe session ID as a stable client_id for server-sent events.
  // This doesn't match the browser's client_id, but GA4 Measurement Protocol
  // allows any string. The gclid parameter enables Google Ads attribution.
  const clientId = sessionId.replace('cs_', '')

  const payload: Record<string, unknown> = {
    client_id: clientId,
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: sessionId,
          value,
          currency: currency.toUpperCase(),
          // Mark as server-side so we can distinguish in GA4 reports
          source: 'webhook',
          items: [
            {
              item_id: 'chatgpt-plus-1m',
              item_name: 'ChatGPT Plus 1-Month Activation Code',
              price: value,
              quantity: 1,
            },
          ],
        },
      },
    ],
  }

  // Enhanced Conversions: pass user data for better Google Ads matching
  if (email) {
    payload.user_data = {
      email_address: email.trim().toLowerCase(),
    }
  }

  // If we have a gclid, include it for Google Ads click attribution
  if (gclid) {
    payload.events = [
      {
        ...((payload.events as Record<string, unknown>[])[0]),
        params: {
          ...(((payload.events as Record<string, unknown>[])[0]) as Record<string, unknown>).params as Record<string, unknown>,
          gclid,
        },
      },
    ]
  }

  const url = `${GA4_ENDPOINT}?measurement_id=${measurementId}&api_secret=${apiSecret}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    // GA4 Measurement Protocol returns 2xx even on validation errors,
    // but a 204 with no body means success.
    if (response.ok) {
      console.log(`[conversion-upload] GA4 purchase event sent for session: ${sessionId}`)
      return true
    }

    const errorText = await response.text()
    console.error(`[conversion-upload] GA4 MP error (${response.status}):`, errorText)
    return false
  } catch (err) {
    console.error('[conversion-upload] GA4 MP request failed:', err)
    return false
  }
}
