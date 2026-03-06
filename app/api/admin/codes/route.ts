import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

const ADMIN_KEY = process.env.ADMIN_API_KEY || 'change-me-in-production'

function checkAuth(request: NextRequest) {
  const key =
    request.headers.get('x-admin-key') ||
    request.headers.get('x-admin-password')
  return key === ADMIN_KEY
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sql = getDb()

  const codes = await sql`
    SELECT * FROM activation_codes ORDER BY created_at DESC
  `

  const total = codes.length
  const available = codes.filter((c) => c.status === 'available').length
  const reserved = codes.filter((c) => c.status === 'reserved').length
  const sold = codes.filter((c) => c.status === 'sold').length
  const revenue = codes
    .filter((c) => c.status === 'sold')
    .reduce((sum, c) => sum + Number(c.price), 0)

  return NextResponse.json({
    codes,
    stats: { total, available, reserved, sold, revenue },
  })
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { codes, price = 99 } = await request.json()

  if (!codes || !Array.isArray(codes)) {
    return NextResponse.json({ error: '请提供激活码数组' }, { status: 400 })
  }

  const sql = getDb()
  let added = 0

  for (const code of codes) {
    const trimmed = (code as string).trim()
    if (!trimmed) continue

    try {
      await sql`
        INSERT INTO activation_codes (code, price, status)
        VALUES (${trimmed}, ${price}, 'available')
        ON CONFLICT (code) DO NOTHING
      `
      added++
    } catch {
      // skip duplicates
    }
  }

  return NextResponse.json({ added })
}
