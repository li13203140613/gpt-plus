'use client'

import { MessageCircle, Star } from 'lucide-react'

const REVIEW_IMAGES = [
  '/reviews/01843880ed72fc76ead0bd8a58ed929.jpg',
  '/reviews/1af5f04bc8fb37090251d257cd87dbc.jpg',
  '/reviews/1f80df2b8367e7244d794814ec523f8.jpg',
  '/reviews/1f897926ec179b17fb5d068ba313afd.jpg',
  '/reviews/2591cb4e0b65ca221a913792fb5d75e.jpg',
  '/reviews/46888b43571a987182bedaafe9b5ff9.jpg',
  '/reviews/482ca0e8a98a4e77c2ab003d3e684a6.jpg',
  '/reviews/537d846e1e2d517e06d074c76bb13de.jpg',
  '/reviews/66e1f5fcb685fd7695da4ba3db39176.jpg',
  '/reviews/872b525b2945ce35fc78271a840871b.jpg',
  '/reviews/93a2bd7902c90c0a8b74a08bca0744a.jpg',
  '/reviews/95367a3b72e457e78cc6f790584afc6.jpg',
  '/reviews/b3abe6cb476da4b60d535a683e0b591.jpg',
  '/reviews/b52d860df70b167de54f02850c2e6b1.jpg',
  '/reviews/c3f69f61fc806c8f1148886c5c02183.jpg',
  '/reviews/c69900afebe4d886aa55cbac950cd57.jpg',
  '/reviews/d53737eebff835bf3cc8a722d844986.jpg',
  '/reviews/d75644cea348fadb118c05ba85afd41.jpg',
  '/reviews/fbb74fc06bbf2cf9b72a98e52fcd614.jpg',
]

const row1 = REVIEW_IMAGES.slice(0, 10)
const row2 = REVIEW_IMAGES.slice(10)

function MarqueeRow({
  images,
  duration,
  reverse,
}: {
  images: string[]
  duration: number
  reverse?: boolean
}) {
  const doubled = [...images, ...images]
  return (
    <div className="group relative overflow-hidden">
      {/* Gradient fade masks - matching the violet-tinted background */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-violet-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-violet-50 to-transparent" />

      <div
        className={`flex gap-6 group-hover:[animation-play-state:paused] ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 overflow-hidden rounded-2xl border border-violet-200/50 bg-white shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-violet-500/10 hover:border-violet-300/60"
          >
            <img
              src={src}
              alt="Customer conversation"
              loading="lazy"
              className="h-[240px] w-auto object-cover sm:h-[280px]"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReviewMarquee() {
  return (
    <section className="relative overflow-hidden bg-violet-50 py-24">
      {/* Subtle decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-64 w-[500px] -translate-x-1/2 rounded-full bg-violet-200/30 blur-[100px]" />
        <div className="absolute -bottom-20 right-1/4 h-48 w-[350px] rounded-full bg-indigo-200/20 blur-[80px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 mx-auto mb-16 max-w-2xl px-4 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur">
          <MessageCircle className="size-4 text-violet-500" />
          <span className="text-sm font-medium tracking-wide text-violet-600">
            真实用户反馈
          </span>
        </div>

        <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          用户真实评价
        </h2>

        <p className="text-base leading-relaxed text-gray-500 sm:text-lg">
          正规渠道，可走闲鱼淘宝
        </p>

        {/* Stats row */}
        <div className="mt-8 flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-semibold text-gray-900">4.9/5</span>
            <span className="text-gray-400">好评率</span>
          </div>
          <div className="h-4 w-px bg-gray-300" />
          <div>
            <span className="font-semibold text-gray-900">10,000+</span>
            <span className="ml-1.5 text-gray-400">用户已充值</span>
          </div>
        </div>
      </div>

      {/* Marquee rows — larger gap between rows */}
      <div className="relative z-10 flex flex-col gap-8">
        <MarqueeRow images={row1} duration={55} />
        <MarqueeRow images={row2} duration={42} reverse />
      </div>
    </section>
  )
}
