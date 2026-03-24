'use client'

import { useRef, useState } from 'react'
import { Loader2, Mail, Sparkles, MessageSquare, Image, Brain, Bot, FolderOpen, Video, Code2, Shield, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { trackEvent } from '@/lib/analytics'

const plusBenefits = [
  { icon: Sparkles, text: '解决复杂问题' },
  { icon: MessageSquare, text: '支持在多个会话中进行更长聊天' },
  { icon: Image, text: '更快地创作更多图像' },
  { icon: Brain, text: '记住用户目标和过往对话' },
  { icon: Bot, text: '借助智能体模式规划行程与任务' },
  { icon: FolderOpen, text: '整理项目和自定义 GPT' },
  { icon: Video, text: '在 Sora 上制作并共享视频' },
  { icon: Code2, text: '使用 Codex 编写代码并构建应用' },
]

const trustItems = [
  {
    icon: Shield,
    title: '售后无忧',
    desc: '失败 1 分钟内退款',
  },
  {
    icon: CreditCard,
    title: '支付便捷',
    desc: '支付宝 / 微信支付',
  },
]

export function CodeGrid() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const emailFocusTracked = useRef(false)

  function handleEmailFocus() {
    if (!emailFocusTracked.current) {
      emailFocusTracked.current = true
      trackEvent('email_focus', { source_page: window.location.pathname })
    }
  }

  async function handleBuy() {
    const sourcePage = window.location.pathname
    const normalizedEmail = email.trim().toLowerCase()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)

    if (!isValidEmail) {
      trackEvent('email_error', { error_type: 'invalid_format', source_page: sourcePage })
      toast.error('请输入正确的邮箱地址')
      return
    }

    trackEvent('begin_checkout', { value: 128, currency: 'CNY', source_page: sourcePage })
    trackEvent('email_submit', { source_page: sourcePage })
    setSubmitting(true)

    try {
      const res = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerEmail: normalizedEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '创建支付失败')
      }

      if (!data.url) {
        throw new Error('未获取到支付链接')
      }

      trackEvent('checkout_redirect', { source_page: sourcePage })
      window.location.href = data.url
    } catch (err) {
      const message = err instanceof Error ? err.message : '支付发起失败，请稍后重试'
      trackEvent('checkout_api_error', { error_message: message, source_page: sourcePage })
      toast.error(message)
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-xl shadow-violet-500/5">
        <div className="space-y-6 px-6 py-8 sm:px-10">
          {/* Official badge + Price */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs tracking-wide text-gray-400">ChatGPT Plus 官方套餐</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                $20/月
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">¥128.00 <span className="text-base font-normal text-gray-400 line-through">¥145+</span></p>
            <p className="mt-2 text-sm text-gray-400">即刻下单，立省2-5美金开卡费</p>
          </div>

          {/* Email */}
          <div className="space-y-3">
            <label htmlFor="buyer-email" className="block text-sm font-medium text-gray-800">
              接收邮箱
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="buyer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onFocus={handleEmailFocus}
                placeholder="发送激活步骤到邮箱"
                className="h-12 rounded-xl border-gray-200 bg-white pl-11 text-gray-900 placeholder:text-gray-400 focus-visible:border-violet-400 focus-visible:ring-violet-100"
              />
            </div>
          </div>

          <Button
            onClick={handleBuy}
            disabled={submitting}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-base font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : (
              <>
                填写邮箱并去支付
                <span className="ml-2 inline-flex items-center gap-1.5 opacity-80">
                  {/* Alipay */}
                  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                    <path d="M21.422 15.358c-3.066-1.358-5.463-2.553-5.463-2.553s1.128-2.779 1.394-4.702h-4.59v-1.47h5.2V5.5h-5.2V3H10.5v2.5H5.43v1.133h5.07v1.47H5.882v1.133h8.188c-.2 1.093-.793 2.553-1.6 3.82-.807-.96-1.4-2.013-1.8-2.94H9.004s1.2 2.94 3.32 5.253c-2.12 1.907-4.84 3.187-4.84 3.187l.9 1.28s2.84-1.36 5.133-3.52c1.353 1.2 2.973 2.253 4.813 3.08 1.227-2.12 2.573-3.453 3.093-4.04zM2.578 22h18.844A1.58 1.58 0 0 0 23 20.422V3.578A1.58 1.58 0 0 0 21.422 2H2.578A1.58 1.58 0 0 0 1 3.578v16.844A1.58 1.58 0 0 0 2.578 22z" fillRule="evenodd"/>
                  </svg>
                  {/* WeChat Pay */}
                  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                    <path d="M8.813 11.612a.867.867 0 0 1-.878-.853.87.87 0 0 1 .878-.858.867.867 0 0 1 .877.858.864.864 0 0 1-.877.853zm4.373 0a.867.867 0 0 1-.877-.853.87.87 0 0 1 .877-.858.867.867 0 0 1 .878.858.864.864 0 0 1-.878.853zM22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-3.235 1.652c0-2.267-2.238-4.108-5.001-4.108-2.764 0-5.002 1.84-5.002 4.108s2.238 4.107 5.002 4.107c.59 0 1.16-.08 1.692-.228l.032-.01h.02l1.2.672-.336-1.096.022-.028c.916-.82 1.371-1.845 1.371-3.417zm-1.302-4.593c1.074.964 1.673 2.213 1.673 3.54 0 .468-.066.915-.193 1.34C20.81 13.147 22 11.338 22 9.272c0-2.725-2.69-4.934-6.012-4.934-2.924 0-5.37 1.723-5.883 3.996.3-.03.607-.045.918-.045 3.136 0 5.68 2.082 5.68 4.647-.002.04-.002.083-.005.123h.063zM10.47 15.023a.658.658 0 0 1-.665-.647.66.66 0 0 1 .665-.651.658.658 0 0 1 .665.65.656.656 0 0 1-.665.648zm3.314 0a.658.658 0 0 1-.666-.647.66.66 0 0 1 .666-.651.658.658 0 0 1 .665.65.656.656 0 0 1-.665.648z"/>
                  </svg>
                </span>
              </>
            )}
          </Button>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {trustItems.map((item) => (
              <div key={item.title} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-3">
                <item.icon className="size-4 flex-shrink-0 text-violet-500" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Plus Benefits */}
          <div className="border-t border-gray-100 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Plus 套餐权益</p>
              <span className="text-sm font-semibold text-violet-600">$20/月</span>
            </div>
            <ul className="space-y-3">
              {plusBenefits.map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  <item.icon className="size-4 flex-shrink-0 text-violet-500" />
                  <span className="text-sm text-gray-600">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
