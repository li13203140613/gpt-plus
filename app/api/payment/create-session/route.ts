import { NextRequest, NextResponse } from 'next/server'
import { createPaymentSession } from '@/lib/payment/service'

export async function POST(request: NextRequest) {
  try {
    const { codeId } = await request.json()

    if (!codeId) {
      return NextResponse.json({ error: '缺少激活码 ID' }, { status: 400 })
    }

    const { url } = await createPaymentSession(codeId)

    return NextResponse.json({ url })
  } catch (error) {
    const message = error instanceof Error ? error.message : '创建支付会话失败'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
