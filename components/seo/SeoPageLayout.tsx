import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

interface SeoPageLayoutProps {
  children: React.ReactNode
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export function SeoPageLayout({ children, jsonLd }: SeoPageLayoutProps) {
  const jsonLdItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

  return (
    <div className="min-h-screen flex flex-col bg-grid">
      {jsonLdItems.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
