import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const sql = getDb()
    const rows = await sql`SELECT key, value FROM site_settings`

    const settings: Record<string, string> = {}
    for (const row of rows) {
      settings[row.key] = row.value
    }

    return NextResponse.json(settings, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
    })
  } catch {
    return NextResponse.json({ activation_url: 'https://chong.plus' })
  }
}
