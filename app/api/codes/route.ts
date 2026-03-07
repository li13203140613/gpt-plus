import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { releaseExpiredReservations } from '@/lib/payment/service'

export async function GET() {
  try {
    await releaseExpiredReservations()

    const sql = getDb()

    const codes = await sql`
      SELECT id, price
      FROM activation_codes
      WHERE status = 'available'
      ORDER BY created_at ASC
    `

    if (codes.length === 0) {
      return NextResponse.json({ product: null })
    }

    return NextResponse.json({
      product: {
        id: 'chatgpt-plus-monthly',
        price: Number(codes[0].price),
        stock: codes.length,
        title: 'ChatGPT Plus 一个月会员充值卡',
      },
    })
  } catch (error) {
    console.error('Error fetching product info:', error)
    return NextResponse.json({ error: 'Failed to load product info' }, { status: 500 })
  }
}
