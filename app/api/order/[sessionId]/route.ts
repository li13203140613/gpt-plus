import { NextRequest, NextResponse } from 'next/server'
import { getOrderBySessionId } from '@/lib/payment/service'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params

  if (!sessionId) {
    return NextResponse.json({ error: '缺少 session ID' }, { status: 400 })
  }

  const order = await getOrderBySessionId(sessionId)

  if (!order) {
    return NextResponse.json({ status: 'expired' })
  }

  return NextResponse.json(order)
}
