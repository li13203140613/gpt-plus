'use client'

import { useEffect, useState } from 'react'
import { Bot, Loader2, Mail, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
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
        <p className="text-zinc-400">{error}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400 text-lg">当前暂无可售库存</p>
        <p className="text-zinc-500 text-sm mt-2">稍后再来查看，我们会补充库存。</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-[28px] border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-emerald-950/20">
        <div className="border-b border-zinc-800 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_58%)] px-6 py-10 text-center sm:px-10">
          <div className="mx-auto flex size-24 items-center justify-center rounded-[28px] border border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-950/30">
            <Bot className="size-12 text-emerald-300" />
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.28em] text-emerald-300/80">GPT Plus</p>
          <h3 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{product.title}</h3>
          <p className="mt-4 text-sm leading-6 text-zinc-400 sm:text-base">
            支付成功后，页面会直接展示激活码。邮箱会作为备份接收地址，方便你关闭页面后继续找回。
          </p>
        </div>

        <div className="space-y-6 px-6 py-8 sm:px-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Price</p>
              <p className="mt-3 text-3xl font-bold text-white">{formatPrice(product.price)}</p>
              <p className="mt-2 text-sm text-zinc-500">每次下单系统自动分配 1 个激活码</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Stock</p>
              <p className="mt-3 text-3xl font-bold text-emerald-400">{product.stock}</p>
              <p className="mt-2 text-sm text-zinc-500">库存数量会随支付和释放实时变化</p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 text-emerald-300" />
              <div className="space-y-1 text-sm text-zinc-300">
                <p>页面会展示激活码，邮箱是备用接收渠道。</p>
                <p>如果邮件发送已配置，支付完成后同一份激活码也会发到你填写的邮箱。</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="buyer-email" className="block text-sm font-medium text-zinc-200">
              接收邮箱
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <Input
                id="buyer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-12 rounded-xl border-zinc-700 bg-zinc-950/80 pl-11 text-white placeholder:text-zinc-500"
              />
            </div>
            <p className="text-xs text-zinc-500">邮箱会随订单一起保存，方便后续在页面恢复和邮件备份。</p>
          </div>

          <Button
            onClick={handleBuy}
            disabled={submitting}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-base font-semibold text-white shadow-lg shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : '填写邮箱并去支付'}
          </Button>
        </div>
      </div>
    </div>
  )
}
