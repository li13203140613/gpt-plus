interface SeoFaqProps {
  title: string
  items: Array<{ q: string; a: string }>
}

export function SeoFaq({ title, items }: SeoFaqProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
        <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm"
          >
            <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-base font-medium text-zinc-100 hover:text-emerald-300 transition-colors [&::-webkit-details-marker]:hidden">
              <span>{item.q}</span>
              <svg
                className="size-5 shrink-0 text-zinc-500 transition-transform group-open:rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </summary>
            <div className="px-6 pb-5 text-sm leading-relaxed text-zinc-400">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  )
}
