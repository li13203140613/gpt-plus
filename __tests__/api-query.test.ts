import { describe, it, expect, vi, beforeEach } from 'vitest'

// Set env BEFORE module loads (QUERY_API_KEY is read at import time)
process.env.QUERY_API_KEY = 'test-key-123'

// Mock neon query function — simulates the real neon() return value
const mockQuery = vi.fn()
const mockTaggedTemplate = Object.assign(
  vi.fn((..._args: unknown[]) => Promise.resolve([{ id: 1 }])),
  { query: mockQuery }
)

vi.mock('@/lib/db', () => ({
  getDb: () => mockTaggedTemplate,
}))

// Must import AFTER mock setup
const { GET, POST } = await import('@/app/api/query/route')

function makeGetRequest(params: Record<string, string>) {
  const url = new URL('http://localhost/api/query')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const req = new Request(url.toString())
  Object.defineProperty(req, 'nextUrl', { value: url })
  return req as any
}

describe('/api/query GET', () => {
  beforeEach(() => {
    mockQuery.mockReset()
    mockTaggedTemplate.mockReset()
  })

  it('returns 401 without auth key', async () => {
    const req = makeGetRequest({ table: 'gptplus_orders' })
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid table', async () => {
    const req = makeGetRequest({ table: 'users', key: 'test-key-123' })
    const res = await GET(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('Invalid table')
  })

  it('returns 400 for invalid order_by', async () => {
    const req = makeGetRequest({
      table: 'gptplus_orders',
      key: 'test-key-123',
      order_by: 'DROP TABLE',
    })
    const res = await GET(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toContain('Invalid order_by')
  })

  it('calls sql.query() (not tagged template) for dynamic queries', async () => {
    mockQuery.mockResolvedValueOnce([{ id: 1, status: 'completed' }])
    mockQuery.mockResolvedValueOnce([{ total: '1' }])

    const req = makeGetRequest({
      table: 'gptplus_orders',
      key: 'test-key-123',
    })
    const res = await GET(req)
    expect(res.status).toBe(200)

    // Key assertion: .query() was called, NOT the tagged template function directly
    expect(mockQuery).toHaveBeenCalledTimes(2)
    expect(mockTaggedTemplate).not.toHaveBeenCalled()

    // Verify the SQL contains correct structure
    const [dataSql, dataParams] = mockQuery.mock.calls[0]
    expect(dataSql).toContain('SELECT')
    expect(dataSql).toContain('FROM gptplus_orders')
    expect(dataSql).toContain('ORDER BY created_at DESC')
    expect(dataSql).toContain('LIMIT $1 OFFSET $2')
    expect(dataParams).toEqual([50, 0])

    // Count query should NOT include limit/offset params
    const [countSql, countParams] = mockQuery.mock.calls[1]
    expect(countSql).toContain('COUNT(*)')
    expect(countParams).toEqual([])
  })

  it('passes filter params correctly', async () => {
    mockQuery.mockResolvedValueOnce([])
    mockQuery.mockResolvedValueOnce([{ total: '0' }])

    const req = makeGetRequest({
      table: 'gptplus_orders',
      key: 'test-key-123',
      status: 'completed',
      payment_method: 'alipay',
      limit: '10',
      offset: '5',
    })
    const res = await GET(req)
    expect(res.status).toBe(200)

    const [dataSql, dataParams] = mockQuery.mock.calls[0]
    expect(dataSql).toContain('status = $1')
    expect(dataSql).toContain('payment_method = $2')
    expect(dataSql).toContain('LIMIT $3 OFFSET $4')
    expect(dataParams).toEqual(['completed', 'alipay', 10, 5])

    // Count query excludes limit/offset
    const [, countParams] = mockQuery.mock.calls[1]
    expect(countParams).toEqual(['completed', 'alipay'])
  })

  it('returns correct pagination structure', async () => {
    mockQuery.mockResolvedValueOnce([{ id: 1 }, { id: 2 }])
    mockQuery.mockResolvedValueOnce([{ total: '100' }])

    const req = makeGetRequest({
      table: 'gptplus_orders',
      key: 'test-key-123',
      limit: '2',
      offset: '0',
    })
    const res = await GET(req)
    const body = await res.json()

    expect(body.table).toBe('gptplus_orders')
    expect(body.data).toHaveLength(2)
    expect(body.pagination).toEqual({
      total: 100,
      limit: 2,
      offset: 0,
      has_more: true,
    })
  })

  it('handles date range filters', async () => {
    mockQuery.mockResolvedValueOnce([])
    mockQuery.mockResolvedValueOnce([{ total: '0' }])

    const req = makeGetRequest({
      table: 'gptplus_orders',
      key: 'test-key-123',
      date_from: '2026-04-01',
      date_to: '2026-04-05',
    })
    const res = await GET(req)
    expect(res.status).toBe(200)

    const [dataSql, dataParams] = mockQuery.mock.calls[0]
    expect(dataSql).toContain('created_at >= $1::timestamptz')
    expect(dataSql).toContain('created_at <= $2::timestamptz')
    expect(dataParams).toEqual(['2026-04-01', '2026-04-05', 50, 0])
  })

  it('caps limit at 500', async () => {
    mockQuery.mockResolvedValueOnce([])
    mockQuery.mockResolvedValueOnce([{ total: '0' }])

    const req = makeGetRequest({
      table: 'gptplus_orders',
      key: 'test-key-123',
      limit: '9999',
    })
    await GET(req)

    const [, dataParams] = mockQuery.mock.calls[0]
    expect(dataParams[dataParams.length - 2]).toBe(500)
  })
})

describe('/api/query POST', () => {
  beforeEach(() => {
    mockQuery.mockReset()
    mockTaggedTemplate.mockReset()
  })

  it('returns 401 without auth', async () => {
    const req = new Request('http://localhost/api/query', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'overview' }),
    })
    Object.defineProperty(req, 'nextUrl', { value: new URL(req.url) })
    const res = await POST(req as any)
    expect(res.status).toBe(401)
  })

  it('uses tagged template for overview (not .query())', async () => {
    mockTaggedTemplate.mockResolvedValue([
      { total: '5', available: '3', reserved: '1', sold: '1' },
    ])

    const req = new Request('http://localhost/api/query?key=test-key-123', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'overview' }),
    })
    Object.defineProperty(req, 'nextUrl', { value: new URL(req.url) })
    const res = await POST(req as any)
    expect(res.status).toBe(200)

    // POST uses tagged template (not .query())
    expect(mockTaggedTemplate).toHaveBeenCalled()
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('returns 400 for invalid type', async () => {
    const req = new Request('http://localhost/api/query?key=test-key-123', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'invalid' }),
    })
    Object.defineProperty(req, 'nextUrl', { value: new URL(req.url) })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })
})
