import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { queryOrder as queryWechatOrder } from '@/lib/payment/wechat'
import { sendActivationCodeEmail } from '@/lib/email'
import { notifyPaymentSuccess, notifyPaymentAnomaly } from '@/lib/feishu-notify'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ outTradeNo: string }> }
) {
  const { outTradeNo } = await params

  if (!outTradeNo) {
    return NextResponse.json({ error: '缺少订单号' }, { status: 400 })
  }

  const sql = getDb()

  // Check order in database
  const orders = await sql`
    SELECT o.status, o.buyer_email, o.currency, o.paid_amount, o.code_id, ac.code
    FROM gptplus_orders o
    JOIN activation_codes ac ON o.code_id = ac.id
    WHERE o.out_trade_no = ${outTradeNo}
    LIMIT 1
  `

  if (orders.length === 0) {
    return NextResponse.json({ status: 'expired' })
  }

  const order = orders[0]

  // If already completed, return immediately
  if (order.status === 'completed') {
    return NextResponse.json({
      status: 'completed',
      code: order.code,
      email: order.buyer_email,
      currency: order.currency || 'cny',
      paidAmount: order.paid_amount ? Number(order.paid_amount) : null,
    })
  }

  // If pending, query WeChat Pay directly
  if (order.status === 'pending') {
    try {
      const wxResult = await queryWechatOrder(outTradeNo)

      if (wxResult.trade_state === 'SUCCESS') {
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
          if (recipientEmail) {
            try {
              await notifyPaymentAnomaly({
                email: recipientEmail,
                amount: 128,
                sessionId: outTradeNo,
                reason: '微信支付查询确认已付款但激活码已释放，需人工补发',
              })
            } catch (err) {
              console.error('Feishu anomaly notify failed:', err)
            }
          }
          return NextResponse.json({ status: 'pending' })
        }

        // Complete the order
        await sql`
          UPDATE gptplus_orders
          SET status = 'completed', completed_at = NOW()
          WHERE out_trade_no = ${outTradeNo}
        `

        // Send email + notification
        if (recipientEmail && order.code) {
          try {
            await sendActivationCodeEmail({ code: order.code, to: recipientEmail })
          } catch (error) {
            console.error('Failed to send activation code email:', error)
          }

          try {
            await notifyPaymentSuccess({
              email: recipientEmail,
              amount: 128,
              code: order.code,
              sessionId: outTradeNo,
            })
          } catch (err) {
            console.error('Feishu payment success notify failed:', err)
          }
        }

        // Re-query to get updated data
        const updated = await sql`
          SELECT o.status, o.buyer_email, o.currency, o.paid_amount, ac.code
          FROM gptplus_orders o
          JOIN activation_codes ac ON o.code_id = ac.id
          WHERE o.out_trade_no = ${outTradeNo}
          LIMIT 1
        `

        if (updated.length > 0) {
          return NextResponse.json({
            status: 'completed',
            code: updated[0].code,
            email: updated[0].buyer_email,
            currency: updated[0].currency || 'cny',
            paidAmount: updated[0].paid_amount ? Number(updated[0].paid_amount) : null,
          })
        }
      }
    } catch (err) {
      console.error('[wechat-query] WeChat query failed:', err)
      // Continue with current DB status
    }
  }

  return NextResponse.json({
    status: order.status,
    code: null,
    email: order.buyer_email,
    currency: order.currency || 'cny',
    paidAmount: order.paid_amount ? Number(order.paid_amount) : null,
  })
}
