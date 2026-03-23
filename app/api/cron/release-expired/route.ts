import { NextRequest, NextResponse } from 'next/server'
import { releaseExpiredReservations } from '@/lib/payment/service'

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
    await releaseExpiredReservations()
    return NextResponse.json({ ok: true, message: 'Expired reservations released' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to release expired reservations'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
