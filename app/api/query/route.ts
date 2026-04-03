import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// 使用独立的 API key，与 admin key 分开
const QUERY_API_KEY = process.env.QUERY_API_KEY?.trim()

function checkAuth(request: NextRequest) {
  if (!QUERY_API_KEY) {
    return false // 未配置 key 则禁止访问
  }
  const key =
    request.headers.get('x-api-key') ||
    request.nextUrl.searchParams.get('key')
  return key?.trim() === QUERY_API_KEY
}

// 允许查询的表（白名单）
const ALLOWED_TABLES = ['activation_codes', 'gptplus_orders', 'site_settings'] as const
type AllowedTable = (typeof ALLOWED_TABLES)[number]

// 每张表允许返回的字段（隐藏敏感字段）
const TABLE_FIELDS: Record<AllowedTable, string[]> = {
  activation_codes: [
    'id', 'price', 'status', 'buyer_email',
    'reserved_at', 'sold_at', 'created_at', 'updated_at',
    'renewal_reminder_1_sent', 'renewal_reminder_2_sent',
  ],
  gptplus_orders: [
    'id', 'code_id', 'amount', 'status', 'buyer_email',
    'currency', 'paid_amount', 'payment_method',
    'completed_at', 'created_at', 'reminder_sent',
  ],
  site_settings: ['key', 'value', 'updated_at'],
}

// 允许筛选的字段
const FILTERABLE_FIELDS: Record<AllowedTable, string[]> = {
  activation_codes: ['status', 'buyer_email'],
  gptplus_orders: ['status', 'buyer_email', 'payment_method', 'currency'],
  site_settings: ['key'],
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const params = request.nextUrl.searchParams
  const table = params.get('table')
  const limit = Math.min(Number(params.get('limit')) || 50, 500)
  const offset = Math.max(Number(params.get('offset')) || 0, 0)
  const orderBy = params.get('order_by') || 'created_at'
  const order = params.get('order') === 'asc' ? 'ASC' : 'DESC'

  if (!table || !ALLOWED_TABLES.includes(table as AllowedTable)) {
    return NextResponse.json({
      error: `Invalid table. Allowed: ${ALLOWED_TABLES.join(', ')}`,
    }, { status: 400 })
  }

  const tableName = table as AllowedTable
  const fields = TABLE_FIELDS[tableName]
  const filterableFields = FILTERABLE_FIELDS[tableName]

  // 验证 order_by 字段
  if (!fields.includes(orderBy)) {
    return NextResponse.json({
      error: `Invalid order_by. Allowed: ${fields.join(', ')}`,
    }, { status: 400 })
  }

  // 构建筛选条件
  const conditions: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  for (const field of filterableFields) {
    const val = params.get(field)
    if (val !== null) {
      conditions.push(`${field} = $${paramIndex}`)
      values.push(val)
      paramIndex++
    }
  }

  // 日期范围筛选
  const dateFrom = params.get('date_from')
  const dateTo = params.get('date_to')
  const dateField = tableName === 'site_settings' ? 'updated_at' : 'created_at'

  if (dateFrom) {
    conditions.push(`${dateField} >= $${paramIndex}::timestamptz`)
    values.push(dateFrom)
    paramIndex++
  }
  if (dateTo) {
    conditions.push(`${dateField} <= $${paramIndex}::timestamptz`)
    values.push(dateTo)
    paramIndex++
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const selectFields = fields.join(', ')

  try {
    const sql = getDb()

    // 查询数据
    const query = `
      SELECT ${selectFields}
      FROM ${tableName}
      ${whereClause}
      ORDER BY ${orderBy} ${order}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    values.push(limit, offset)

    const rows = await sql(query, values)

    // 查询总数
    const countQuery = `SELECT COUNT(*) as total FROM ${tableName} ${whereClause}`
    const countResult = await sql(countQuery, values.slice(0, -2))
    const total = Number(countResult[0].total)

    return NextResponse.json({
      table: tableName,
      data: rows,
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Query API error:', error)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }
}

// 统计接口
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type } = await request.json()

  try {
    const sql = getDb()

    if (type === 'overview') {
      // 总览统计
      const [codes, orders] = await Promise.all([
        sql`
          SELECT
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'available') as available,
            COUNT(*) FILTER (WHERE status = 'reserved') as reserved,
            COUNT(*) FILTER (WHERE status = 'sold') as sold
          FROM activation_codes
        `,
        sql`
          SELECT
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'completed') as completed,
            COUNT(*) FILTER (WHERE status = 'pending') as pending,
            COUNT(*) FILTER (WHERE status = 'expired') as expired,
            COUNT(*) FILTER (WHERE status = 'failed') as failed,
            COUNT(*) FILTER (WHERE status = 'refunded') as refunded,
            COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as total_revenue,
            COALESCE(SUM(paid_amount) FILTER (WHERE status = 'completed'), 0) as total_paid
          FROM gptplus_orders
        `,
      ])

      return NextResponse.json({
        codes: codes[0],
        orders: orders[0],
      })
    }

    if (type === 'daily') {
      // 每日订单统计（最近 30 天）
      const daily = await sql`
        SELECT
          DATE(created_at AT TIME ZONE 'Asia/Shanghai') as date,
          COUNT(*) as total_orders,
          COUNT(*) FILTER (WHERE status = 'completed') as completed,
          COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as revenue
        FROM gptplus_orders
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at AT TIME ZONE 'Asia/Shanghai')
        ORDER BY date DESC
      `
      return NextResponse.json({ daily })
    }

    if (type === 'payment_methods') {
      // 支付方式统计
      const methods = await sql`
        SELECT
          payment_method,
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'completed') as completed,
          COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as revenue
        FROM gptplus_orders
        GROUP BY payment_method
      `
      return NextResponse.json({ payment_methods: methods })
    }

    return NextResponse.json({
      error: 'Invalid type. Allowed: overview, daily, payment_methods',
    }, { status: 400 })

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Stats query failed' }, { status: 500 })
  }
}
