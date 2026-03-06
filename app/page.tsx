import { Zap } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CodeGrid } from '@/components/CodeGrid'

const faqItems = [
  {
    q: 'ChatGPT Plus 充值激活码是什么？',
    a: 'ChatGPT Plus 充值激活码是一组用于开通 ChatGPT Plus 会员的卡密。购买后，您将获得一个激活码，前往指定的卡密激活网站输入即可完成 ChatGPT Plus 的开通。',
  },
  {
    q: '购买后如何使用激活码？',
    a: '支付成功后，页面会展示完整的激活码。请复制该激活码，然后前往我们提供的卡密激活网站，输入激活码即可完成 ChatGPT Plus 的开通。',
  },
  {
    q: '支持哪些支付方式？',
    a: '我们支持支付宝、微信支付和国际信用卡（Visa、Mastercard）等多种支付方式，确保国内用户也能轻松完成 ChatGPT Plus 充值。',
  },
  {
    q: 'ChatGPT Plus 开通后有效期多久？',
    a: 'ChatGPT Plus 激活码开通后为一个月的会员期。到期后如需继续使用，可以再次购买激活码进行续费充值。',
  },
  {
    q: '购买激活码安全吗？',
    a: '完全安全。我们使用 Stripe 作为支付网关，所有交易均经过加密处理。购买过程无需注册账号，全程匿名，保护您的隐私安全。',
  },
  {
    q: '如果激活码无法使用怎么办？',
    a: '如果您购买的激活码无法正常使用，请第一时间联系我们的客服邮箱，我们将在 24 小时内为您处理退款或补发新的激活码。',
  },
]

function JsonLd() {
  const productData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'ChatGPT Plus 充值激活码',
    description: 'ChatGPT Plus 充值开通服务，付款后即时获取激活码，安全快捷。',
    brand: { '@type': 'Brand', name: 'GPT Plus' },
    offers: {
      '@type': 'Offer',
      price: '99.00',
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock',
      url: 'https://www.gpt-plus.ai',
      seller: { '@type': 'Organization', name: 'GPT Plus' },
    },
  }

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />
    </>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-grid">
      <JsonLd />
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[100px]" />

          <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 mb-6">
              <Zap className="size-3.5 text-emerald-400" />
              <span className="text-sm text-emerald-300">ChatGPT Plus 官方充值</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                ChatGPT Plus 充值开通
              </span>
            </h1>

            <p className="mt-4 text-lg text-zinc-400 max-w-xl mx-auto">
              安全快捷的 ChatGPT Plus 充值服务，付款后即时获取激活码，轻松开通 GPT-4 会员
            </p>
            <p className="mt-3 text-sm text-zinc-500 max-w-md mx-auto">
              支持支付宝 / 微信支付 / 信用卡 &middot; 即买即用
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-20">
          <CodeGrid />
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
              如何充值 ChatGPT Plus
            </span>
          </h2>
          <div className="space-y-6">
            {[
              { step: '1', title: '选购激活码', desc: '在上方列表中选择一个 ChatGPT Plus 激活码，点击「立即购买」进入支付页面。' },
              { step: '2', title: '完成支付', desc: '选择支付宝、微信支付或信用卡完成付款，支付成功后页面将自动展示完整激活码。' },
              { step: '3', title: '激活使用', desc: '复制激活码，前往我们提供的卡密激活网站，输入激活码即可开通 ChatGPT Plus 会员。' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex-shrink-0 size-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
              常见问题
            </span>
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="group rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-base font-medium text-zinc-100 hover:text-emerald-300 transition-colors [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <svg className="size-5 shrink-0 text-zinc-500 transition-transform group-open:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed text-zinc-400">{item.a}</div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
