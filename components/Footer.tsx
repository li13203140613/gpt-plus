'use client'

import Link from 'next/link'
import { Globe } from 'lucide-react'
import { useT, useLocale } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n/config'

const FOOTER_SEO_LINKS = [
  { href: '/chatgpt-plus-kaitong', label: 'ChatGPT Plus 开通' },
  { href: '/chatgpt-plus-shengji', label: 'ChatGPT Plus 升级' },
  { href: '/chatgpt-plus-dingyue', label: 'ChatGPT Plus 订阅' },
  { href: '/chatgpt-plus-goumai', label: 'ChatGPT Plus 购买' },
  { href: '/chatgpt-plus-chongzhi', label: 'ChatGPT Plus 充值' },
  { href: '/chatgpt-plus-kaitong-fuwu', label: '开通服务' },
  { href: '/chatgpt-plus-dingyue-fuwu', label: '订阅服务' },
  { href: '/chatgpt-plus-zhifu-xiezhu', label: '支付协助' },
  { href: '/chatgpt-plus-dai-kaitong', label: '代开通' },
  { href: '/chatgpt-plus-dai-dingyue', label: '代订阅' },
]

const LANGUAGE_OPTIONS: { value: Locale; flag: string; label: string }[] = [
  { value: 'zh', flag: '🇨🇳', label: '中文' },
  { value: 'en', flag: '🇺🇸', label: 'English' },
  { value: 'ja', flag: '🇯🇵', label: '日本語' },
  { value: 'ko', flag: '🇰🇷', label: '한국어' },
  { value: 'fr', flag: '🇫🇷', label: 'Français' },
  { value: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { value: 'es', flag: '🇪🇸', label: 'Español' },
]

export function Footer() {
  const t = useT()
  const { locale, setLocale } = useLocale()

  return (
    <footer className="mt-20 border-t border-gray-100 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-b border-gray-100 pb-6">
          {t.footerPrimaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-violet-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {locale === 'zh' && (
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6">
            {FOOTER_SEO_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 transition-colors hover:text-violet-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Language Switcher */}
        <div className="mb-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2">
            <Globe className="size-4 text-gray-400" />
            <div className="flex flex-wrap items-center justify-center gap-1">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLocale(lang.value)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    locale === lang.value
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-400 sm:flex-row">
          <p>{t.footerDesc}</p>
          <p>&copy; {new Date().getFullYear()} GPT Plus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
