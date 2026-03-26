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
  const rows = await sql`SELECT key, value, updated_at FROM site_settings ORDER BY key`

  const settings: Record<string, string> = {}
  for (const row of rows) {
    settings[row.key] = row.value
  }

  return NextResponse.json({ settings })
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { key, value } = await request.json()

  if (!key || typeof key !== 'string' || typeof value !== 'string') {
    return NextResponse.json({ error: 'Missing key or value' }, { status: 400 })
  }

  const sql = getDb()
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${key}, ${value}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
  `

  return NextResponse.json({ success: true })
}
