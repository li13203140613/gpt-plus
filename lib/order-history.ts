export const ORDER_HISTORY_COOKIE = 'gptplus_last_order'

export function parseOrderHistoryCookie(value?: string | null) {
  const sessionId = value?.trim()
  return sessionId || null
}

export function serializeOrderHistoryCookie(sessionId: string) {
  return sessionId.trim()
}
