import { Zap } from 'lucide-react'

interface SeoHeroProps {
  badge: string
  title: string
  subtitle: string
}

export function SeoHero({ badge, title, subtitle }: SeoHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 mb-6">
          <Zap className="size-3.5 text-violet-500" />
          <span className="text-sm text-violet-700">{badge}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>

        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
      </div>
    </section>
  )
}
