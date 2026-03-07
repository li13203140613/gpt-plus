import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

const ADMIN_KEY = process.env.ADMIN_API_KEY?.trim() || 'change-me-in-production'

function checkAuth(request: NextRequest) {
  const key =
    request.headers.get('x-admin-key') ||
    request.headers.get('x-admin-password')

  return key?.trim() === ADMIN_KEY
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
  const available = codes.filter((code) => code.status === 'available').length
  const reserved = codes.filter((code) => code.status === 'reserved').length
  const sold = codes.filter((code) => code.status === 'sold').length
  const revenue = codes
    .filter((code) => code.status === 'sold')
    .reduce((sum, code) => sum + Number(code.price), 0)

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
    return NextResponse.json({ error: 'Missing activation code list' }, { status: 400 })
  }

  const sql = getDb()
  let added = 0

  for (const code of codes) {
    const trimmed = String(code).trim()
    if (!trimmed) continue

    try {
      await sql`
        INSERT INTO activation_codes (code, price, status)
        VALUES (${trimmed}, ${price}, 'available')
        ON CONFLICT (code) DO NOTHING
      `
      added++
    } catch {
      // Ignore duplicates and continue.
    }
  }

  return NextResponse.json({ added })
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await request.json()

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing code ID' }, { status: 400 })
  }

  const sql = getDb()

  await sql`
    DELETE FROM gptplus_orders
    WHERE code_id = ${id}
      AND status != 'completed'
  `

  const deleted = await sql`
    DELETE FROM activation_codes
    WHERE id = ${id}
      AND status = 'available'
    RETURNING id
  `

  if (deleted.length === 0) {
    return NextResponse.json({ error: 'Only available codes can be deleted' }, { status: 400 })
  }

  return NextResponse.json({ deleted: true })
}
