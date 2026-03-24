/**
 * GA4 event tracking utilities
 * Wraps window.gtag for type-safe, consistent event tracking across the funnel.
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

export function trackGoogleAdsConversion(conversionLabel: string, value?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `AW-18002889651/${conversionLabel}`,
      ...(value != null && { value, currency: 'CNY' }),
    })
  }
}
