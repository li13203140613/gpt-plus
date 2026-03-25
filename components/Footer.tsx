'use client'

import Link from 'next/link'
import { useT, useLocale } from '@/lib/i18n/context'

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

export function Footer() {
  const t = useT()
  const { locale } = useLocale()

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
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-400 sm:flex-row">
          <p>{t.footerDesc}</p>
          <p>&copy; {new Date().getFullYear()} GPT Plus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
