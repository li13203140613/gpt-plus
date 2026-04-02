'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Mail, Sparkles, MessageSquare, Image, Brain, Bot, FolderOpen, Video, Code2, Shield, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { WechatPayModal } from './WechatPayModal'
import { trackEvent, setUserDataForAds, trackGoogleAdsSecondaryConversion, trackViewItem } from '@/lib/analytics'
import { useT, useLocale } from '@/lib/i18n/context'
import { formatPrice } from '@/lib/i18n/config'
import { captureGclid, getGclid } from '@/lib/gclid'

const BENEFIT_ICONS = [Sparkles, MessageSquare, Image, Brain, Bot, FolderOpen, Video, Code2]

interface CodeGridProps {
  priceOverride?: number
}

export function CodeGrid({ priceOverride }: CodeGridProps = {}) {
  const t = useT()
  const { locale, config } = useLocale()

  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [wechatModal, setWechatModal] = useState<{ open: boolean; codeUrl: string; outTradeNo: string; amount: number }>({
    open: false, codeUrl: '', outTradeNo: '', amount: 0,
  })
  const emailFocusTracked = useRef(false)
  const viewItemTracked = useRef(false)

  const displayPrice = priceOverride ? config.priceOverride : config.price
  const originalPrice = priceOverride ? config.price : config.originalPrice

  // Countdown timer when submitting
  useEffect(() => {
    if (!submitting || countdown <= 0) return
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [submitting, countdown])

  // Capture gclid from URL on mount (for server-side conversion tracking)
  useEffect(() => { captureGclid() }, [])

  // Track view_item when component mounts (Google recommended e-commerce event)
  useEffect(() => {
    if (!viewItemTracked.current) {
      viewItemTracked.current = true
      trackViewItem(displayPrice, config.currency.toUpperCase())
    }
  }, [])

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
      toast.error(t.invalidEmail)
      return
    }

    trackEvent('begin_checkout', { value: displayPrice, currency: config.currency.toUpperCase(), source_page: sourcePage })
    trackEvent('email_submit', { source_page: sourcePage })

    // Set user email for Enhanced Conversions (hashed) — improves Google Ads attribution
    setUserDataForAds(normalizedEmail)
    // Fire begin_checkout as Google Ads secondary conversion (needs separate label in Google Ads)
    trackGoogleAdsSecondaryConversion('qgLwCJ_b448cELOXuYhD', displayPrice, config.currency)
    setSubmitting(true)
    setCountdown(10)

    try {
      // Chinese locale: use native WeChat Pay
      if (locale === 'zh') {
        const res = await fetch('/api/payment/wechat-native', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyerEmail: normalizedEmail,
            locale,
            ...(priceOverride ? { priceOverride } : {}),
            gclid: getGclid() || undefined,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || t.paymentCreateFailed)
        }

        trackEvent('wechat_pay_qr_shown', { source_page: sourcePage })
        setWechatModal({
          open: true,
          codeUrl: data.code_url,
          outTradeNo: data.out_trade_no,
          amount: data.amount,
        })
        setSubmitting(false)
        return
      }

      // Other locales: use Stripe
      const res = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerEmail: normalizedEmail,
          locale,
          ...(priceOverride ? { priceOverride } : {}),
          sourcePage: window.location.pathname,
          gclid: getGclid() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || t.paymentCreateFailed)
      }

      if (!data.url) {
        throw new Error(t.noPaymentUrl)
      }

      trackEvent('checkout_redirect', { source_page: sourcePage })
      window.location.href = data.url
    } catch (err) {
      const message = err instanceof Error ? err.message : t.paymentRetry
      trackEvent('checkout_api_error', { error_message: message, source_page: sourcePage })
      toast.error(message)
      setSubmitting(false)
    }
  }

  const isZh = locale === 'zh'

  return (
    <div className="max-w-xl mx-auto">
      <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-xl shadow-violet-500/5">
        <div className="space-y-6 px-6 py-8 sm:px-10">
          {/* Official badge + Price */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs tracking-wide text-gray-400">{t.officialPlan}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                {t.perMonth}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(locale, displayPrice)}
              {originalPrice && (
                <span className="text-base font-normal text-gray-400 line-through ml-2">
                  {formatPrice(locale, originalPrice)}
                </span>
              )}
            </p>
            <p className="mt-2 text-sm text-gray-400">{priceOverride ? t.priceNoteOverride : t.priceNote}</p>
          </div>

          {/* Email */}
          <div className="space-y-3">
            <label htmlFor="buyer-email" className="block text-sm font-medium text-gray-800">
              {t.emailLabel}
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="buyer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onFocus={handleEmailFocus}
                placeholder={t.emailPlaceholder}
                className="h-12 rounded-xl border-gray-200 bg-white pl-11 text-gray-900 placeholder:text-gray-400 focus-visible:border-violet-400 focus-visible:ring-violet-100"
              />
            </div>
          </div>

          <Button
            onClick={handleBuy}
            disabled={submitting}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-base font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                {countdown > 0 ? `马上加载 ${countdown}s` : '加载中...'}
              </span>
            ) : (
              <>
                {t.buyButton}
                <span className="ml-2 inline-flex items-center gap-1.5">
                  {isZh ? (
                    <>
                      {/* Alipay */}
                      <svg viewBox="0 0 1024 1024" className="size-5" fill="white">
                        <path d="M1024.0512 701.0304V196.864A196.9664 196.9664 0 0 0 827.136 0H196.864A196.9664 196.9664 0 0 0 0 196.864v630.272A196.9152 196.9152 0 0 0 196.864 1024h630.272a197.12 197.12 0 0 0 193.8432-162.0992c-52.224-22.6304-278.528-120.32-396.4416-176.64-89.7024 108.6976-183.7056 173.9264-325.3248 173.9264s-236.1856-87.2448-224.8192-194.048c7.4752-70.0416 55.552-184.576 264.2944-164.9664 110.08 10.3424 160.4096 30.8736 250.1632 60.5184 23.1936-42.5984 42.496-89.4464 57.1392-139.264H248.064v-39.424h196.9152V311.1424H204.8V267.776h240.128V165.632s2.1504-15.9744 19.8144-15.9744h98.4576V267.776h256v43.4176h-256V381.952h208.8448a805.9904 805.9904 0 0 1-84.8384 212.6848c60.672 22.016 336.7936 106.3936 336.7936 106.3936zM283.5456 791.6032c-149.6576 0-173.312-94.464-165.376-133.9392 7.8336-39.3216 51.2-90.624 134.4-90.624 95.5904 0 181.248 24.4736 284.0576 74.5472-72.192 94.0032-160.9216 150.016-253.0816 150.016z" />
                      </svg>
                      {/* WeChat Pay */}
                      <svg viewBox="0 0 1024 1024" className="size-5" fill="white">
                        <path d="M404.511405 600.865957c-4.042059 2.043542-8.602935 3.223415-13.447267 3.223415-11.197016 0-20.934798-6.169513-26.045189-15.278985l-1.959631-4.296863-81.56569-178.973184c-0.880043-1.954515-1.430582-4.14746-1.430582-6.285147 0-8.251941 6.686283-14.944364 14.938224-14.944364 3.351328 0 6.441713 1.108241 8.94165 2.966565l96.242971 68.521606c7.037277 4.609994 15.433504 7.305383 24.464181 7.305383 5.40101 0 10.533914-1.00284 15.328104-2.75167l452.645171-201.459315C811.496653 163.274644 677.866167 100.777241 526.648117 100.777241c-247.448742 0-448.035176 167.158091-448.035176 373.361453 0 112.511493 60.353576 213.775828 154.808832 282.214547 7.582699 5.405103 12.537548 14.292518 12.537548 24.325012 0 3.312442-0.712221 6.358825-1.569752 9.515724-7.544837 28.15013-19.62599 73.202209-20.188808 75.314313-0.940418 3.529383-2.416026 7.220449-2.416026 10.917654 0 8.245801 6.692423 14.933107 14.944364 14.933107 3.251044 0 5.89015-1.202385 8.629541-2.7793l98.085946-56.621579c7.377014-4.266164 15.188934-6.89913 23.790846-6.89913 4.577249 0 9.003048 0.703011 13.174044 1.978051 45.75509 13.159718 95.123474 20.476357 146.239666 20.476357 247.438509 0 448.042339-167.162184 448.042339-373.372709 0-62.451354-18.502399-121.275087-51.033303-173.009356L407.778822 598.977957 404.511405 600.865957z" />
                      </svg>
                    </>
                  ) : (
                    /* Card icon for non-Chinese */
                    <CreditCard className="size-5" />
                  )}
                </span>
              </>
            )}
          </Button>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-3">
              <Shield className="size-4 flex-shrink-0 text-violet-500" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{t.trustAfterSale}</p>
                <p className="text-xs text-gray-500">{t.trustAfterSaleDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-3">
              <CreditCard className="size-4 flex-shrink-0 text-violet-500" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{t.trustPayment}</p>
                <p className="text-xs text-gray-500">{t.trustPaymentDesc}</p>
              </div>
            </div>
          </div>

          {/* Plus Benefits */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">{t.plusBenefitsTitle}</p>
              <span className="text-sm font-semibold text-violet-600">{t.perMonth}</span>
            </div>
          </div>
        </div>
      </div>
      <WechatPayModal
        open={wechatModal.open}
        onClose={() => setWechatModal(prev => ({ ...prev, open: false }))}
        codeUrl={wechatModal.codeUrl}
        outTradeNo={wechatModal.outTradeNo}
        amount={wechatModal.amount}
      />
    </div>
  )
}
