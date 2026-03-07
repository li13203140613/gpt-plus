import { createHmac } from 'node:crypto'
import { getDb } from '@/lib/db'

const REPORT_TIMEZONE = 'Asia/Shanghai'
const DEFAULT_SITE_NAME = 'GPT Plus'

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

  const sections = await Promise.all([
    getBusinessSection(window),
    getRevenueSection(window),
  ])

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
