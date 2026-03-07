import { Zap, Shield, Clock, Star, CheckCircle, Users, Headphones, Globe } from 'lucide-react'
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

const testimonials = [
  {
    name: '张先生',
    role: '产品经理',
    content: '之前一直找不到靠谱的 ChatGPT Plus 充值渠道，试了好几家都不放心。这个网站用 Stripe 支付，流程很顺畅，3 分钟就搞定了，激活码立马就能用。',
    rating: 5,
  },
  {
    name: '李同学',
    role: '研究生',
    content: '写论文急需 GPT-4，在这里买了激活码，支付宝付款秒到，按教程操作一次就成功了。已经推荐给实验室的同学们。',
    rating: 5,
  },
  {
    name: '王女士',
    role: '自由职业者',
    content: '第二次来续费了，上个月买的用了整整 30 天没出任何问题。客服响应也很快，值得信赖的平台。',
    rating: 5,
  },
  {
    name: '陈先生',
    role: '软件工程师',
    content: '作为开发者，我对支付安全比较在意。看到用的 Stripe 国际支付通道就放心了，整个购买体验很专业。',
    rating: 5,
  },
  {
    name: '赵女士',
    role: '跨境电商卖家',
    content: '平时要频繁写英文文案和客服回复，这里下单之后几分钟就拿到激活码，整个流程比我预期顺很多，省了不少时间。',
    rating: 5,
  },
  {
    name: '周同学',
    role: '留学申请顾问',
    content: '帮学生润色文书时经常要用到 GPT-4，这个平台支付方便，激活步骤也清楚，第一次买就成功，之后续费也一直很稳定。',
    rating: 5,
  },
  {
    name: '刘先生',
    role: '自媒体运营',
    content: '最看重的是买完就能看到激活码，不用等人手动发货。页面信息很清楚，售后说明也写得明白，用起来更安心。',
    rating: 5,
  },
  {
    name: '何女士',
    role: '独立开发者',
    content: '之前担心国内支付会麻烦，结果这里支付宝直接就能付，成功后页面和邮件都留了激活信息，后续查找也方便。',
    rating: 5,
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
      url: 'https://gpt-plus.ai',
      seller: { '@type': 'Organization', name: 'GPT Plus' },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '59809',
      ratingCount: '59809',
      bestRating: '5',
    },
    review: testimonials.map((item) => ({
      '@type': 'Review',
      reviewBody: item.content,
      author: {
        '@type': 'Person',
        name: item.name,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(item.rating),
        bestRating: '5',
      },
    })),
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
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[100px]" />

          <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-8 text-center">
            {/* OpenAI Partner Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 mb-6">
              <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="white"/>
              </svg>
              <span className="text-sm font-medium text-emerald-300">ChatGPT Plus 官方激活码 · 专业充值服务商</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                ChatGPT Plus 充值开通
              </span>
            </h1>

            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              国内用户首选的 ChatGPT Plus 充值平台，Stripe 安全支付，付款后即时获取激活码，3 分钟轻松开通 GPT-4
            </p>

            {/* Payment methods */}
            <div className="mt-5 flex items-center justify-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-800/60 border border-zinc-700/50 px-3 py-1.5">
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66l-.7 2.1 2.45-1.23c.78.22 1.6.34 2.47.34.33 0 .66-.02.98-.06A5.93 5.93 0 0 1 9.5 14c0-3.31 3.13-6 7-6 .17 0 .33.01.5.02C15.93 5.69 13.03 4 9.5 4z" fill="#07C160"/>
                  <path d="M22 14c0-2.76-2.69-5-6-5s-6 2.24-6 5 2.69 5 6 5c.7 0 1.37-.1 2-.29l1.8.9-.52-1.54C20.88 17.06 22 15.63 22 14z" fill="#07C160"/>
                </svg>
                <span className="text-xs text-zinc-300">微信支付</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-800/60 border border-zinc-700/50 px-3 py-1.5">
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#1677FF"/>
                  <path d="M18.5 15.2c-1.5-.6-3.2-1.3-4.2-1.8.5-.9.9-1.9 1.1-3h-2.8v-1h3.2V8.6h-3.2V7h-1.4v1.6H8v.8h3.2v1H8.4v.8h5.4c-.2.7-.5 1.4-.9 2-1.2-.5-2.5-.8-3.5-.8-1.5 0-2.5.7-2.5 1.8 0 1.2 1.1 2 3 2 1.5 0 2.8-.6 3.8-1.5 1.3.7 3.3 1.5 4.8 2v-1.5z" fill="white"/>
                  <circle cx="9.8" cy="16" r="1.2" fill="white"/>
                </svg>
                <span className="text-xs text-zinc-300">支付宝</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-zinc-800/60 border border-zinc-700/50 px-3 py-1.5">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <span className="text-xs text-zinc-300">银行卡</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-zinc-500">即买即用 · Stripe 安全支付 · 无需注册</p>
          </div>
        </section>

        {/* Trust Stats Bar */}
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Users, value: '59,800+', label: '累计客户' },
              { icon: CheckCircle, value: '99.8%', label: '充值成功率' },
              { icon: Clock, value: '3 分钟', label: '平均完成时间' },
              { icon: Shield, value: '30 天', label: '质保期承诺' },
            ].map((item) => (
              <div key={item.label} className="text-center rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4">
                <item.icon className="size-5 text-emerald-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{item.value}</p>
                <p className="text-xs text-zinc-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product Section */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <CodeGrid />
        </section>

        {/* Product Features */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
              为什么选择我们
            </span>
          </h2>
          <p className="text-center text-zinc-500 mb-10 max-w-xl mx-auto">
            专注 ChatGPT Plus 充值服务，为国内用户提供安全、快捷、可靠的开通方案
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                title: 'Stripe 国际支付',
                desc: '采用全球领先的 Stripe 支付网关，支持支付宝、微信、银行卡，交易数据全程加密，资金安全有保障。',
              },
              {
                icon: Zap,
                title: '即买即用',
                desc: '支付成功后页面立即展示激活码，无需等待人工发货，全程自动化处理，最快 3 分钟完成充值。',
              },
              {
                icon: Globe,
                title: 'GPT-4 完整体验',
                desc: '开通 ChatGPT Plus 后即可使用 GPT-4、GPT-4o、DALL-E 3 等全部高级功能，无任何限制。',
              },
              {
                icon: Headphones,
                title: '专业售后团队',
                desc: '提供 QQ 在线客服支持，充值失败全额退款，遇到问题 24 小时内响应处理。',
              },
              {
                icon: CheckCircle,
                title: '30 天质保',
                desc: '每笔订单享受 30 天质保服务，期间如出现非账号原因的掉订阅问题，按天赔付。',
              },
              {
                icon: Star,
                title: '口碑认证',
                desc: '累计服务超过 59,800 位客户，已沉淀 59,809 条五星好评，99.8% 充值成功率，长期复购用户占比持续增长。',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6 hover:border-emerald-500/20 transition-colors">
                <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <item.icon className="size-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-zinc-100 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
              如何充值 ChatGPT Plus
            </span>
          </h2>
          <p className="text-center text-zinc-500 mb-10">简单 3 步，轻松开通 ChatGPT Plus 会员</p>
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

        {/* Service Notice */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
              充值流程与注意事项
            </span>
          </h2>

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

          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 space-y-2">
            <h3 className="text-sm font-semibold text-red-400">风险提示</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              由于 OpenAI 政策原因，国内用户的 ChatGPT 账号存在被封号的可能，此类情况全网均有发生，属于不可控因素，不在售后范围内。本站仅保证在官网不封号的前提下，充值会员有效期至少满 30 天。
            </p>
          </div>

          <p className="text-center text-sm text-zinc-500 mt-6">
            遇到问题？联系客服 QQ：<span className="text-zinc-300">2415997472</span>
          </p>
        </section>

        {/* User Testimonials */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
              用户真实评价
            </span>
          </h2>
          <p className="text-center text-zinc-500 mb-10">累计 59,809 位用户给出五星好评</p>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-8 text-center">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-zinc-400">
                <Shield className="size-5 text-emerald-400" />
                <span className="text-sm">SSL 加密传输</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#635BFF"/>
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .9-.779 1.424-2.133 1.424-1.89 0-4.882-.921-6.736-2.196l-.907 5.534C5.476 22.688 8.44 24 12.336 24c2.588 0 4.737-.638 6.281-1.846 1.649-1.293 2.477-3.176 2.477-5.592 0-4.145-2.503-5.81-7.118-7.412z" fill="white" transform="scale(0.5) translate(12, 12)"/>
                </svg>
                <span className="text-sm">Stripe 安全支付</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Headphones className="size-5 text-emerald-400" />
                <span className="text-sm">专属客服支持</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <CheckCircle className="size-5 text-emerald-400" />
                <span className="text-sm">30 天质保承诺</span>
              </div>
            </div>
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
