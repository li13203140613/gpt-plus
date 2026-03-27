/**
 * GA4 + Google Ads event tracking utilities
 * Wraps window.gtag for type-safe, consistent event tracking across the funnel.
 *
 * Google Ads Enhanced Conversions: we pass sha256-hashed email so Google can
 * match ad clicks to conversions even when cookies are blocked.
 */

type GtagEvent = {
  // Funnel events
  email_focus: { source_page: string }
  email_submit: { source_page: string }
  email_error: { error_type: string; source_page: string }
  begin_checkout: { value: number; currency: string; source_page: string }
  checkout_api_error: { error_message: string; source_page: string }
  checkout_redirect: { source_page: string }
  // Post-purchase events
  purchase: { transaction_id: string; value: number; currency: string }
  copy_activation_code: { method: string }
  click_activation_site: { destination: string }
  order_recovery: { source: string }
  // Engagement events
  seo_cta_click: { page_slug: string; cta_type: string }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent<K extends keyof GtagEvent>(name: K, params: GtagEvent[K]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
}

/**
 * SHA-256 hash a string (for Enhanced Conversions user data).
 * Uses the native Web Crypto API — available in all modern browsers.
 */
async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase())
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Set user-provided data for Google Ads Enhanced Conversions.
 * Call this as soon as the user enters their email so all subsequent
 * conversion events carry the hashed identifier.
 */
export async function setUserDataForAds(email: string) {
  if (typeof window === 'undefined' || !window.gtag) return
  const hashedEmail = await sha256(email)
  window.gtag('set', 'user_data', {
    sha256_email_address: hashedEmail,
  })
}

/**
 * Fire a Google Ads conversion event with Enhanced Conversion data.
 */
export async function trackGoogleAdsConversion(conversionLabel: string, value?: number, email?: string, currency?: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  // Set user_data right before the conversion for best match rate
  if (email) {
    await setUserDataForAds(email)
  }

  window.gtag('event', 'conversion', {
    send_to: `AW-18002889651/${conversionLabel}`,
    ...(value != null && { value, currency: (currency || 'CNY').toUpperCase() }),
  })
}

/**
 * Track Google Ads secondary conversion (begin_checkout as micro-conversion).
 * This helps Google Ads optimize for users with purchase intent, not just final buyers.
 */
export function trackGoogleAdsSecondaryConversion(conversionLabel: string, value?: number, currency?: string) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'conversion', {
    send_to: `AW-18002889651/${conversionLabel}`,
    ...(value != null && { value, currency: (currency || 'CNY').toUpperCase() }),
  })
}

/**
 * Google recommended e-commerce event: view_item
 * Fires when a user sees the product (i.e., the homepage product card is in view).
 */
export function trackViewItem(value: number, currency: string) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'view_item', {
    currency,
    value,
    items: [
      {
        item_id: 'chatgpt-plus-1m',
        item_name: 'ChatGPT Plus 1-Month Activation Code',
        price: value,
        quantity: 1,
      },
    ],
  })
}
