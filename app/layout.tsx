import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { BookmarkPrompt } from '@/components/BookmarkPrompt'
import { CustomerService } from '@/components/CustomerService'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ChatGPT Plus 开通升级订阅｜支持微信支付宝｜Plus 购买｜代充值网站系统',
    template: '%s | ChatGPT Plus 充值',
  },
  description:
    '提供 ChatGPT Plus 开通、升级、订阅、代充值服务，20 美元套餐开通仅需 128 元，支持微信、支付宝。包含购买Plus服务、GPT充值网站使用方法。',
  keywords: [
    'chatgpt plus 充值',
    'chatgpt plus 开通',
    'chatgpt plus 升级',
    'chatgpt plus 订阅',
    'chatgpt plus 购买',
    'chatgpt plus 代开通',
    'chatgpt plus 代订阅',
    'gpt plus 充值',
  ],
  metadataBase: new URL('https://www.gpt-plus.ai'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: ['/icon.svg'],
    apple: [{ url: '/icon.svg' }],
  },
  openGraph: {
    title: 'ChatGPT Plus 开通升级订阅｜支持微信支付宝｜Plus 购买｜代充值网站系统',
    description: '提供 ChatGPT Plus 开通、升级、订阅、代充值服务，20 美元套餐开通仅需 128 元，支持微信、支付宝。包含购买Plus服务、GPT充值网站使用方法。',
    url: 'https://www.gpt-plus.ai',
    siteName: 'ChatGPT Plus 充值',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChatGPT Plus 开通升级订阅｜支持微信支付宝｜Plus 购买｜代充值网站系统',
    description: '提供 ChatGPT Plus 开通、升级、订阅、代充值服务，20 美元套餐开通仅需 128 元，支持微信、支付宝。包含购买Plus服务、GPT充值网站使用方法。',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WW5E5CHYQT" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-WW5E5CHYQT');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'GPT Plus',
              url: 'https://www.gpt-plus.ai',
              logo: 'https://www.gpt-plus.ai/icon.svg',
              description: '专业 ChatGPT Plus 代充值服务，支持支付宝、微信支付。',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                availableLanguage: 'Chinese',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'GPT Plus - ChatGPT Plus 充值服务',
              url: 'https://www.gpt-plus.ai',
              inLanguage: 'zh-CN',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.gpt-plus.ai/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
        <Toaster />
        <BookmarkPrompt />
        <CustomerService />
      </body>
    </html>
  )
}
