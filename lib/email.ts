interface ActivationCodeEmailOptions {
  code: string
  to: string
}

interface PaymentFailedEmailOptions {
  to: string
}

interface RenewalReminderEmailOptions {
  to: string
  type: 'day_before' | 'day_of'
}

import { getDb } from '@/lib/db'

const DEFAULT_ACTIVATION_SITE_URL = 'https://chong.plus'
const ORDER_SITE_URL = 'https://gpt-plus.ai/success'

async function getActivationSiteUrl(): Promise<string> {
  try {
    const sql = getDb()
    const rows = await sql`SELECT value FROM site_settings WHERE key = 'activation_url'`
    return rows[0]?.value || DEFAULT_ACTIVATION_SITE_URL
  } catch {
    return DEFAULT_ACTIVATION_SITE_URL
  }
}
const TUTORIAL_URL = 'https://my.feishu.cn/wiki/AwGNwqLZeiRPJMkX5L8cbxZCncb'
const SITE_URL = 'https://gpt-plus.ai'
const QR_URL = 'https://www.gpt-plus.ai/wechat-qr.png'
const RESEND_API_URL = 'https://api.resend.com/emails'
const SUPPORT_WECHAT = 'fanxx2029'

const EMAIL_COPY = {
  badge: 'GPT Plus Recharge',
  subject: '\u3010GPT Plus \u5145\u503c\u6210\u529f\u3011\u8bf7\u67e5\u6536\u6fc0\u6d3b\u7801\u4e0e\u6fc0\u6d3b\u7f51\u7ad9',
  title: '\u5145\u503c\u6210\u529f\uff0c\u8bf7\u67e5\u6536\u4f60\u7684\u6fc0\u6d3b\u7801',
  intro:
    '\u4f60\u7684 GPT Plus \u5145\u503c\u8ba2\u5355\u5df2\u652f\u4ed8\u6210\u529f\u3002\u4e0b\u9762\u662f\u672c\u6b21\u8ba2\u5355\u7684\u6fc0\u6d3b\u7801\u548c\u6fc0\u6d3b\u7f51\u7ad9\uff0c\u8bf7\u76f4\u63a5\u6309\u90ae\u4ef6\u5185\u6b65\u9aa4\u5b8c\u6210\u5145\u503c\u3002',
  codeLabel: '\u6fc0\u6d3b\u7801',
  codeHint:
    '\u8bf7\u59a5\u5584\u4fdd\u5b58\u6b64\u6fc0\u6d3b\u7801\u3002\u9875\u9762\u5173\u95ed\u540e\uff0c\u4f60\u4ecd\u7136\u53ef\u4ee5\u56de\u5230\u8ba2\u5355\u9875\u6216\u90ae\u4ef6\u4e2d\u67e5\u770b\u3002',
  siteLabel: '\u6fc0\u6d3b\u7f51\u7ad9',
  siteIntro:
    '\u8bf7\u6253\u5f00\u4e0b\u9762\u7684\u7f51\u7ad9\uff0c\u6309\u63d0\u793a\u63d0\u4ea4\u767b\u5f55\u51ed\u8bc1\u548c\u6fc0\u6d3b\u7801\uff1a',
  siteButton: '\u524d\u5f80\u6fc0\u6d3b\u7f51\u7ad9',
  stepsLabel: '\u4f7f\u7528\u6b65\u9aa4',
  step1:
    '\u5728\u5df2\u767b\u5f55 ChatGPT \u7684\u6d4f\u89c8\u5668\u4e2d\u6253\u5f00\uff1a https://chatgpt.com/api/auth/session',
  step2: '\u590d\u5236\u9875\u9762\u4e2d\u7684\u5b8c\u6574\u5185\u5bb9',
  step3:
    '\u8fdb\u5165\u6fc0\u6d3b\u7f51\u7ad9\uff0c\u7c98\u8d34\u767b\u5f55\u51ed\u8bc1\u5e76\u8f93\u5165\u4e0a\u65b9\u6fc0\u6d3b\u7801\u63d0\u4ea4',
  orderHint:
    '\u5982\u679c\u4f60\u6682\u65f6\u6ca1\u6709\u5b8c\u6210\u64cd\u4f5c\uff0c\u4e5f\u53ef\u4ee5\u7a0d\u540e\u4ece\u8ba2\u5355\u9875\u7ee7\u7eed\u67e5\u770b\uff1a',
  support:
    '如有问题，请联系客服微信：',
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildActivationEmailHtml(code: string, ACTIVATION_SITE_URL: string) {
  return `
    <!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${EMAIL_COPY.subject}</title>
      </head>
      <body style="margin:0;padding:32px 16px;background:#050816;font-family:'PingFang SC','Microsoft YaHei',Arial,sans-serif;color:#e5e7eb;">
        <div style="max-width:640px;margin:0 auto;border:1px solid rgba(16,185,129,0.18);border-radius:24px;overflow:hidden;background:#0b1020;">
          <div style="padding:32px 32px 24px;background:radial-gradient(circle at top, rgba(16,185,129,0.24), rgba(11,16,32,1) 60%);">
            <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.22);font-size:12px;letter-spacing:0.08em;color:#6ee7b7;">
              ${EMAIL_COPY.badge}
            </div>
            <h1 style="margin:18px 0 12px;font-size:30px;line-height:1.25;color:#ffffff;">
              ${EMAIL_COPY.title}
            </h1>
            <p style="margin:0;font-size:15px;line-height:1.8;color:#cbd5e1;">
              ${EMAIL_COPY.intro}
            </p>
          </div>

          <div style="padding:0 32px 32px;">
            <div style="margin:0 0 20px;padding:20px 22px;border-radius:20px;background:rgba(8,15,34,0.9);border:1px solid rgba(148,163,184,0.14);">
              <div style="font-size:12px;letter-spacing:0.12em;color:#94a3b8;text-transform:uppercase;">
                ${EMAIL_COPY.codeLabel}
              </div>
              <div style="margin-top:12px;padding:18px 20px;border-radius:16px;background:#07111f;border:1px solid rgba(16,185,129,0.2);text-align:center;font-size:30px;font-weight:700;letter-spacing:3px;color:#34d399;">
                ${code}
              </div>
              <p style="margin:12px 0 0;font-size:13px;line-height:1.7;color:#94a3b8;">
                ${EMAIL_COPY.codeHint}
              </p>
            </div>

            <div style="margin:0 0 20px;padding:20px 22px;border-radius:20px;background:rgba(8,15,34,0.9);border:1px solid rgba(148,163,184,0.14);">
              <div style="font-size:12px;letter-spacing:0.12em;color:#94a3b8;text-transform:uppercase;">
                ${EMAIL_COPY.siteLabel}
              </div>
              <p style="margin:12px 0 0;font-size:15px;line-height:1.8;color:#e2e8f0;">
                ${EMAIL_COPY.siteIntro}
              </p>
              <a href="${ACTIVATION_SITE_URL}" style="display:inline-block;margin-top:12px;padding:14px 18px;border-radius:14px;background:linear-gradient(90deg,#059669,#14b8a6);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">
                ${EMAIL_COPY.siteButton}
              </a>
              <p style="margin:12px 0 0;font-size:13px;line-height:1.7;color:#94a3b8;word-break:break-all;">
                ${ACTIVATION_SITE_URL}
              </p>
            </div>

            <div style="margin:0 0 20px;padding:20px 22px;border-radius:20px;background:rgba(8,15,34,0.9);border:1px solid rgba(148,163,184,0.14);">
              <div style="font-size:12px;letter-spacing:0.12em;color:#94a3b8;text-transform:uppercase;">
                ${EMAIL_COPY.stepsLabel}
              </div>
              <ol style="margin:14px 0 0;padding-left:20px;color:#cbd5e1;font-size:14px;line-height:1.9;">
                <li>${EMAIL_COPY.step1}</li>
                <li>${EMAIL_COPY.step2}</li>
                <li>${EMAIL_COPY.step3}</li>
              </ol>
            </div>

            <div style="margin:0 0 20px;padding:20px 22px;border-radius:20px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);">
              <div style="font-size:12px;letter-spacing:0.12em;color:#93c5fd;text-transform:uppercase;">
                详细教程
              </div>
              <p style="margin:10px 0 0;font-size:14px;line-height:1.8;color:#e2e8f0;">
                不确定如何操作？查看我们的图文教程，手把手教你完成充值激活：
              </p>
              <a href="${TUTORIAL_URL}" style="display:inline-block;margin-top:12px;padding:12px 18px;border-radius:14px;background:linear-gradient(90deg,#2563eb,#3b82f6);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">
                查看详细教程
              </a>
            </div>

            <div style="margin:0 0 20px;padding:18px 20px;border-radius:18px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.18);">
              <p style="margin:0;font-size:14px;line-height:1.8;color:#fde68a;">
                ${EMAIL_COPY.orderHint}
                <a href="${ORDER_SITE_URL}" style="color:#fef3c7;">${ORDER_SITE_URL}</a>
              </p>
            </div>

            <p style="margin:0;font-size:13px;line-height:1.8;color:#94a3b8;">
              ${EMAIL_COPY.support}${SUPPORT_WECHAT}
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

function buildActivationEmailText(code: string, ACTIVATION_SITE_URL: string) {
  return [
    EMAIL_COPY.subject,
    '',
    '\u4f60\u7684 GPT Plus \u5145\u503c\u8ba2\u5355\u5df2\u652f\u4ed8\u6210\u529f\u3002',
    `${EMAIL_COPY.codeLabel}\uff1a${code}`,
    `${EMAIL_COPY.siteLabel}\uff1a${ACTIVATION_SITE_URL}`,
    '',
    `${EMAIL_COPY.stepsLabel}\uff1a`,
    `1. ${EMAIL_COPY.step1}`,
    `2. ${EMAIL_COPY.step2}`,
    `3. ${EMAIL_COPY.step3}`,
    '',
    `详细教程：${TUTORIAL_URL}`,
    '',
    `\u8ba2\u5355\u9875\uff1a${ORDER_SITE_URL}`,
    `${EMAIL_COPY.support}${SUPPORT_WECHAT}`,
  ].join('\n')
}

export async function sendActivationCodeEmail({ code, to }: ActivationCodeEmailOptions) {
  const resendApiKey = process.env.RESEND_API_KEY?.trim()
  const resendFromEmail = process.env.RESEND_FROM_EMAIL?.trim()

  if (!resendApiKey || !resendFromEmail || !to) {
    return
  }

  const activationSiteUrl = await getActivationSiteUrl()
  const safeCode = escapeHtml(code)

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `GPT Plus <${resendFromEmail}>`,
      to: [to],
      subject: EMAIL_COPY.subject,
      html: buildActivationEmailHtml(safeCode, activationSiteUrl),
      text: buildActivationEmailText(code, activationSiteUrl),
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Failed to send activation code email: ${body}`)
  }
}

const FAILED_EMAIL_COPY = {
  subject: '【GPT Plus】付款未完成？我们可以帮你',
  title: '付款遇到问题？别担心！',
  intro: '我们注意到您的 ChatGPT Plus 充值订单尚未完成付款。没关系，我们提供多种付款方式帮您轻松搞定。',
  altPayTitle: '支持多种付款方式',
  altPayDesc: '除了在线支付，您还可以通过以下方式完成充值：',
  altPayMethods: ['支付宝转账', '微信转账', '信用卡 / 借记卡'],
  benefits: [
    '超值价，立省 2-5 美金开卡费',
    '下单后自动发货，1 分钟完成充值',
    '成功率 99.9%，失败 100% 全额退款',
    '不封号，封号包售后',
    '正规充值通道，无需提供账号密码',
  ],
  qrTitle: '扫码添加客服微信',
  qrDesc: '添加客服微信，支持支付宝/微信直接转账付款',
  wechatLabel: '客服微信号',
  retryButton: '返回网站重新购买',
}

function buildPaymentFailedEmailHtml() {
  const benefitsHtml = FAILED_EMAIL_COPY.benefits
    .map(
      (b) =>
        `<li style="padding:6px 0;color:#cbd5e1;font-size:14px;">✅ ${b}</li>`
    )
    .join('')

  const methodsHtml = FAILED_EMAIL_COPY.altPayMethods
    .map(
      (m) =>
        `<li style="padding:4px 0;color:#e2e8f0;font-size:14px;">• ${m}</li>`
    )
    .join('')

  return `
    <!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${FAILED_EMAIL_COPY.subject}</title>
      </head>
      <body style="margin:0;padding:32px 16px;background:#050816;font-family:'PingFang SC','Microsoft YaHei',Arial,sans-serif;color:#e5e7eb;">
        <div style="max-width:640px;margin:0 auto;border:1px solid rgba(139,92,246,0.18);border-radius:24px;overflow:hidden;background:#0b1020;">
          <div style="padding:32px 32px 24px;background:radial-gradient(circle at top, rgba(139,92,246,0.24), rgba(11,16,32,1) 60%);">
            <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(139,92,246,0.12);border:1px solid rgba(139,92,246,0.22);font-size:12px;letter-spacing:0.08em;color:#c4b5fd;">
              GPT Plus Recharge
            </div>
            <h1 style="margin:18px 0 12px;font-size:28px;line-height:1.3;color:#ffffff;">
              ${FAILED_EMAIL_COPY.title}
            </h1>
            <p style="margin:0;font-size:15px;line-height:1.8;color:#cbd5e1;">
              ${FAILED_EMAIL_COPY.intro}
            </p>
          </div>

          <div style="padding:0 32px 32px;">
            <!-- Alternative Payment Methods -->
            <div style="margin:0 0 20px;padding:20px 22px;border-radius:20px;background:rgba(8,15,34,0.9);border:1px solid rgba(148,163,184,0.14);">
              <div style="font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:8px;">
                💳 ${FAILED_EMAIL_COPY.altPayTitle}
              </div>
              <p style="margin:0 0 10px;font-size:14px;color:#94a3b8;">${FAILED_EMAIL_COPY.altPayDesc}</p>
              <ul style="margin:0;padding-left:4px;list-style:none;">
                ${methodsHtml}
              </ul>
            </div>

            <!-- WeChat Support -->
            <div style="margin:0 0 20px;padding:22px;border-radius:20px;background:linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.1));border:1px solid rgba(139,92,246,0.3);text-align:center;">
              <div style="font-size:16px;font-weight:700;color:#ffffff;margin-bottom:6px;">添加客服微信，立即协助您完成充值</div>
              <div style="margin-top:14px;padding:14px 24px;border-radius:14px;background:rgba(139,92,246,0.2);display:inline-block;">
                <span style="font-size:13px;color:#c4b5fd;">客服微信号</span>
                <div style="margin-top:4px;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:2px;">${SUPPORT_WECHAT}</div>
              </div>
              <p style="margin:12px 0 0;font-size:13px;color:#a5b4fc;">添加时请备注：gpt</p>
            </div>

            <!-- Benefits -->
            <div style="margin:0 0 20px;padding:20px 22px;border-radius:20px;background:rgba(8,15,34,0.9);border:1px solid rgba(148,163,184,0.14);">
              <div style="font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:8px;">
                为什么选择我们
              </div>
              <ul style="margin:0;padding-left:0;list-style:none;">
                ${benefitsHtml}
              </ul>
            </div>

            <!-- CTA Button -->
            <div style="text-align:center;margin:0 0 20px;">
              <a href="${SITE_URL}" style="display:inline-block;padding:14px 32px;border-radius:14px;background:linear-gradient(90deg,#7c3aed,#a855f7);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">
                ${FAILED_EMAIL_COPY.retryButton}
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

function buildPaymentFailedEmailText() {
  return [
    FAILED_EMAIL_COPY.subject,
    '',
    FAILED_EMAIL_COPY.intro,
    '',
    `${FAILED_EMAIL_COPY.altPayTitle}：`,
    ...FAILED_EMAIL_COPY.altPayMethods.map((m) => `  - ${m}`),
    '',
    '为什么选择我们：',
    ...FAILED_EMAIL_COPY.benefits.map((b) => `  ✅ ${b}`),
    '',
    `返回网站重新购买：${SITE_URL}`,
  ].join('\n')
}

export async function sendPaymentFailedEmail({ to }: PaymentFailedEmailOptions) {
  const resendApiKey = process.env.RESEND_API_KEY?.trim()
  const resendFromEmail = process.env.RESEND_FROM_EMAIL?.trim()

  if (!resendApiKey || !resendFromEmail || !to) {
    return
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `GPT Plus <${resendFromEmail}>`,
      to: [to],
      subject: FAILED_EMAIL_COPY.subject,
      html: buildPaymentFailedEmailHtml(),
      text: buildPaymentFailedEmailText(),
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Failed to send payment failed email: ${body}`)
  }
}

const RENEWAL_EMAIL_COPY = {
  day_before: {
    subject: '您的 ChatGPT Plus 明天到期，续费不断档',
    title: '您的 ChatGPT Plus 明天就要到期了',
    intro: '为了不影响您继续使用 ChatGPT Plus 的高级功能（GPT-4o、文件上传、图片生成等），建议您今天完成续费，确保服务无缝衔接。',
    urgency: '⏰ 距离到期还有 1 天',
    urgencyColor: '#fbbf24',
  },
  day_of: {
    subject: '您的 ChatGPT Plus 今日到期，立即续费',
    title: '您的 ChatGPT Plus 今天到期',
    intro: '您的 ChatGPT Plus 订阅今天到期。到期后将无法使用 GPT-4o、文件上传、图片生成等高级功能。立即续费，避免服务中断。',
    urgency: '🔴 今日到期',
    urgencyColor: '#ef4444',
  },
}

const RENEWAL_BENEFITS = [
  '无限使用 GPT-4o 模型',
  '支持文件上传与图片生成',
  '优先体验最新功能',
  '续费流程简单，1 分钟搞定',
]

function buildRenewalReminderEmailHtml(type: 'day_before' | 'day_of') {
  const copy = RENEWAL_EMAIL_COPY[type]
  const benefitsHtml = RENEWAL_BENEFITS
    .map(b => `<li style="padding:5px 0;color:#cbd5e1;font-size:14px;">✅ ${b}</li>`)
    .join('')

  return `
    <!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${copy.subject}</title>
      </head>
      <body style="margin:0;padding:32px 16px;background:#050816;font-family:'PingFang SC','Microsoft YaHei',Arial,sans-serif;color:#e5e7eb;">
        <div style="max-width:640px;margin:0 auto;border:1px solid rgba(16,185,129,0.18);border-radius:24px;overflow:hidden;background:#0b1020;">
          <div style="padding:32px 32px 24px;background:radial-gradient(circle at top, rgba(16,185,129,0.24), rgba(11,16,32,1) 60%);">
            <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.22);font-size:12px;letter-spacing:0.08em;color:#6ee7b7;">
              GPT Plus Renewal
            </div>
            <h1 style="margin:18px 0 12px;font-size:28px;line-height:1.3;color:#ffffff;">
              ${copy.title}
            </h1>
            <p style="margin:0;font-size:15px;line-height:1.8;color:#cbd5e1;">
              ${copy.intro}
            </p>
          </div>

          <div style="padding:0 32px 32px;">
            <!-- Urgency Badge -->
            <div style="margin:0 0 20px;padding:16px 22px;border-radius:16px;background:rgba(8,15,34,0.9);border:1px solid ${copy.urgencyColor}33;text-align:center;">
              <span style="font-size:18px;font-weight:700;color:${copy.urgencyColor};">
                ${copy.urgency}
              </span>
            </div>

            <!-- CTA Button -->
            <div style="margin:0 0 24px;text-align:center;">
              <a href="${SITE_URL}" style="display:inline-block;padding:18px 48px;border-radius:16px;background:linear-gradient(90deg,#059669,#14b8a6);color:#ffffff;text-decoration:none;font-size:18px;font-weight:800;letter-spacing:1px;box-shadow:0 4px 24px rgba(16,185,129,0.3);">
                立即续费
              </a>
              <p style="margin:10px 0 0;font-size:13px;color:#94a3b8;">
                点击按钮前往 gpt-plus.ai 完成续费
              </p>
            </div>

            <!-- Benefits -->
            <div style="margin:0 0 20px;padding:20px 22px;border-radius:20px;background:rgba(8,15,34,0.9);border:1px solid rgba(148,163,184,0.14);">
              <div style="font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:8px;">
                续费后继续享有
              </div>
              <ul style="margin:0;padding-left:0;list-style:none;">
                ${benefitsHtml}
              </ul>
            </div>

            <!-- WeChat Support -->
            <div style="margin:0 0 20px;padding:18px 22px;border-radius:18px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);">
              <p style="margin:0;font-size:14px;line-height:1.8;color:#94a3b8;">
                续费遇到问题？联系客服微信：<span style="color:#6ee7b7;font-weight:700;">${SUPPORT_WECHAT}</span>（添加时请备注：gpt）
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

function buildRenewalReminderEmailText(type: 'day_before' | 'day_of') {
  const copy = RENEWAL_EMAIL_COPY[type]
  return [
    copy.subject,
    '',
    copy.intro,
    '',
    copy.urgency,
    '',
    `立即续费：${SITE_URL}`,
    '',
    '续费后继续享有：',
    ...RENEWAL_BENEFITS.map(b => `  ✅ ${b}`),
    '',
    `续费遇到问题？联系客服微信：${SUPPORT_WECHAT}（添加时请备注：gpt）`,
  ].join('\n')
}

export async function sendRenewalReminderEmail({ to, type }: RenewalReminderEmailOptions) {
  const resendApiKey = process.env.RESEND_API_KEY?.trim()
  const resendFromEmail = process.env.RESEND_FROM_EMAIL?.trim()

  if (!resendApiKey || !resendFromEmail || !to) {
    return
  }

  const copy = RENEWAL_EMAIL_COPY[type]

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `GPT Plus <${resendFromEmail}>`,
      to: [to],
      subject: copy.subject,
      html: buildRenewalReminderEmailHtml(type),
      text: buildRenewalReminderEmailText(type),
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Failed to send renewal reminder email: ${body}`)
  }
}
