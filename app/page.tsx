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
            <div className="mt-5 flex items-center justify-center gap-3">
              {/* 微信支付 */}
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-800/60 border border-zinc-700/50 px-3 py-1.5">
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66l-.7 2.1 2.45-1.23c.78.22 1.6.34 2.47.34.33 0 .66-.02.98-.06A5.93 5.93 0 0 1 9.5 14c0-3.31 3.13-6 7-6 .17 0 .33.01.5.02C15.93 5.69 13.03 4 9.5 4z" fill="#07C160"/>
                  <path d="M22 14c0-2.76-2.69-5-6-5s-6 2.24-6 5 2.69 5 6 5c.7 0 1.37-.1 2-.29l1.8.9-.52-1.54C20.88 17.06 22 15.63 22 14z" fill="#07C160"/>
                </svg>
                <span className="text-xs text-zinc-300">微信支付</span>
              </div>
              {/* 支付宝 */}
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-800/60 border border-zinc-700/50 px-3 py-1.5">
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#1677FF"/>
                  <path d="M18.5 15.2c-1.5-.6-3.2-1.3-4.2-1.8.5-.9.9-1.9 1.1-3h-2.8v-1h3.2V8.6h-3.2V7h-1.4v1.6H8v.8h3.2v1H8.4v.8h5.4c-.2.7-.5 1.4-.9 2-1.2-.5-2.5-.8-3.5-.8-1.5 0-2.5.7-2.5 1.8 0 1.2 1.1 2 3 2 1.5 0 2.8-.6 3.8-1.5 1.3.7 3.3 1.5 4.8 2v-1.5z" fill="white"/>
                  <circle cx="9.8" cy="16" r="1.2" fill="white"/>
                </svg>
                <span className="text-xs text-zinc-300">支付宝</span>
              </div>
              {/* 银行卡 */}
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-800/60 border border-zinc-700/50 px-3 py-1.5">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <span className="text-xs text-zinc-300">银行卡</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-zinc-500">即买即用 · 安全支付 · 无需注册</p>
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

        {/* Service Notice - restructured */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
              充值流程与注意事项
            </span>
          </h2>

          {/* Step-by-step recharge flow */}
          <div className="space-y-4 mb-8">
            {[
              {
                step: '1',
                title: '在本站购买激活码',
                desc: '选择上方激活码，通过支付宝 / 微信 / 银行卡完成付款，支付成功后复制完整激活码。',
              },
              {
                step: '2',
                title: '获取 ChatGPT 登录凭证',
                desc: '在已登录 ChatGPT 账号的浏览器中，新开一个标签页，访问以下地址：',
                link: { url: 'https://chatgpt.com/api/auth/session', text: 'chatgpt.com/api/auth/session' },
                extra: '页面会显示一段代码，全选并复制。',
              },
              {
                step: '3',
                title: '前往充值网站完成充值',
                desc: '打开充值网站，粘贴刚才复制的代码，再输入激活码，提交即可自动完成充值。',
                cta: { url: 'https://shop.gptai.vip/', text: '前往充值网站' },
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <div className="flex-shrink-0 size-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                  {item.step}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-zinc-100">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                  {item.link && (
                    <a href={item.link.url} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-emerald-400 hover:text-emerald-300 underline break-all">
                      {item.link.text}
                    </a>
                  )}
                  {item.extra && <p className="text-sm text-zinc-400">{item.extra}</p>}
                  {item.cta && (
                    <a href={item.cta.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-1.5 transition-colors">
                      {item.cta.text}
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Notice cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-2">
              <h3 className="text-sm font-semibold text-emerald-400">售后保障</h3>
              <ul className="text-sm text-zinc-300 space-y-1.5">
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#10003;</span>质保 30 天不掉订阅</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#10003;</span>掉订阅按天赔付（从充值成功算起）</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#10003;</span>24 小时全自动自助充值</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">&#10003;</span>充值失败可多次重试</li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
              <h3 className="text-sm font-semibold text-amber-400">充值前必读</h3>
              <ul className="text-sm text-zinc-300 space-y-1.5">
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">!</span>账号必须是免费版（非会员）才能充值</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">!</span>已有会员未到期的账号无法充值</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">!</span>请确保你使用过 ChatGPT 官网版</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">!</span>不了解此商品的用户请勿购买</li>
              </ul>
            </div>
          </div>

          {/* Risk disclaimer */}
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 space-y-2">
            <h3 className="text-sm font-semibold text-red-400">风险提示</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              由于 OpenAI 政策原因，国内用户的 ChatGPT 账号存在被封号的可能，此类情况全网均有发生，属于不可控因素，不在售后范围内。本站仅保证在官网不封号的前提下，充值会员有效期至少满 30 天。
            </p>
          </div>

          {/* Contact */}
          <p className="text-center text-sm text-zinc-500 mt-6">
            遇到问题？联系客服 QQ：<span className="text-zinc-300">2415997472</span>
          </p>
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
