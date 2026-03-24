import { createHmac } from 'node:crypto'

function buildFeishuSignature(secret: string) {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const stringToSign = `${timestamp}\n${secret}`
  const sign = createHmac('sha256', stringToSign).update('').digest('base64')
  return { timestamp, sign }
}

async function sendFeishuMessage(card: Record<string, unknown>) {
  const webhook = process.env.FEISHU_BOT_WEBHOOK?.trim()
  const secret = process.env.FEISHU_BOT_SECRET?.trim()

  if (!webhook) return

  const securityPayload = secret ? buildFeishuSignature(secret) : {}
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...securityPayload,
      msg_type: 'interactive',
      card,
    }),
  })

  const payload = await response.json()
  if (!response.ok || payload?.code !== 0) {
    console.error('Feishu notify failed:', payload?.msg || response.status)
  }
}

export async function notifyNewOrder({
  email,
  amount,
  sessionId,
}: {
  email: string
  amount: string | number
  sessionId: string
}) {
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })

  await sendFeishuMessage({
    config: { wide_screen_mode: true },
    header: {
      template: 'orange',
      title: { tag: 'plain_text', content: '🛒 新订单创建' },
    },
    elements: [
      {
        tag: 'div',
        fields: [
          { is_short: true, text: { tag: 'lark_md', content: `**买家邮箱**\n${email}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**金额**\n¥${amount}` } },
        ],
      },
      {
        tag: 'div',
        fields: [
          { is_short: true, text: { tag: 'lark_md', content: `**时间**\n${now}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**状态**\n待支付` } },
        ],
      },
      {
        tag: 'note',
        elements: [{ tag: 'plain_text', content: `Session: ${sessionId.slice(0, 20)}...` }],
      },
    ],
  })
}

export async function notifyPaymentSuccess({
  email,
  amount,
  code,
  sessionId,
}: {
  email: string
  amount: string | number
  code: string
  sessionId: string
}) {
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  const maskedCode = code.length > 8 ? `${code.slice(0, 4)}****${code.slice(-4)}` : '****'

  await sendFeishuMessage({
    config: { wide_screen_mode: true },
    header: {
      template: 'green',
      title: { tag: 'plain_text', content: '✅ 支付成功' },
    },
    elements: [
      {
        tag: 'div',
        fields: [
          { is_short: true, text: { tag: 'lark_md', content: `**买家邮箱**\n${email}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**金额**\n¥${amount}` } },
        ],
      },
      {
        tag: 'div',
        fields: [
          { is_short: true, text: { tag: 'lark_md', content: `**激活码**\n${maskedCode}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**时间**\n${now}` } },
        ],
      },
      {
        tag: 'note',
        elements: [{ tag: 'plain_text', content: `Session: ${sessionId.slice(0, 20)}...` }],
      },
    ],
  })
}

export async function notifyPaymentExpired({
  email,
  amount,
  sessionId,
  reason,
}: {
  email: string
  amount: string | number
  sessionId: string
  reason: '未支付过期' | '支付失败'
}) {
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })

  await sendFeishuMessage({
    config: { wide_screen_mode: true },
    header: {
      template: 'red',
      title: { tag: 'plain_text', content: `❌ 订单${reason}` },
    },
    elements: [
      {
        tag: 'div',
        fields: [
          { is_short: true, text: { tag: 'lark_md', content: `**买家邮箱**\n${email}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**金额**\n¥${amount}` } },
        ],
      },
      {
        tag: 'div',
        fields: [
          { is_short: true, text: { tag: 'lark_md', content: `**原因**\n${reason}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**时间**\n${now}` } },
        ],
      },
      {
        tag: 'note',
        elements: [{ tag: 'plain_text', content: `已发送挽回邮件 · Session: ${sessionId.slice(0, 20)}...` }],
      },
    ],
  })
}
