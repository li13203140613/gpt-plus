import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { sendPaymentFailedEmail } from '@/lib/email'

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

    // Find pending orders created 2-10 minutes ago that haven't been reminded yet
    const pendingOrders = await sql`
      SELECT o.stripe_session_id, o.buyer_email
      FROM gptplus_orders o
      WHERE o.status = 'pending'
        AND o.buyer_email IS NOT NULL
        AND o.buyer_email != ''
        AND o.reminder_sent IS NOT TRUE
        AND o.created_at < NOW() - INTERVAL '2 minutes'
        AND o.created_at > NOW() - INTERVAL '10 minutes'
    `

    let sent = 0
    for (const order of pendingOrders) {
      try {
        await sendPaymentFailedEmail({ to: order.buyer_email })
        await sql`
          UPDATE gptplus_orders
          SET reminder_sent = TRUE
          WHERE stripe_session_id = ${order.stripe_session_id}
        `
        sent++
        console.log(`[paymentReminder] Sent reminder to ${order.buyer_email}`)
      } catch (err) {
        console.error(`[paymentReminder] Failed to send to ${order.buyer_email}:`, err)
      }
    }

    return NextResponse.json({ ok: true, checked: pendingOrders.length, sent })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send payment reminders'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
