'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Copy, Loader2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { ORDER_HISTORY_COOKIE, parseOrderHistoryCookie, serializeOrderHistoryCookie } from '@/lib/order-history'

type PaymentStatus = 'loading' | 'pending' | 'completed' | 'expired' | 'failed' | 'empty'

interface OrderInfo {
  code: string | null
  email: string | null
  status: 'pending' | 'completed' | 'expired'
}

function readCookie(name: string) {
  if (typeof document === 'undefined') return null

  const prefix = `${name}=`
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  return match ? decodeURIComponent(match.slice(prefix.length)) : null
}

function writeLastOrderCookie(sessionId: string) {
  document.cookie = `${ORDER_HISTORY_COOKIE}=${encodeURIComponent(serializeOrderHistoryCookie(sessionId))}; Max-Age=${60 * 60 * 24 * 30}; Path=/; SameSite=Lax`
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const querySessionId = searchParams.get('session_id')?.trim() || null

  const [status, setStatus] = useState<PaymentStatus>('loading')
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderInfo | null>(null)
  const [pollCount, setPollCount] = useState(0)
  const [restoredFromCookie, setRestoredFromCookie] = useState(false)

  useEffect(() => {
    const storedSessionId = parseOrderHistoryCookie(readCookie(ORDER_HISTORY_COOKIE))
    const nextSessionId = querySessionId || storedSessionId

    if (querySessionId) {
      writeLastOrderCookie(querySessionId)
    } else if (storedSessionId && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('session_id', storedSessionId)
      window.history.replaceState({}, '', url)
    }

    setRestoredFromCookie(!querySessionId && !!storedSessionId)
    setActiveSessionId(nextSessionId)
    setOrder(null)
    setPollCount(0)
    setStatus(nextSessionId ? 'loading' : 'empty')
  }, [querySessionId])

  useEffect(() => {
    if (!activeSessionId) {
      return
    }

    async function checkOrder() {
      try {
        const res = await fetch(`/api/order/${activeSessionId}`)
        if (!res.ok) {
          setStatus('failed')
          return
        }

        const data = await res.json()

        if (data.status === 'completed' && data.code) {
          setStatus('completed')
          setOrder(data)
          return
        }

        if (data.status === 'pending') {
          setStatus('pending')
          setOrder(data)
          return
        }

        if (data.status === 'expired') {
          setStatus('expired')
          setOrder(data)
          return
        }

        setStatus('failed')
      } catch {
        setStatus('failed')
      }
    }

    checkOrder()
  }, [activeSessionId, pollCount])

  useEffect(() => {
    if (status !== 'pending') return
    if (pollCount >= 30) {
      setStatus('failed')
      return
    }

    const timer = window.setTimeout(() => {
      setPollCount((prev) => prev + 1)
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [status, pollCount])

  function copyCode() {
    if (!order?.code) return

    navigator.clipboard.writeText(order.code)
    toast.success('激活码已复制到剪贴板')
  }

  return (
    <div className="max-w-md w-full text-center">
      {(status === 'loading' || status === 'pending') && (
        <div className="space-y-6">
          <Loader2 className="size-16 text-emerald-400 animate-spin mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-white">正在确认支付</h1>
            <p className="text-zinc-400 mt-2">请稍候，我们正在同步你的订单状态。</p>
          </div>
        </div>
      )}

      {status === 'completed' && order?.code && (
        <div className="space-y-8">
          <div className="space-y-4">
            <CheckCircle className="size-16 text-emerald-400 mx-auto" />
            <h1 className="text-2xl font-bold text-white">支付成功</h1>
            <p className="text-zinc-400">你的 ChatGPT Plus 激活码如下，请妥善保存。</p>
            {restoredFromCookie && (
              <p className="text-sm text-emerald-300">已从当前浏览器恢复上一次订单记录。</p>
            )}
          </div>

          <div className="relative rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8">
            <div className="flex gap-2 justify-center flex-wrap">
              {order.code.split('').map((char, index) => (
                <div
                  key={`${char}-${index}`}
                  className="w-10 h-14 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center"
                >
                  <span className="text-2xl font-mono font-bold text-emerald-400">{char}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={copyCode}
              variant="outline"
              className="mt-6 w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Copy className="size-4" />
              复制激活码
            </Button>
          </div>

          {order.email && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Backup email</p>
              <p className="mt-2 text-sm text-zinc-200">{order.email}</p>
              <p className="mt-1 text-xs text-zinc-500">如果邮件发送已配置，激活码也会同步发到这个邮箱。</p>
            </div>
          )}

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-left space-y-4">
            <p className="text-base font-semibold text-emerald-300">接下来按以下步骤完成充值：</p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="flex-shrink-0 size-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">1</span>
                <p className="text-sm text-zinc-300">
                  在已登录 ChatGPT 的浏览器中，打开：
                  <a
                    href="https://chatgpt.com/api/auth/session"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 underline break-all"
                  >
                    chatgpt.com/api/auth/session
                  </a>
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 size-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">2</span>
                <p className="text-sm text-zinc-300">
                  页面会显示一段代码，<strong className="text-white">完整复制</strong> 这段内容。
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 size-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">3</span>
                <p className="text-sm text-zinc-300">打开充值网站，粘贴代码并输入激活码，提交即可完成充值。</p>
              </div>
            </div>
            <a
              href="https://shop.gptai.vip/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 transition-colors"
            >
              前往充值网站
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-left">
            <p className="text-xs text-amber-300">如果充值失败，可以多提交几次；系统会自动处理订单状态。</p>
          </div>

          <Link href="/">
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              返回首页
            </Button>
          </Link>

          <p className="text-sm text-zinc-500">
            遇到问题？客服 QQ：<span className="text-zinc-300">2415997472</span>
          </p>
        </div>
      )}

      {status === 'empty' && (
        <div className="space-y-6">
          <XCircle className="size-16 text-zinc-500 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-white">没有可恢复的订单</h1>
            <p className="text-zinc-400 mt-2">当前浏览器里还没有最近支付记录，请返回首页重新购买。</p>
          </div>
          <Link href="/">
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
              返回首页
            </Button>
          </Link>
        </div>
      )}

      {status === 'expired' && (
        <div className="space-y-6">
          <XCircle className="size-16 text-amber-400 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-white">支付已过期</h1>
            <p className="text-zinc-400 mt-2">这个支付会话已过期，请返回首页重新下单。</p>
          </div>
          <Link href="/">
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
              返回首页
            </Button>
          </Link>
        </div>
      )}

      {status === 'failed' && (
        <div className="space-y-6">
          <XCircle className="size-16 text-red-400 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-white">订单确认失败</h1>
            <p className="text-zinc-400 mt-2">
              {!activeSessionId ? '缺少订单记录' : '订单确认超时，如已付款请联系客服处理'}
            </p>
          </div>
          <Link href="/">
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
              返回首页
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <Suspense
          fallback={
            <div className="text-center">
              <Loader2 className="size-16 text-emerald-400 animate-spin mx-auto" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
