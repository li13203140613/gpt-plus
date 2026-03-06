import { Zap } from 'lucide-react'

interface SeoHeroProps {
  badge: string
  title: string
  subtitle: string
}

export function SeoHero({ badge, title, subtitle }: SeoHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[100px]" />

      <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 mb-6">
          <Zap className="size-3.5 text-emerald-400" />
          <span className="text-sm text-emerald-300">{badge}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">{subtitle}</p>
      </div>
    </section>
  )
}
