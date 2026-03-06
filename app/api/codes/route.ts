import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { releaseExpiredReservations } from '@/lib/payment/service'

export async function GET() {
  try {
    await releaseExpiredReservations()

    const sql = getDb()

    const codes = await sql`
      SELECT id, code, price
      FROM activation_codes
      WHERE status = 'available'
      ORDER BY created_at ASC
    `

    const maskedCodes = codes.map((c) => ({
      id: c.id,
      maskedCode: c.code.slice(0, -4) + '****',
      price: c.price,
    }))

    return NextResponse.json({ codes: maskedCodes })
  } catch (err) {
    console.error('Error fetching codes:', err)
    return NextResponse.json({ error: '获取激活码失败' }, { status: 500 })
  }
}
