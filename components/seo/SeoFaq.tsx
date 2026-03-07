interface SeoFaqProps {
  title: string
  items: Array<{ q: string; a: string }>
}

export function SeoFaq({ title, items }: SeoFaqProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-900">
        {title}
      </h2>
      <div className="space-y-4">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-base font-medium text-gray-800 hover:text-violet-600 transition-colors [&::-webkit-details-marker]:hidden">
              <span>{item.q}</span>
              <svg
                className="size-5 shrink-0 text-gray-400 transition-transform group-open:rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </summary>
            <div className="px-6 pb-5 text-sm leading-relaxed text-gray-500">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  )
}
