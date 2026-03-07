'use client'

import { useEffect, useState } from 'react'
import { Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { ChatGptIcon } from './ChatGptIcon'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface Product {
  id: string
  price: number
  stock: number
  title: string
}

function formatPrice(price: number) {
  return `¥${price.toFixed(2)}`
}

export function CodeGrid() {
  const [product, setProduct] = useState<Product | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch('/api/codes')
        if (!res.ok) throw new Error('加载商品失败')

        const data = await res.json()
        setProduct(data.product)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载商品失败')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 text-emerald-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600">{error}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-slate-700">当前暂无可售库存</p>
        <p className="mt-2 text-sm text-slate-500">稍后再来查看，我们会补充库存。</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white/82 shadow-[0_32px_80px_-48px_rgba(15,23,42,0.35)] backdrop-blur-sm">
        <div className="border-b border-stone-200 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.2),_rgba(255,255,255,0.96)_58%)] px-6 py-10 text-center sm:px-10">
          <div className="mx-auto flex size-24 items-center justify-center rounded-[28px] border border-emerald-200 bg-white shadow-[0_18px_45px_-30px_rgba(16,185,129,0.65)]">
            <ChatGptIcon className="size-12 text-emerald-600" />
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.28em] text-emerald-700/80">GPT Plus</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">{product.title}</h3>
        </div>

        <div className="space-y-6 px-6 py-8 sm:px-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-[#fffaf5] p-5 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.28)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Price</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{formatPrice(product.price)}</p>
              <p className="mt-2 text-sm text-slate-500">每次下单系统自动分配 1 个激活码</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-[#fffaf5] p-5 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.28)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stock</p>
              <p className="mt-3 text-3xl font-bold text-emerald-600">{product.stock}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="buyer-email" className="block text-sm font-medium text-slate-800">
              接收邮箱
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="buyer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-12 rounded-xl border-stone-300 bg-white/90 pl-11 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-400 focus-visible:ring-emerald-100"
              />
            </div>
            <p className="text-xs text-slate-500">邮箱会随订单一起保存，方便后续恢复订单信息。</p>
          </div>

          <Button
            onClick={handleBuy}
            disabled={submitting}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-base font-semibold text-white shadow-[0_18px_40px_-18px_rgba(16,185,129,0.65)] hover:from-emerald-500 hover:to-teal-500"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : '填写邮箱并去支付'}
          </Button>
        </div>
      </div>
    </div>
  )
}
