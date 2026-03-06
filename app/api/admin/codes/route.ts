import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

const ADMIN_KEY = process.env.ADMIN_API_KEY || 'change-me-in-production'

function checkAuth(request: NextRequest) {
  const key = request.headers.get('x-admin-key')
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

  return NextResponse.json({ codes })
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
  let inserted = 0

  for (const code of codes) {
    const trimmed = (code as string).trim()
    if (!trimmed) continue

    await sql`
      INSERT INTO activation_codes (code, price, status)
      VALUES (${trimmed}, ${price}, 'available')
      ON CONFLICT (code) DO NOTHING
    `
    inserted++
  }

  return NextResponse.json({ inserted })
}
