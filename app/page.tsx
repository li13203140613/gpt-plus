'use client'

import { Shield, Clock, Star, CheckCircle, Users, Headphones, CreditCard, UserCheck } from 'lucide-react'
import { ReviewMarquee } from '@/components/ReviewMarquee'
import { useActivationUrl } from '@/lib/useActivationUrl'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CodeGrid } from '@/components/CodeGrid'
import { Typewriter } from '@/components/Typewriter'
import { useT, useLocale } from '@/lib/i18n/context'

const STAT_ICONS = [Users, CheckCircle, Clock, Shield]
const FEATURE_ICONS = [CheckCircle, CreditCard, Shield, UserCheck]

function JsonLd() {
  // Keep JSON-LD in Chinese for SEO (primary target market)
  const productData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'ChatGPT Plus 充值激活码',
    description: 'ChatGPT Plus 充值开通服务，付款后即时获取激活码，安全快捷。',
    brand: { '@type': 'Brand', name: 'GPT Plus' },
    offers: {
      '@type': 'Offer',
      price: '99.00',
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock',
      url: 'https://www.gpt-plus.ai',
      seller: { '@type': 'Organization', name: 'GPT Plus' },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '59809',
      ratingCount: '59809',
      bestRating: '5',
    },
  }

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: 'https://www.gpt-plus.ai',
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
    </>
  )
}

export default function HomePage() {
  const t = useT()
  const { locale } = useLocale()
  const activationUrl = useActivationUrl()

  return (
    <div className="min-h-screen flex flex-col bg-grid text-gray-900">
      <JsonLd />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-4 text-center">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5">
              <span className="text-sm font-medium text-violet-700">{t.heroBadge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none text-gray-900">
              <span className="block">{t.heroTitleLine1}</span>
              <span className="mt-2 block sm:mt-3">{t.heroTitleLine2}</span>
            </h1>

            <p className="mx-auto mt-3 inline-block rounded-lg bg-violet-50 px-6 py-1.5 text-lg font-semibold text-violet-700 sm:text-xl h-9 leading-9">
              <Typewriter />
            </p>

            <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
              {t.heroDesc}
            </p>

            {/* Social proof badge */}
            <div className="mt-3 inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white/80 px-5 py-2 text-gray-700 shadow-sm backdrop-blur">
              <div className="flex -space-x-1.5">
                {[
                  'https://images.unsplash.com/photo-1643990083137-34669413e267?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
                  'https://images.unsplash.com/photo-1643990084162-7ea1395ab14e?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
                  'https://images.unsplash.com/photo-1704731268191-e744c6d96b26?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="size-7 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <span className="text-sm">
                <span className="font-bold text-violet-600">{t.socialProofCount}</span> {t.socialProofText}
              </span>
            </div>

          </div>
        </section>

        {/* Product Section */}
        <section id="product" className="max-w-6xl mx-auto px-4 pt-4 pb-8">
          <CodeGrid />
        </section>

        {/* Trust Stats Bar */}
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {t.stats.map((item, i) => {
              const Icon = STAT_ICONS[i]
              return (
                <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                  <Icon className="size-5 text-violet-500 mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-900">{item.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.label}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* User Testimonials — real chat screenshots */}
        <ReviewMarquee />

        {/* Why Choose Us */}
        <section className="max-w-5xl mx-auto px-4 pt-24 pb-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-900">
            {t.whyChooseTitle}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-500">
            {t.whyChooseDesc}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.features.map((item, i) => {
              const Icon = FEATURE_ICONS[i]
              return (
                <div key={item.title} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-violet-200 hover:bg-white hover:shadow-lg hover:shadow-violet-500/5">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-white border border-gray-100">
                    <Icon className="size-5 text-violet-600" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-900">
            {t.howItWorksTitle}
          </h2>
          <p className="mb-10 text-center text-gray-500">{t.howItWorksDesc}</p>
          <div className="space-y-6">
            {t.howItWorksSteps.map((item, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                  {i + 1}
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Service Notice */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-900">
            {t.serviceNoticeTitle}
          </h2>

          <div className="space-y-4 mb-8">
            {t.serviceSteps.map((item, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-700">
                  {i + 1}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                  {item.link && (
                    <a href={item.link.url} target="_blank" rel="noopener noreferrer" className="inline-block break-all text-sm text-violet-600 underline hover:text-violet-500">
                      {item.link.text}
                    </a>
                  )}
                  {item.extra && <p className="text-sm text-gray-500">{item.extra}</p>}
                  {item.cta && (
                    <a href={activationUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-500">
                      {item.cta.text}
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="space-y-2 rounded-2xl border border-violet-200 bg-violet-50/80 p-5">
              <h3 className="text-sm font-semibold text-violet-700">{t.warranty.title}</h3>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {t.warranty.items.map((text, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-violet-600">&#10003;</span>{text}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
              <h3 className="text-sm font-semibold text-amber-700">{t.beforeYouBuy.title}</h3>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {t.beforeYouBuy.items.map((text, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-amber-600">!</span>{text}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-rose-200 bg-rose-50/80 p-5">
            <h3 className="text-sm font-semibold text-rose-700">{t.riskNotice.title}</h3>
            <p className="text-sm leading-relaxed text-gray-500">{t.riskNotice.text}</p>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            {t.contactSupport}<span className="text-gray-900">{t.contactWechat}</span>
          </p>
        </section>

        {/* Trust Badges */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-gray-500">
                <Shield className="size-5 text-violet-500" />
                <span className="text-sm">{t.trustBadgeSSL}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#635BFF"/>
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .9-.779 1.424-2.133 1.424-1.89 0-4.882-.921-6.736-2.196l-.907 5.534C5.476 22.688 8.44 24 12.336 24c2.588 0 4.737-.638 6.281-1.846 1.649-1.293 2.477-3.176 2.477-5.592 0-4.145-2.503-5.81-7.118-7.412z" fill="white" transform="scale(0.5) translate(12, 12)"/>
                </svg>
                <span className="text-sm">{t.trustBadgeStripe}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Headphones className="size-5 text-violet-500" />
                <span className="text-sm">{t.trustBadgeSupport}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle className="size-5 text-violet-500" />
                <span className="text-sm">{t.trustBadgeWarranty}</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-900">
            {t.faqTitle}
          </h2>
          <div className="space-y-4">
            {t.faqItems.map((item, i) => (
              <details key={i} className="group rounded-2xl border border-gray-100 bg-white shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-base font-medium text-gray-800 transition-colors hover:text-violet-600 [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <svg className="size-5 shrink-0 text-gray-400 transition-transform group-open:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed text-gray-500">{item.a}</div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
