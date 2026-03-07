import { neon } from '@neondatabase/serverless'

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL?.trim()
  if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL')
  }

  return neon(databaseUrl)
}
