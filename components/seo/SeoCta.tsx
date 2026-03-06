import Link from 'next/link'

interface SeoCtaProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
}

export function SeoCta({ title, description, buttonText, buttonHref }: SeoCtaProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="relative rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        <p className="text-zinc-400 mb-8 max-w-xl mx-auto">{description}</p>
        <Link
          href={buttonHref}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-105"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
