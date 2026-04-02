import { NextRequest, NextResponse } from 'next/server'
import { verifyAndParseCallback, callbackSuccessXml, callbackFailXml } from '@/lib/payment/wechat'
import { getDb } from '@/lib/db'
import { sendActivationCodeEmail } from '@/lib/email'
import { notifyPaymentSuccess, notifyPaymentAnomaly } from '@/lib/feishu-notify'
import { uploadPurchaseConversion } from '@/lib/conversion-upload'

export async function POST(request: NextRequest) {
  try {
    const xmlBody = await request.text()

    // Verify signature and parse callback
    const paymentResult = verifyAndParseCallback(xmlBody)

    if (paymentResult.result_code !== 'SUCCESS') {
      console.log(`[wechat-webhook] Payment not successful for ${paymentResult.out_trade_no}`)
      return new NextResponse(callbackSuccessXml(), {
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      })
    }

    const outTradeNo = paymentResult.out_trade_no
    const sql = getDb()

    // Find the order
    const orders = await sql`
      SELECT o.*, ac.code as activation_code
      FROM gptplus_orders o
      JOIN activation_codes ac ON o.code_id = ac.id
      WHERE o.out_trade_no = ${outTradeNo}
      LIMIT 1
    `

    if (orders.length === 0) {
      console.warn(`[wechat-webhook] No order found for out_trade_no: ${outTradeNo}`)
      return new NextResponse(callbackSuccessXml(), {
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      })
    }

    const order = orders[0]

    if (order.status === 'completed') {
      return new NextResponse(callbackSuccessXml(), {
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      })
    }

    if (order.status !== 'pending') {
      return new NextResponse(callbackSuccessXml(), {
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      })
    }

    const recipientEmail = order.buyer_email

    // Mark code as sold
    const soldCodes = await sql`
      UPDATE activation_codes
      SET status = 'sold', buyer_email = ${recipientEmail}, sold_at = NOW()
      WHERE id = ${order.code_id}
        AND status = 'reserved'
        AND stripe_session_id = ${outTradeNo}
      RETURNING id
    `

    if (soldCodes.length === 0) {
      console.error(`[wechat-webhook] Failed to mark code as sold for: ${outTradeNo}`)
      if (recipientEmail) {
        try {
          await notifyPaymentAnomaly({
            email: recipientEmail,
            amount: order.amount,
            sessionId: outTradeNo,
            reason: '微信支付已收款但激活码已释放，需人工补发',
          })
        } catch (err) {
          console.error('Feishu anomaly notify failed:', err)
        }
      }
      return new NextResponse(callbackSuccessXml(), {
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      })
    }

    // Complete the order
    await sql`
      UPDATE gptplus_orders
      SET status = 'completed', buyer_email = ${recipientEmail}, completed_at = NOW()
      WHERE out_trade_no = ${outTradeNo}
    `

    console.log(`[wechat-webhook] Order completed: ${outTradeNo}, email: ${recipientEmail}`)

    // Send email + notifications
    if (recipientEmail && order.activation_code) {
      try {
        await sendActivationCodeEmail({ code: order.activation_code, to: recipientEmail })
      } catch (error) {
        console.error('Failed to send activation code email:', error)
      }

      try {
        await notifyPaymentSuccess({
          email: recipientEmail,
          amount: order.amount,
          code: order.activation_code,
          sessionId: outTradeNo,
        })
      } catch (err) {
        console.error('Feishu payment success notify failed:', err)
      }
    }

    // Server-side conversion tracking
    try {
      const convValue = order.paid_amount ? Number(order.paid_amount) : Number(order.amount)
      await uploadPurchaseConversion({
        sessionId: outTradeNo,
        value: convValue,
        currency: 'cny',
        email: recipientEmail || undefined,
        gclid: order.gclid || undefined,
      })
    } catch (err) {
      console.error('[wechat-webhook] Conversion upload failed:', err)
    }

    return new NextResponse(callbackSuccessXml(), {
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    })
  } catch (err) {
    console.error('[wechat-webhook] Error:', err)
    return new NextResponse(callbackFailXml('处理失败'), {
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    })
  }
}
