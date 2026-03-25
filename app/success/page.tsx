'use client'

import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Copy, Loader2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { ORDER_HISTORY_COOKIE, parseOrderHistoryCookie, serializeOrderHistoryCookie } from '@/lib/order-history'
import { trackEvent, trackGoogleAdsConversion } from '@/lib/analytics'
import { useT } from '@/lib/i18n/context'

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
  const t = useT()
  const searchParams = useSearchParams()
  const querySessionId = searchParams.get('session_id')?.trim() || null

  const [status, setStatus] = useState<PaymentStatus>('loading')
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderInfo | null>(null)
  const [pollCount, setPollCount] = useState(0)
  const [restoredFromCookie, setRestoredFromCookie] = useState(false)
  const purchaseTracked = useRef(false)

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

    const isRecovery = !querySessionId && !!storedSessionId
    setRestoredFromCookie(isRecovery)
    if (isRecovery) {
      trackEvent('order_recovery', { source: 'cookie' })
    }
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
          if (!purchaseTracked.current) {
            purchaseTracked.current = true
            trackEvent('purchase', {
              transaction_id: activeSessionId!,
              value: 128,
              currency: 'CNY',
            })
            trackGoogleAdsConversion('izOyCJuqvY4cELOXuYhD', 128)
          }
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
    trackEvent('copy_activation_code', { method: 'click' })
    toast.success(t.success.codeCopied)
  }

  function handleActivationSiteClick() {
    trackEvent('click_activation_site', { destination: 'chong.plus' })
  }

  return (
    <div className="max-w-md w-full text-center">
      {(status === 'loading' || status === 'pending') && (
        <div className="space-y-6">
          <Loader2 className="size-16 text-emerald-400 animate-spin mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t.success.confirming}</h1>
            <p className="mt-2 text-slate-600">{t.success.confirmingDesc}</p>
          </div>
        </div>
      )}

      {status === 'completed' && order?.code && (
        <div className="space-y-8">
          <div className="space-y-4">
            <CheckCircle className="size-16 text-emerald-400 mx-auto" />
            <h1 className="text-2xl font-bold text-slate-900">{t.success.paymentSuccess}</h1>
            <p className="text-slate-600">{t.success.codeDesc}</p>
            {restoredFromCookie && (
              <p className="text-sm text-emerald-700">{t.success.restoredFromCookie}</p>
            )}
          </div>

          <div className="relative rounded-2xl border border-emerald-200 bg-white/82 p-8 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.3)]">
            <div className="flex gap-2 justify-center flex-wrap">
              {order.code.split('').map((char, index) => (
                <div
                  key={`${char}-${index}`}
                  className="flex h-14 w-10 items-center justify-center rounded-lg border border-stone-200 bg-[#fffaf5]"
                >
                  <span className="text-2xl font-mono font-bold text-emerald-600">{char}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={copyCode}
              variant="outline"
              className="mt-6 w-full border-emerald-200 bg-white/70 text-emerald-700 hover:bg-emerald-50"
            >
              <Copy className="size-4" />
              {t.success.copyCode}
            </Button>
          </div>

          {order.email && (
            <div className="rounded-xl border border-stone-200 bg-white/82 px-4 py-3 text-left shadow-[0_18px_45px_-34px_rgba(15,23,42,0.24)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t.success.backupEmailLabel}</p>
              <p className="mt-2 text-sm text-slate-900">{order.email}</p>
              <p className="mt-1 text-xs text-slate-500">{t.success.backupEmailDesc}</p>
            </div>
          )}

          <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/85 p-5 text-left">
            <p className="text-base font-semibold text-emerald-700">{t.success.nextStepsTitle}</p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">1</span>
                <p className="text-sm text-slate-700">
                  {t.success.step1}
                  <a
                    href="https://chatgpt.com/api/auth/session"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-emerald-700 underline hover:text-emerald-600 ml-1"
                  >
                    chatgpt.com/api/auth/session
                  </a>
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">2</span>
                <p className="text-sm text-slate-700">{t.success.step2}</p>
              </div>
              <div className="flex gap-3">
                <span className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">3</span>
                <div className="space-y-2">
                  <p className="text-sm text-slate-700">{t.success.step3prefix}</p>
                  <p className="text-sm text-slate-700">
                    {t.success.step3site}
                    <a
                      href="https://chong.plus"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 break-all text-emerald-700 underline hover:text-emerald-600"
                    >
                      https://chong.plus
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <a
              href="https://chong.plus"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleActivationSiteClick}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 transition-colors"
            >
              {t.success.goToActivation}
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50/90 px-4 py-3 text-left">
            <p className="text-xs text-amber-700">{t.success.retryHint}</p>
          </div>

          <Link href="/">
            <Button variant="ghost" className="text-slate-600 hover:bg-white/70 hover:text-slate-900">
              {t.success.backToHome}
            </Button>
          </Link>

          <p className="text-sm text-slate-500">
            {t.success.contactSupportText}<span className="text-slate-900">fanxx2029</span>
          </p>
        </div>
      )}

      {status === 'empty' && (
        <div className="space-y-6">
          <XCircle className="size-16 text-slate-400 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t.success.noOrder}</h1>
            <p className="mt-2 text-slate-600">{t.success.noOrderDesc}</p>
          </div>
          <Link href="/">
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
              {t.success.backToHome}
            </Button>
          </Link>
        </div>
      )}

      {status === 'expired' && (
        <div className="space-y-6">
          <XCircle className="size-16 text-amber-400 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t.success.expired}</h1>
            <p className="mt-2 text-slate-600">{t.success.expiredDesc}</p>
          </div>
          <Link href="/">
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
              {t.success.backToHome}
            </Button>
          </Link>
        </div>
      )}

      {status === 'failed' && (
        <div className="space-y-6">
          <XCircle className="size-16 text-red-400 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t.success.failed}</h1>
            <p className="mt-2 text-slate-600">
              {!activeSessionId ? t.success.failedNoSession : t.success.failedTimeout}
            </p>
          </div>
          <Link href="/">
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
              {t.success.backToHome}
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-grid text-slate-900">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
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
