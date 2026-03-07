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
        <Loader2 className="size-8 text-violet-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">{error}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-700">当前暂无可售库存</p>
        <p className="mt-2 text-sm text-gray-400">稍后再来查看，我们会补充库存。</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-xl shadow-violet-500/5">
        <div className="border-b border-gray-100 bg-gradient-to-b from-violet-50 to-white px-6 py-10 text-center sm:px-10">
          <div className="mx-auto flex size-24 items-center justify-center rounded-[28px] border border-violet-100 bg-white shadow-lg shadow-violet-500/10">
            <ChatGptIcon className="size-12 text-violet-600" />
          </div>
          <p className="mt-6 text-sm uppercase tracking-[0.28em] text-violet-600/80">GPT Plus</p>
          <h3 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">{product.title}</h3>
        </div>

        <div className="space-y-6 px-6 py-8 sm:px-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Price</p>
              <p className="mt-3 text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>
              <p className="mt-2 text-sm text-gray-400">每次下单系统自动分配 1 个激活码</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Stock</p>
              <p className="mt-3 text-3xl font-bold text-violet-600">{product.stock}</p>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  )
}
