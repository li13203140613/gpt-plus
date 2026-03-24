'use client'

import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

interface SeoCtaProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  pageSlug?: string
}

export function SeoCta({ title, description, buttonText, buttonHref, pageSlug }: SeoCtaProps) {
  function handleClick() {
    trackEvent('seo_cta_click', {
      page_slug: pageSlug || window.location.pathname,
      cta_type: buttonText,
    })
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="relative rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50 p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
          {title}
        </h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">{description}</p>
        <Link
          href={buttonHref}
          onClick={handleClick}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
