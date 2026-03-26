import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'

// Parse .env manually
const envContent = readFileSync('.env', 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

const sql = neon(process.env.DATABASE_URL)

await sql`
  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )
`

await sql`
  INSERT INTO site_settings (key, value) VALUES ('activation_url', 'https://chong.plus')
  ON CONFLICT (key) DO NOTHING
`

console.log('site_settings table created with default activation_url')
