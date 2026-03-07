'use client'

import { useState } from 'react'
import { Loader2, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'

interface CodeCardProps {
  id: string
  maskedCode: string
  price: number
  index: number
}

export function CodeCard({ id, maskedCode, price, index }: CodeCardProps) {
  const [loading, setLoading] = useState(false)

  async function handleBuy() {
    setLoading(true)
    try {
      const res = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeId: id }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '创建支付失败')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '支付失败，请重试')
      setLoading(false)
    }
  }

  return (
    <div
      className="group relative rounded-2xl border border-gray-100 bg-white p-6 hover:border-violet-200 transition-all shadow-sm"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-zinc-500">ChatGPT Plus 激活码</span>
        <span className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
          可用
        </span>
      </div>

      <div className="flex gap-1.5 justify-center mb-6">
        {maskedCode.split('').map((char, i) => (
          <div
            key={i}
            className="w-8 h-10 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center"
          >
            <span className={`text-lg font-mono font-bold ${char === '*' ? 'text-zinc-600' : 'text-violet-600'}`}>
              {char}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-zinc-500">支持</span>
        <div className="flex items-center gap-1.5">
          {/* 微信支付 */}
          <div className="flex items-center gap-1 rounded-md bg-zinc-800/80 px-2 py-1">
            <svg className="size-4" viewBox="0 0 24 24" fill="none">
              <path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66l-.7 2.1 2.45-1.23c.78.22 1.6.34 2.47.34.33 0 .66-.02.98-.06A5.93 5.93 0 0 1 9.5 14c0-3.31 3.13-6 7-6 .17 0 .33.01.5.02C15.93 5.69 13.03 4 9.5 4z" fill="#07C160"/>
              <path d="M22 14c0-2.76-2.69-5-6-5s-6 2.24-6 5 2.69 5 6 5c.7 0 1.37-.1 2-.29l1.8.9-.52-1.54C20.88 17.06 22 15.63 22 14z" fill="#07C160"/>
            </svg>
            <span className="text-[10px] text-zinc-400">微信</span>
          </div>
          {/* 支付宝 */}
          <div className="flex items-center gap-1 rounded-md bg-zinc-800/80 px-2 py-1">
            <svg className="size-4" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4" fill="#1677FF"/>
              <path d="M18.5 15.2c-1.5-.6-3.2-1.3-4.2-1.8.5-.9.9-1.9 1.1-3h-2.8v-1h3.2V8.6h-3.2V7h-1.4v1.6H8v.8h3.2v1H8.4v.8h5.4c-.2.7-.5 1.4-.9 2-1.2-.5-2.5-.8-3.5-.8-1.5 0-2.5.7-2.5 1.8 0 1.2 1.1 2 3 2 1.5 0 2.8-.6 3.8-1.5 1.3.7 3.3 1.5 4.8 2v-1.5z" fill="white"/>
              <circle cx="9.8" cy="16" r="1.2" fill="white"/>
            </svg>
            <span className="text-[10px] text-zinc-400">支付宝</span>
          </div>
          {/* 信用卡 */}
          <div className="flex items-center gap-1 rounded-md bg-zinc-800/80 px-2 py-1">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span className="text-[10px] text-zinc-400">银行卡</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-white">
          ¥{price}
        </div>
        <Button
          onClick={handleBuy}
          disabled={loading}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/20"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="size-4" />
              立即购买
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
