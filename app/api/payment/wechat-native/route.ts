import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { createNativeOrder, generateOutTradeNo } from '@/lib/payment/wechat'
import { releaseExpiredReservations } from '@/lib/payment/service'
import { notifyNewOrder } from '@/lib/feishu-notify'
import { LOCALE_CONFIGS } from '@/lib/i18n/config'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3001'

export async function POST(request: NextRequest) {
  try {
    const { buyerEmail, locale = 'zh', priceOverride, gclid } = await request.json()

    if (!buyerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
      return NextResponse.json({ error: '无效的邮箱地址' }, { status: 400 })
    }

    const sql = getDb()
    await releaseExpiredReservations()

    // Reserve an activation code
    const codes = await sql`
      WITH selected_code AS (
        SELECT id
        FROM activation_codes
        WHERE status = 'available'
        ORDER BY created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      UPDATE activation_codes AS ac
      SET status = 'reserved', reserved_at = NOW(), buyer_email = ${buyerEmail}
      FROM selected_code
      WHERE ac.id = selected_code.id
      RETURNING ac.*
    `

    if (codes.length === 0) {
      return NextResponse.json({ error: '暂无可用激活码' }, { status: 400 })
    }

    const code = codes[0]
    const localeConfig = LOCALE_CONFIGS[locale as keyof typeof LOCALE_CONFIGS] || LOCALE_CONFIGS.zh

    const finalPrice = priceOverride ? localeConfig.priceOverride : localeConfig.price
    const cnyAmount = priceOverride ?? Number(code.price)

    // WeChat Pay amount is in fen (cents)
    const totalAmountCents = Math.round(finalPrice * 100)

    const outTradeNo = generateOutTradeNo()

    const notifyUrl = `${SITE_URL}/api/payment/wechat-webhook`

    const result = await createNativeOrder({
      outTradeNo,
      description: 'ChatGPT Plus 1个月激活码',
      totalAmountCents,
      notifyUrl,
    })

    // Save to activation_codes
    await sql`
      UPDATE activation_codes
      SET stripe_session_id = ${outTradeNo}
      WHERE id = ${code.id}
    `

    // Create order record
    await sql`
      INSERT INTO gptplus_orders (code_id, stripe_session_id, amount, status, buyer_email, currency, paid_amount, gclid, payment_method, out_trade_no)
      VALUES (${code.id}, ${outTradeNo}, ${cnyAmount}, 'pending', ${buyerEmail}, 'cny', ${finalPrice}, ${gclid || null}, 'wechat', ${outTradeNo})
    `

    // Feishu notification
    try {
      await notifyNewOrder({ email: buyerEmail, amount: cnyAmount, sessionId: outTradeNo })
    } catch (err) {
      console.error('Feishu new order notify failed:', err)
    }

    return NextResponse.json({
      code_url: result.code_url,
      out_trade_no: outTradeNo,
      amount: finalPrice,
    })
  } catch (err) {
    console.error('[wechat-native] Error:', err)
    const message = err instanceof Error ? err.message : '创建支付订单失败'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
