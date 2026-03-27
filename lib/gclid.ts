/**
 * Google Click ID (gclid) capture and persistence.
 * When a user arrives from a Google Ad, the URL contains ?gclid=xxx.
 * We capture it and store in sessionStorage so it survives page navigation
 * and can be sent with the payment request for server-side conversion tracking.
 */

const GCLID_KEY = 'gclid'

/** Call on page load to capture gclid from URL and persist it */
export function captureGclid() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const gclid = params.get('gclid')
  if (gclid) {
    sessionStorage.setItem(GCLID_KEY, gclid)
  }
}

/** Get the stored gclid (if any) */
export function getGclid(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(GCLID_KEY)
}
