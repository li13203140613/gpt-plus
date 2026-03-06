import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ChatGPT Plus 充值 - GPT Plus 开通订阅服务',
    template: '%s | ChatGPT Plus 充值',
  },
  description:
    'ChatGPT Plus 充值开通服务，支持支付宝、微信支付、信用卡，付款后即时获取 ChatGPT Plus 激活码。安全快捷的 GPT Plus 代开通方案。',
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
  openGraph: {
    title: 'ChatGPT Plus 充值 - GPT Plus 开通订阅服务',
    description: 'ChatGPT Plus 充值开通服务，付款后即时获取激活码。安全快捷的 GPT Plus 代开通方案。',
    url: 'https://www.gpt-plus.ai',
    siteName: 'ChatGPT Plus 充值',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChatGPT Plus 充值 - GPT Plus 开通订阅服务',
    description: 'ChatGPT Plus 充值开通服务，付款后即时获取激活码。',
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
      <body className="min-h-screen bg-[#0a0a0f] antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
