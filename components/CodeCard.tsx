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
      className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6 hover:border-emerald-500/30 transition-all"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-zinc-500">ChatGPT Plus 激活码</span>
        <span className="text-xs text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          可用
        </span>
      </div>

      <div className="flex gap-1.5 justify-center mb-6">
        {maskedCode.split('').map((char, i) => (
          <div
            key={i}
            className="w-8 h-10 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center"
          >
            <span className={`text-lg font-mono font-bold ${char === '*' ? 'text-zinc-600' : 'text-emerald-400'}`}>
              {char}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-white">
          ¥{price}
        </div>
        <Button
          onClick={handleBuy}
          disabled={loading}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20"
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
