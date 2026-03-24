import { OAuth2Client } from 'google-auth-library'

const API_VERSION = 'v19'

function getAdsCredentials() {
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN?.trim()
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID?.trim()
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET?.trim()
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN?.trim()
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID?.trim()

  if (!developerToken || !clientId || !clientSecret || !refreshToken || !customerId) {
    return null
  }

  return { developerToken, clientId, clientSecret, refreshToken, customerId }
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
  const oauth2 = new OAuth2Client({ clientId, clientSecret })
  oauth2.setCredentials({ refresh_token: refreshToken })
  const { token } = await oauth2.getAccessToken()
  if (!token) throw new Error('Failed to get Google Ads access token')
  return token
}

interface AdsQueryOptions {
  query: string
  customerId: string
  developerToken: string
  accessToken: string
  loginCustomerId?: string
}

async function queryGoogleAds({ query, customerId, developerToken, accessToken, loginCustomerId }: AdsQueryOptions) {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'developer-token': developerToken,
  }

  if (loginCustomerId) {
    headers['login-customer-id'] = loginCustomerId
  }

  const response = await fetch(
    `https://googleads.googleapis.com/${API_VERSION}/customers/${customerId}/googleAds:search`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, pageSize: 100 }),
    },
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Google Ads API error (${response.status}): ${error}`)
  }

  const data = await response.json()
  return data.results || []
}

export interface AdsCampaignRow {
  name: string
  status: string
  impressions: number
  clicks: number
  costMicros: number
  conversions: number
}

export interface AdsKeywordRow {
  keyword: string
  qualityScore: number | null
  impressions: number
  clicks: number
  costMicros: number
  conversions: number
}

export interface AdsSearchTermRow {
  searchTerm: string
  impressions: number
  clicks: number
  costMicros: number
  conversions: number
}

export interface AdsDeviceRow {
  device: string
  impressions: number
  clicks: number
  costMicros: number
  conversions: number
}

export interface AdsOverview {
  impressions: number
  clicks: number
  costMicros: number
  conversions: number
  ctr: number
  avgCpc: number
}

function microsToCny(micros: number) {
  return micros / 1_000_000
}

export async function getAdsCampaigns(dateKey: string): Promise<AdsCampaignRow[] | null> {
  const creds = getAdsCredentials()
  if (!creds) return null

  const accessToken = await getAccessToken(creds.clientId, creds.clientSecret, creds.refreshToken)
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.trim()

  const results = await queryGoogleAds({
    query: `
      SELECT
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM campaign
      WHERE segments.date = '${dateKey}'
        AND campaign.status != 'REMOVED'
      ORDER BY metrics.cost_micros DESC
      LIMIT 10
    `,
    customerId: creds.customerId,
    developerToken: creds.developerToken,
    accessToken,
    loginCustomerId,
  })

  return results.map((r: Record<string, Record<string, unknown>>) => ({
    name: (r.campaign?.name as string) || '(unknown)',
    status: (r.campaign?.status as string) || '',
    impressions: Number(r.metrics?.impressions || 0),
    clicks: Number(r.metrics?.clicks || 0),
    costMicros: Number(r.metrics?.costMicros || 0),
    conversions: Number(r.metrics?.conversions || 0),
  }))
}

export async function getAdsKeywords(dateKey: string): Promise<AdsKeywordRow[] | null> {
  const creds = getAdsCredentials()
  if (!creds) return null

  const accessToken = await getAccessToken(creds.clientId, creds.clientSecret, creds.refreshToken)
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.trim()

  const results = await queryGoogleAds({
    query: `
      SELECT
        ad_group_criterion.keyword.text,
        ad_group_criterion.quality_info.quality_score,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM keyword_view
      WHERE segments.date = '${dateKey}'
      ORDER BY metrics.cost_micros DESC
      LIMIT 15
    `,
    customerId: creds.customerId,
    developerToken: creds.developerToken,
    accessToken,
    loginCustomerId,
  })

  return results.map((r: Record<string, Record<string, unknown>>) => ({
    keyword: ((r.adGroupCriterion as Record<string, Record<string, unknown>>)?.keyword?.text as string) || '',
    qualityScore: ((r.adGroupCriterion as Record<string, Record<string, unknown>>)?.qualityInfo?.qualityScore as number) ?? null,
    impressions: Number(r.metrics?.impressions || 0),
    clicks: Number(r.metrics?.clicks || 0),
    costMicros: Number(r.metrics?.costMicros || 0),
    conversions: Number(r.metrics?.conversions || 0),
  }))
}

export async function getAdsSearchTerms(dateKey: string): Promise<AdsSearchTermRow[] | null> {
  const creds = getAdsCredentials()
  if (!creds) return null

  const accessToken = await getAccessToken(creds.clientId, creds.clientSecret, creds.refreshToken)
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.trim()

  const results = await queryGoogleAds({
    query: `
      SELECT
        search_term_view.search_term,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM search_term_view
      WHERE segments.date = '${dateKey}'
      ORDER BY metrics.impressions DESC
      LIMIT 15
    `,
    customerId: creds.customerId,
    developerToken: creds.developerToken,
    accessToken,
    loginCustomerId,
  })

  return results.map((r: Record<string, Record<string, unknown>>) => ({
    searchTerm: (r.searchTermView?.searchTerm as string) || '',
    impressions: Number(r.metrics?.impressions || 0),
    clicks: Number(r.metrics?.clicks || 0),
    costMicros: Number(r.metrics?.costMicros || 0),
    conversions: Number(r.metrics?.conversions || 0),
  }))
}

export async function getAdsDevicePerformance(dateKey: string): Promise<AdsDeviceRow[] | null> {
  const creds = getAdsCredentials()
  if (!creds) return null

  const accessToken = await getAccessToken(creds.clientId, creds.clientSecret, creds.refreshToken)
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.trim()

  const results = await queryGoogleAds({
    query: `
      SELECT
        segments.device,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM campaign
      WHERE segments.date = '${dateKey}'
        AND campaign.status != 'REMOVED'
    `,
    customerId: creds.customerId,
    developerToken: creds.developerToken,
    accessToken,
    loginCustomerId,
  })

  // Aggregate by device
  const deviceMap = new Map<string, AdsDeviceRow>()
  for (const r of results as Record<string, Record<string, unknown>>[]) {
    const device = (r.segments?.device as string) || 'UNKNOWN'
    const existing = deviceMap.get(device) || { device, impressions: 0, clicks: 0, costMicros: 0, conversions: 0 }
    existing.impressions += Number(r.metrics?.impressions || 0)
    existing.clicks += Number(r.metrics?.clicks || 0)
    existing.costMicros += Number(r.metrics?.costMicros || 0)
    existing.conversions += Number(r.metrics?.conversions || 0)
    deviceMap.set(device, existing)
  }

  return Array.from(deviceMap.values()).sort((a, b) => b.costMicros - a.costMicros)
}

export async function getAdsOverview(dateKey: string): Promise<AdsOverview | null> {
  const creds = getAdsCredentials()
  if (!creds) return null

  const accessToken = await getAccessToken(creds.clientId, creds.clientSecret, creds.refreshToken)
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.trim()

  const results = await queryGoogleAds({
    query: `
      SELECT
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM customer
      WHERE segments.date = '${dateKey}'
    `,
    customerId: creds.customerId,
    developerToken: creds.developerToken,
    accessToken,
    loginCustomerId,
  })

  if (results.length === 0) return null

  const r = results[0] as Record<string, Record<string, unknown>>
  const impressions = Number(r.metrics?.impressions || 0)
  const clicks = Number(r.metrics?.clicks || 0)
  const costMicros = Number(r.metrics?.costMicros || 0)
  const conversions = Number(r.metrics?.conversions || 0)

  return {
    impressions,
    clicks,
    costMicros,
    conversions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    avgCpc: clicks > 0 ? microsToCny(costMicros) / clicks : 0,
  }
}

export { microsToCny }
