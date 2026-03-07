import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

interface SeoPageLayoutProps {
  children: React.ReactNode
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  breadcrumbTitle?: string
  breadcrumbPath?: string
}

export function SeoPageLayout({ children, jsonLd, breadcrumbTitle, breadcrumbPath }: SeoPageLayoutProps) {
  const jsonLdItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

  const breadcrumbData = breadcrumbTitle && breadcrumbPath ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: 'https://www.gpt-plus.ai',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: breadcrumbTitle,
        item: `https://www.gpt-plus.ai${breadcrumbPath}`,
      },
    ],
  } : null

  return (
    <div className="min-h-screen flex flex-col bg-grid">
      {jsonLdItems.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      {breadcrumbData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />
      )}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
