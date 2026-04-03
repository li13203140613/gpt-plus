import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { sendRenewalReminderEmail } from '@/lib/email'

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
    const sql = getDb()

    // Find codes expiring tomorrow (sold_at + 29 days <= now < sold_at + 30 days)
    const dayBeforeCodes = await sql`
      SELECT id, buyer_email, sold_at
      FROM activation_codes
      WHERE status = 'sold'
        AND buyer_email IS NOT NULL
        AND buyer_email != ''
        AND (renewal_reminder_1_sent IS NOT TRUE)
        AND sold_at + INTERVAL '29 days' <= NOW()
        AND sold_at + INTERVAL '30 days' > NOW()
    `

    // Find codes expiring today (sold_at + 30 days <= now < sold_at + 31 days)
    const dayOfCodes = await sql`
      SELECT id, buyer_email, sold_at
      FROM activation_codes
      WHERE status = 'sold'
        AND buyer_email IS NOT NULL
        AND buyer_email != ''
        AND (renewal_reminder_2_sent IS NOT TRUE)
        AND sold_at + INTERVAL '30 days' <= NOW()
        AND sold_at + INTERVAL '31 days' > NOW()
    `

    let sent1 = 0
    let sent2 = 0

    // Send day-before reminders
    for (const code of dayBeforeCodes) {
      try {
        await sendRenewalReminderEmail({ to: code.buyer_email, type: 'day_before', soldAt: code.sold_at })
        await sql`
          UPDATE activation_codes
          SET renewal_reminder_1_sent = TRUE, updated_at = NOW()
          WHERE id = ${code.id}
        `
        sent1++
        console.log(`[renewalReminder] Sent day-before reminder to ${code.buyer_email}`)
      } catch (err) {
        console.error(`[renewalReminder] Failed day-before to ${code.buyer_email}:`, err)
      }
    }

    // Send day-of reminders
    for (const code of dayOfCodes) {
      try {
        await sendRenewalReminderEmail({ to: code.buyer_email, type: 'day_of', soldAt: code.sold_at })
        await sql`
          UPDATE activation_codes
          SET renewal_reminder_2_sent = TRUE, updated_at = NOW()
          WHERE id = ${code.id}
        `
        sent2++
        console.log(`[renewalReminder] Sent day-of reminder to ${code.buyer_email}`)
      } catch (err) {
        console.error(`[renewalReminder] Failed day-of to ${code.buyer_email}:`, err)
      }
    }

    return NextResponse.json({
      ok: true,
      dayBefore: { checked: dayBeforeCodes.length, sent: sent1 },
      dayOf: { checked: dayOfCodes.length, sent: sent2 },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send renewal reminders'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
