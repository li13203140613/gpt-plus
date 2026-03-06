'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Copy, Loader2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'

type PaymentStatus = 'loading' | 'pending' | 'completed' | 'expired' | 'failed'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState<PaymentStatus>('loading')
  const [code, setCode] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    if (!sessionId) {
      setStatus('failed')
      return
    }

    async function checkOrder() {
      try {
        const res = await fetch(`/api/order/${sessionId}`)
        const data = await res.json()

        if (data.status === 'completed' && data.code) {
          setStatus('completed')
          setCode(data.code)
          return
        }

        if (data.status === 'pending') {
          setStatus('pending')
          return
        }

        if (data.status === 'expired') {
          setStatus('expired')
          return
        }

        setStatus('failed')
      } catch {
        setStatus('failed')
      }
    }

    checkOrder()
  }, [sessionId, pollCount])

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
    if (!code) return
    navigator.clipboard.writeText(code)
    toast.success('激活码已复制到剪贴板')
  }

  return (
    <div className="max-w-md w-full text-center">
      {(status === 'loading' || status === 'pending') && (
        <div className="space-y-6">
          <Loader2 className="size-16 text-emerald-400 animate-spin mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-white">正在确认支付</h1>
            <p className="text-zinc-400 mt-2">请稍候，我们正在确认您的付款状态...</p>
          </div>
        </div>
      )}

      {status === 'completed' && code && (
        <div className="space-y-8">
          <div className="space-y-4">
            <CheckCircle className="size-16 text-emerald-400 mx-auto" />
            <h1 className="text-2xl font-bold text-white">支付成功！</h1>
            <p className="text-zinc-400">您的 ChatGPT Plus 激活码如下，请妥善保存</p>
          </div>

          <div className="relative rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8">
            <div className="flex gap-2 justify-center flex-wrap">
              {code.split('').map((char, i) => (
                <div
                  key={i}
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

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-left space-y-2">
            <p className="text-sm font-medium text-amber-300">下一步：前往激活网站</p>
            <p className="text-sm text-zinc-400">
              请复制上方激活码，然后前往卡密激活网站输入激活码，即可完成 ChatGPT Plus 的开通。
            </p>
          </div>

          <div className="space-y-2 text-sm text-zinc-500">
            <p>请截图或复制保存您的激活码，离开页面后将无法再次查看</p>
          </div>

          <Link href="/">
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              返回首页
            </Button>
          </Link>

          <p className="text-sm text-zinc-500">
            如有问题请联系{' '}
            <a href="mailto:lixiaofei160@gmail.com" className="text-emerald-400 hover:text-emerald-300 underline">
              lixiaofei160@gmail.com
            </a>
          </p>
        </div>
      )}

      {status === 'expired' && (
        <div className="space-y-6">
          <XCircle className="size-16 text-amber-400 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-white">支付已过期</h1>
            <p className="text-zinc-400 mt-2">该支付会话已过期，请返回首页重新购买</p>
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
            <h1 className="text-2xl font-bold text-white">支付确认失败</h1>
            <p className="text-zinc-400 mt-2">
              {!sessionId ? '无效的支付链接' : '支付确认超时，如已付款请联系客服'}
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
