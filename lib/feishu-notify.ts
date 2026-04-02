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

export async function notifyPaymentAnomaly({
  email,
  amount,
  sessionId,
  reason,
}: {
  email: string
  amount: string | number
  sessionId: string
  reason: string
}) {
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })

  await sendFeishuMessage({
    config: { wide_screen_mode: true },
    header: {
      template: 'yellow',
      title: { tag: 'plain_text', content: '⚠️ 支付异常' },
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
          { is_short: true, text: { tag: 'lark_md', content: `**异常原因**\n${reason}` } },
          { is_short: true, text: { tag: 'lark_md', content: `**时间**\n${now}` } },
        ],
      },
      {
        tag: 'note',
        elements: [{ tag: 'plain_text', content: `需人工处理 · Session: ${sessionId.slice(0, 20)}...` }],
      },
    ],
  })
}

export async function notifyLowStock({ remaining }: { remaining: number }) {
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })

  const urgency =
    remaining === 0
      ? { template: 'red' as const, emoji: '🚨', label: '库存已清零' }
      : remaining === 1
        ? { template: 'red' as const, emoji: '🔴', label: '库存告急' }
        : remaining === 2
          ? { template: 'orange' as const, emoji: '🟠', label: '库存紧张' }
          : { template: 'yellow' as const, emoji: '🟡', label: '库存偏低' }

  await sendFeishuMessage({
    config: { wide_screen_mode: true },
    header: {
      template: urgency.template,
      title: { tag: 'plain_text', content: `${urgency.emoji} ${urgency.label}` },
    },
    elements: [
      {
        tag: 'div',
        fields: [
          { is_short: true, text: { tag: 'lark_md', content: `**剩余可用激活码**\n${remaining} 个` } },
          { is_short: true, text: { tag: 'lark_md', content: `**时间**\n${now}` } },
        ],
      },
      {
        tag: 'div',
        text: {
          tag: 'lark_md',
          content: remaining === 0
            ? '⚠️ **所有激活码已售罄，新用户将无法购买！请立即补充库存。**'
            : `⚠️ **库存仅剩 ${remaining} 个，请尽快补充激活码。**`,
        },
      },
      {
        tag: 'note',
        elements: [{ tag: 'plain_text', content: '库存低于 3 个时自动提醒' }],
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
