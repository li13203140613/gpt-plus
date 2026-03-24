import { createHmac } from 'node:crypto'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { google } from 'googleapis'
import { getDb } from '@/lib/db'
import {
  getAdsOverview,
  getAdsCampaigns,
  getAdsKeywords,
  getAdsSearchTerms,
  getAdsDevicePerformance,
  microsToCny,
} from './google-ads'

const REPORT_TIMEZONE = 'Asia/Shanghai'
const DEFAULT_SITE_NAME = 'GPT Plus'

function getGoogleCredentials() {
  const clientEmail = process.env.GOOGLE_SA_CLIENT_EMAIL?.trim()
  const privateKey = process.env.GOOGLE_SA_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!clientEmail || !privateKey) return null
  return { client_email: clientEmail, private_key: privateKey }
}

interface ReportWindow {
  label: string
  startIso: string
  endIso: string
}

interface ReportMetric {
  label: string
  value: string
}

interface ReportSection {
  icon: string
  title: string
  source: string
  date: string
  metrics: ReportMetric[]
}

export interface DailyReportPayload {
  siteName: string
  reportDate: string
  sections: ReportSection[]
}

function getDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: REPORT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  if (!year || !month || !day) {
    throw new Error('Failed to resolve report date in Asia/Shanghai')
  }

  return { year, month, day }
}

function formatDateKey(date: Date) {
  const { year, month, day } = getDateParts(date)
  return `${year}-${month}-${day}`
}

function shiftDateKey(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T00:00:00+08:00`)
  date.setUTCDate(date.getUTCDate() + days)
  return formatDateKey(date)
}

function resolveReportWindow(dateKey?: string): ReportWindow {
  const reportDate = dateKey || shiftDateKey(formatDateKey(new Date()), -1)

  if (!/^\d{4}-\d{2}-\d{2}$/.test(reportDate)) {
    throw new Error('Invalid report date. Expected YYYY-MM-DD.')
  }

  const nextDate = shiftDateKey(reportDate, 1)

  return {
    label: reportDate,
    startIso: new Date(`${reportDate}T00:00:00+08:00`).toISOString(),
    endIso: new Date(`${nextDate}T00:00:00+08:00`).toISOString(),
  }
}

function toNumber(value: unknown) {
  return typeof value === 'number' ? value : Number(value || 0)
}

function formatInteger(value: number) {
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(value)
}

function formatCurrency(value: number) {
  return `CNY ${new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`
}

async function getBusinessSection(window: ReportWindow): Promise<ReportSection> {
  const sql = getDb()

  const [row] = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM activation_codes) AS total_codes,
      (SELECT COUNT(*)::int FROM activation_codes WHERE status = 'available') AS available_codes,
      (SELECT COUNT(*)::int FROM activation_codes WHERE status = 'reserved') AS reserved_codes,
      (SELECT COUNT(*)::int FROM activation_codes WHERE status = 'sold') AS sold_codes,
      (SELECT COUNT(*)::int FROM gptplus_orders WHERE status = 'pending') AS pending_orders,
      (SELECT COUNT(*)::int FROM gptplus_orders WHERE status = 'expired') AS expired_orders,
      (SELECT COUNT(*)::int FROM gptplus_orders WHERE created_at >= ${window.startIso} AND created_at < ${window.endIso}) AS daily_new_orders,
      (SELECT COUNT(*)::int FROM gptplus_orders WHERE status = 'completed' AND completed_at >= ${window.startIso} AND completed_at < ${window.endIso}) AS daily_completed_orders
  `

  return {
    icon: '📋',
    title: '业务数据',
    source: '后台',
    date: window.label,
    metrics: [
      { label: '总库存', value: formatInteger(toNumber(row.total_codes)) },
      { label: '可售库存', value: formatInteger(toNumber(row.available_codes)) },
      { label: '预留中', value: formatInteger(toNumber(row.reserved_codes)) },
      { label: '累计已售', value: formatInteger(toNumber(row.sold_codes)) },
      { label: '昨日新订单', value: formatInteger(toNumber(row.daily_new_orders)) },
      { label: '昨日成交订单', value: formatInteger(toNumber(row.daily_completed_orders)) },
      { label: '待支付订单', value: formatInteger(toNumber(row.pending_orders)) },
      { label: '已过期订单', value: formatInteger(toNumber(row.expired_orders)) },
    ],
  }
}

async function getRevenueSection(window: ReportWindow): Promise<ReportSection> {
  const sql = getDb()

  const [row] = await sql`
    SELECT
      COUNT(*) FILTER (
        WHERE status = 'completed'
          AND completed_at >= ${window.startIso}
          AND completed_at < ${window.endIso}
      )::int AS daily_orders,
      COALESCE(SUM(amount) FILTER (
        WHERE status = 'completed'
          AND completed_at >= ${window.startIso}
          AND completed_at < ${window.endIso}
      ), 0)::numeric AS daily_revenue,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS total_orders,
      COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0)::numeric AS total_revenue
    FROM gptplus_orders
  `

  return {
    icon: '💰',
    title: '收入数据',
    source: '后台',
    date: window.label,
    metrics: [
      { label: '昨日订单数', value: formatInteger(toNumber(row.daily_orders)) },
      { label: '昨日收入', value: formatCurrency(toNumber(row.daily_revenue)) },
      { label: '累计订单数', value: formatInteger(toNumber(row.total_orders)) },
      { label: '累计收入', value: formatCurrency(toNumber(row.total_revenue)) },
    ],
  }
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`
}

function formatDecimal(value: number, digits = 1) {
  return value.toFixed(digits)
}

async function getGA4Section(window: ReportWindow): Promise<ReportSection | null> {
  const credentials = getGoogleCredentials()
  const propertyId = process.env.GA4_PROPERTY_ID?.trim()

  if (!credentials || !propertyId) return null

  const client = new BetaAnalyticsDataClient({ credentials })

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: window.label, endDate: window.label }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'newUsers' },
      { name: 'screenPageViews' },
      { name: 'sessions' },
      { name: 'bounceRate' },
      { name: 'averageSessionDuration' },
    ],
  })

  const row = response.rows?.[0]
  const get = (i: number) => toNumber(row?.metricValues?.[i]?.value)

  return {
    icon: '📊',
    title: '网站流量',
    source: 'GA4',
    date: window.label,
    metrics: [
      { label: '活跃用户', value: formatInteger(get(0)) },
      { label: '新用户', value: formatInteger(get(1)) },
      { label: '页面浏览', value: formatInteger(get(2)) },
      { label: '会话数', value: formatInteger(get(3)) },
      { label: '跳出率', value: formatPercent(get(4)) },
      { label: '平均会话时长', value: `${formatDecimal(get(5))}s` },
    ],
  }
}

async function getTrafficSourceSection(window: ReportWindow): Promise<ReportSection | null> {
  const credentials = getGoogleCredentials()
  const propertyId = process.env.GA4_PROPERTY_ID?.trim()

  if (!credentials || !propertyId) return null

  const client = new BetaAnalyticsDataClient({ credentials })

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: window.label, endDate: window.label }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 8,
  })

  const rows = response.rows
  if (!rows || rows.length === 0) return null

  const metrics: ReportMetric[] = rows.map((r) => {
    const channel = r.dimensionValues?.[0]?.value || '(unknown)'
    const sessions = toNumber(r.metricValues?.[0]?.value)
    const users = toNumber(r.metricValues?.[1]?.value)
    return {
      label: channel,
      value: `会话 ${formatInteger(sessions)} · 用户 ${formatInteger(users)}`,
    }
  })

  return {
    icon: '🔗',
    title: '流量来源',
    source: 'GA4',
    date: window.label,
    metrics,
  }
}

async function getTopPagesSection(window: ReportWindow): Promise<ReportSection | null> {
  const credentials = getGoogleCredentials()
  const propertyId = process.env.GA4_PROPERTY_ID?.trim()

  if (!credentials || !propertyId) return null

  const client = new BetaAnalyticsDataClient({ credentials })

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: window.label, endDate: window.label }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'activeUsers' },
    ],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 8,
  })

  const rows = response.rows
  if (!rows || rows.length === 0) return null

  const metrics: ReportMetric[] = rows.map((r) => {
    const page = r.dimensionValues?.[0]?.value || '/'
    const views = toNumber(r.metricValues?.[0]?.value)
    const users = toNumber(r.metricValues?.[1]?.value)
    return {
      label: page,
      value: `浏览 ${formatInteger(views)} · 用户 ${formatInteger(users)}`,
    }
  })

  return {
    icon: '📄',
    title: '热门页面',
    source: 'GA4',
    date: window.label,
    metrics,
  }
}

async function getDeviceSection(window: ReportWindow): Promise<ReportSection | null> {
  const credentials = getGoogleCredentials()
  const propertyId = process.env.GA4_PROPERTY_ID?.trim()

  if (!credentials || !propertyId) return null

  const client = new BetaAnalyticsDataClient({ credentials })

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: window.label, endDate: window.label }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  })

  const rows = response.rows
  if (!rows || rows.length === 0) return null

  const deviceMap: Record<string, string> = { desktop: '💻 桌面端', mobile: '📱 移动端', tablet: '📟 平板' }

  const metrics: ReportMetric[] = rows.map((r) => {
    const device = r.dimensionValues?.[0]?.value || 'unknown'
    const sessions = toNumber(r.metricValues?.[0]?.value)
    const users = toNumber(r.metricValues?.[1]?.value)
    return {
      label: deviceMap[device] || device,
      value: `会话 ${formatInteger(sessions)} · 用户 ${formatInteger(users)}`,
    }
  })

  return {
    icon: '📱',
    title: '设备分布',
    source: 'GA4',
    date: window.label,
    metrics,
  }
}

async function getFunnelSection(window: ReportWindow): Promise<ReportSection | null> {
  const credentials = getGoogleCredentials()
  const propertyId = process.env.GA4_PROPERTY_ID?.trim()

  if (!credentials || !propertyId) return null

  const client = new BetaAnalyticsDataClient({ credentials })

  const eventNames = ['email_focus', 'begin_checkout', 'checkout_redirect', 'purchase']

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: window.label, endDate: window.label }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        inListFilter: { values: eventNames },
      },
    },
  })

  const counts: Record<string, number> = {}
  for (const r of response.rows || []) {
    const name = r.dimensionValues?.[0]?.value || ''
    counts[name] = toNumber(r.metricValues?.[0]?.value)
  }

  // Only show if at least one funnel event has data
  if (Object.values(counts).every((v) => v === 0)) return null

  const funnelLabels: Record<string, string> = {
    email_focus: '📧 邮箱聚焦',
    begin_checkout: '💳 发起支付',
    checkout_redirect: '🔀 跳转Stripe',
    purchase: '✅ 支付完成',
  }

  const metrics: ReportMetric[] = eventNames.map((name, i) => {
    const count = counts[name] || 0
    const prev = i > 0 ? counts[eventNames[i - 1]] || 0 : 0
    const rate = i > 0 && prev > 0 ? ` (${formatPercent(count / prev)})` : ''
    return {
      label: funnelLabels[name] || name,
      value: `${formatInteger(count)}${rate}`,
    }
  })

  return {
    icon: '🔄',
    title: '转化漏斗',
    source: 'GA4 Events',
    date: window.label,
    metrics,
  }
}

async function getAdsOverviewSection(window: ReportWindow): Promise<ReportSection | null> {
  const overview = await getAdsOverview(window.label)
  if (!overview || (overview.impressions === 0 && overview.costMicros === 0)) return null

  const cost = microsToCny(overview.costMicros)
  const cpa = overview.conversions > 0 ? cost / overview.conversions : 0

  return {
    icon: '📣',
    title: '广告总览',
    source: 'Google Ads API',
    date: window.label,
    metrics: [
      { label: '展示量', value: formatInteger(overview.impressions) },
      { label: '点击量', value: formatInteger(overview.clicks) },
      { label: '点击率', value: formatPercent(overview.ctr) },
      { label: '花费', value: formatCurrency(cost) },
      { label: '平均CPC', value: formatCurrency(overview.avgCpc) },
      { label: '转化数', value: formatDecimal(overview.conversions) },
      ...(cpa > 0 ? [{ label: '转化成本', value: formatCurrency(cpa) }] : []),
    ],
  }
}

async function getAdsCampaignSection(window: ReportWindow): Promise<ReportSection | null> {
  const campaigns = await getAdsCampaigns(window.label)
  if (!campaigns || campaigns.length === 0) return null

  const metrics: ReportMetric[] = campaigns.map((c) => {
    const cost = microsToCny(c.costMicros)
    const ctr = c.impressions > 0 ? (c.clicks / c.impressions * 100).toFixed(1) + '%' : '0%'
    return {
      label: c.name,
      value: `展示 ${formatInteger(c.impressions)} · 点击 ${formatInteger(c.clicks)}(${ctr}) · 花费 ${formatCurrency(cost)} · 转化 ${formatDecimal(c.conversions)}`,
    }
  })

  return {
    icon: '🎯',
    title: '广告系列',
    source: 'Google Ads API',
    date: window.label,
    metrics,
  }
}

async function getAdsKeywordSection(window: ReportWindow): Promise<ReportSection | null> {
  const keywords = await getAdsKeywords(window.label)
  if (!keywords || keywords.length === 0) return null

  const metrics: ReportMetric[] = keywords.map((k) => {
    const cost = microsToCny(k.costMicros)
    const qs = k.qualityScore !== null ? ` · QS ${k.qualityScore}` : ''
    return {
      label: k.keyword,
      value: `点击 ${formatInteger(k.clicks)} · 花费 ${formatCurrency(cost)} · 转化 ${formatDecimal(k.conversions)}${qs}`,
    }
  })

  return {
    icon: '🔑',
    title: '关键词表现',
    source: 'Google Ads API',
    date: window.label,
    metrics,
  }
}

async function getAdsSearchTermSection(window: ReportWindow): Promise<ReportSection | null> {
  const terms = await getAdsSearchTerms(window.label)
  if (!terms || terms.length === 0) return null

  const metrics: ReportMetric[] = terms.map((t) => {
    const cost = microsToCny(t.costMicros)
    return {
      label: t.searchTerm,
      value: `展示 ${formatInteger(t.impressions)} · 点击 ${formatInteger(t.clicks)} · 花费 ${formatCurrency(cost)}`,
    }
  })

  return {
    icon: '🔍',
    title: '搜索词报告',
    source: 'Google Ads API',
    date: window.label,
    metrics,
  }
}

async function getAdsDeviceSection(window: ReportWindow): Promise<ReportSection | null> {
  const devices = await getAdsDevicePerformance(window.label)
  if (!devices || devices.length === 0) return null

  const deviceNames: Record<string, string> = {
    MOBILE: '📱 移动端',
    DESKTOP: '💻 桌面端',
    TABLET: '📟 平板',
    OTHER: '❓ 其他',
    CONNECTED_TV: '📺 智能电视',
    UNKNOWN: '❓ 未知',
  }

  const metrics: ReportMetric[] = devices.map((d) => {
    const cost = microsToCny(d.costMicros)
    const ctr = d.impressions > 0 ? (d.clicks / d.impressions * 100).toFixed(1) + '%' : '0%'
    return {
      label: deviceNames[d.device] || d.device,
      value: `点击 ${formatInteger(d.clicks)}(${ctr}) · 花费 ${formatCurrency(cost)} · 转化 ${formatDecimal(d.conversions)}`,
    }
  })

  return {
    icon: '📱',
    title: '广告设备分布',
    source: 'Google Ads API',
    date: window.label,
    metrics,
  }
}

async function getGSCSection(window: ReportWindow): Promise<ReportSection | null> {
  const credentials = getGoogleCredentials()
  const siteUrl = process.env.GSC_SITE_URL?.trim()

  if (!credentials || !siteUrl) return null

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  })

  const searchconsole = google.searchconsole({ version: 'v1', auth })

  // GSC data usually has 2-3 day delay, query a wider range and show totals
  const gscStart = shiftDateKey(window.label, -3)

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: gscStart,
      endDate: window.label,
      dimensions: [],
    },
  })

  const row = res.data.rows?.[0]

  return {
    icon: '🔍',
    title: '搜索表现',
    source: 'GSC',
    date: `${gscStart} ~ ${window.label}`,
    metrics: [
      { label: '展示量', value: formatInteger(row?.impressions ?? 0) },
      { label: '点击量', value: formatInteger(row?.clicks ?? 0) },
      { label: '平均点击率', value: formatPercent(row?.ctr ?? 0) },
      { label: '平均排名', value: formatDecimal(row?.position ?? 0) },
    ],
  }
}

function buildSectionElements(section: ReportSection) {
  return [
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: `${section.icon} **${section.title}** · ${section.date} · 来源: ${section.source}`,
      },
    },
    {
      tag: 'div',
      fields: section.metrics.map((metric) => ({
        is_short: true,
        text: {
          tag: 'lark_md',
          content: `**${metric.label}**\n${metric.value}`,
        },
      })),
    },
  ]
}

function buildFeishuCard(report: DailyReportPayload) {
  const elements: Array<Record<string, unknown>> = []

  report.sections.forEach((section, index) => {
    elements.push(...buildSectionElements(section))

    if (index < report.sections.length - 1) {
      elements.push({ tag: 'hr' })
    }
  })

  return {
    config: {
      wide_screen_mode: true,
      enable_forward: true,
    },
    header: {
      template: 'blue',
      title: {
        tag: 'plain_text',
        content: `${report.siteName} 日报 - ${report.reportDate}`,
      },
    },
    elements,
  }
}

function buildFeishuSignature(secret: string) {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const stringToSign = `${timestamp}\n${secret}`
  const sign = createHmac('sha256', stringToSign).update('').digest('base64')

  return { timestamp, sign }
}

export async function buildDailyReport(dateKey?: string): Promise<DailyReportPayload> {
  const siteName = process.env.REPORT_SITE_NAME?.trim() || DEFAULT_SITE_NAME
  const window = resolveReportWindow(dateKey)

  const results = await Promise.all([
    getBusinessSection(window),
    getRevenueSection(window),
    getGA4Section(window).catch(() => null),
    getTrafficSourceSection(window).catch(() => null),
    getTopPagesSection(window).catch(() => null),
    getDeviceSection(window).catch(() => null),
    getFunnelSection(window).catch(() => null),
    getGSCSection(window).catch(() => null),
    getAdsOverviewSection(window).catch(() => null),
    getAdsCampaignSection(window).catch(() => null),
    getAdsKeywordSection(window).catch(() => null),
    getAdsSearchTermSection(window).catch(() => null),
    getAdsDeviceSection(window).catch(() => null),
  ])

  const sections = results.filter(
    (s): s is ReportSection => s !== null,
  )

  return {
    siteName,
    reportDate: window.label,
    sections,
  }
}

export async function sendDailyReportToFeishu(report: DailyReportPayload) {
  const webhook = process.env.FEISHU_BOT_WEBHOOK?.trim()
  const secret = process.env.FEISHU_BOT_SECRET?.trim()

  if (!webhook) {
    throw new Error('Missing FEISHU_BOT_WEBHOOK')
  }

  const securityPayload = secret ? buildFeishuSignature(secret) : {}
  const response = await fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...securityPayload,
      msg_type: 'interactive',
      card: buildFeishuCard(report),
    }),
  })

  const payload = await response.json()

  if (!response.ok || payload?.code !== 0) {
    throw new Error(payload?.msg || `Feishu webhook request failed with ${response.status}`)
  }

  return payload
}
