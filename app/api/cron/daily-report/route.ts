import { NextRequest, NextResponse } from 'next/server'
import { buildDailyReport, sendDailyReportToFeishu } from '@/lib/reporting/daily-report'

export const runtime = 'nodejs'

function isAuthorized(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim()
  const authHeader = request.headers.get('authorization')

  if (!cronSecret) return false

  return authHeader === `Bearer ${cronSecret}`
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const reportDate = url.searchParams.get('date') || undefined
    const dryRun = url.searchParams.get('dry_run') === '1'
    const report = await buildDailyReport(reportDate)

    if (dryRun) {
      return NextResponse.json({
        ok: true,
        mode: 'dry-run',
        report,
      })
    }

    await sendDailyReportToFeishu(report)

    return NextResponse.json({
      ok: true,
      reportDate: report.reportDate,
      sections: report.sections.map((section) => section.title),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send daily report'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
