'use client'

import { useState } from 'react'
import { Loader2, Mail, Sparkles, MessageSquare, Image, Brain, Bot, FolderOpen, Video, Code2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Input } from './ui/input'

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

export function CodeGrid() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleBuy() {
    const normalizedEmail = email.trim().toLowerCase()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)

    if (!isValidEmail) {
      toast.error('请输入正确的邮箱地址')
      return
    }

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

      window.location.href = data.url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '支付发起失败，请稍后重试')
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
            <p className="text-3xl font-bold text-gray-900">¥128.00</p>
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
                placeholder="you@example.com"
                className="h-12 rounded-xl border-gray-200 bg-white pl-11 text-gray-900 placeholder:text-gray-400 focus-visible:border-violet-400 focus-visible:ring-violet-100"
              />
            </div>
            <p className="text-xs text-gray-400">邮箱会随订单一起保存，方便后续恢复订单信息。</p>
          </div>

          <Button
            onClick={handleBuy}
            disabled={submitting}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-base font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : '填写邮箱并去支付'}
          </Button>

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
