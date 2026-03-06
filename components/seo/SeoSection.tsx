interface SeoSectionProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function SeoSection({ title, children, className = '' }: SeoSectionProps) {
  return (
    <section className={`max-w-4xl mx-auto px-4 py-12 ${className}`}>
      {title && (
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">
          <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
      )}
      {children}
    </section>
  )
}
