import { Shield, Clock, Star, CheckCircle, Users, Headphones, Globe, UserCheck, CreditCard } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CodeGrid } from '@/components/CodeGrid'
import { Typewriter } from '@/components/Typewriter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ChatGPT Plus 充值 - 限时特惠 ¥99 | GPT Plus',
  description: 'ChatGPT Plus 充值激活码限时特惠 ¥99，支持支付宝/微信支付，1分钟完成充值，安全可靠。',
  robots: { index: false, follow: false },
}

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
    content: '之前一直找不到靠谱的 ChatGPT Plus 充值渠道，试了好几家都不放心。这个网站用 Stripe 支付，流程很顺畅，1 分钟就搞定了，激活码立马就能用。',
    avatar: 'https://images.unsplash.com/photo-1643990083137-34669413e267?auto=format&fit=crop&w=160&h=160&q=80&crop=faces',
    rating: 5,
  },
  {
    name: '李同学',
    role: '研究生',
    content: '写论文急需 GPT-4，在这里买了激活码，支付宝付款秒到，按教程操作一次就成功了。已经推荐给实验室的同学们。',
    avatar: 'https://images.unsplash.com/photo-1643990084162-7ea1395ab14e?auto=format&fit=crop&w=160&h=160&q=80&crop=faces',
    rating: 5,
  },
  {
    name: '王女士',
    role: '自由职业者',
    content: '第二次来续费了，上个月买的用了整整 30 天没出任何问题。客服响应也很快，值得信赖的平台。',
    avatar: 'https://images.unsplash.com/photo-1704731268191-e744c6d96b26?auto=format&fit=crop&w=160&h=160&q=80&crop=faces',
    rating: 5,
  },
  {
    name: '陈先生',
    role: '软件工程师',
    content: '作为开发者，我对支付安全比较在意。看到用的 Stripe 国际支付通道就放心了，整个购买体验很专业。',
    avatar: 'https://images.unsplash.com/photo-1758600432264-b8d2a0fd7d83?auto=format&fit=crop&w=160&h=160&q=80&crop=faces',
    rating: 5,
  },
  {
    name: '赵女士',
    role: '跨境电商卖家',
    content: '平时要频繁写英文文案和客服回复，这里下单之后几分钟就拿到激活码，整个流程比我预期顺很多，省了不少时间。',
    avatar: 'https://images.unsplash.com/photo-1770363758028-2890f5e9a731?auto=format&fit=crop&w=160&h=160&q=80&crop=faces',
    rating: 5,
  },
  {
    name: '周同学',
    role: '留学申请顾问',
    content: '帮学生润色文书时经常要用到 GPT-4，这个平台支付方便，激活步骤也清楚，第一次买就成功，之后续费也一直很稳定。',
    avatar: 'https://images.unsplash.com/photo-1708533646155-b8738d549385?auto=format&fit=crop&w=160&h=160&q=80&crop=faces',
    rating: 5,
  },
  {
    name: '刘先生',
    role: '自媒体运营',
    content: '最看重的是买完就能看到激活码，不用等人手动发货。页面信息很清楚，售后说明也写得明白，用起来更安心。',
    avatar: 'https://images.unsplash.com/photo-1762191860163-8611f177937d?auto=format&fit=crop&w=160&h=160&q=80&crop=faces',
    rating: 5,
  },
  {
    name: '何女士',
    role: '独立开发者',
    content: '之前担心国内支付会麻烦，结果这里支付宝直接就能付，成功后页面和邮件都留了激活信息，后续查找也方便。',
    avatar: 'https://images.unsplash.com/photo-1627007778238-e555392e1661?auto=format&fit=crop&w=160&h=160&q=80&crop=faces',
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
      url: 'https://www.gpt-plus.ai/lp/99',
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

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }} />
  )
}

export default function LandingPage99() {
  return (
    <div className="min-h-screen flex flex-col bg-grid text-gray-900">
      <JsonLd />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-8 text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5">
              <span className="text-sm font-medium text-violet-700">不封号，封号包售后</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none text-gray-900">
              <span className="block">ChatGPT Plus</span>
              <span className="mt-3 block sm:mt-4">代充值服务</span>
            </h1>

            <p className="mx-auto mt-4 inline-block rounded-lg bg-violet-50 px-6 py-2 text-xl font-semibold text-violet-700 sm:text-2xl h-10 leading-10">
              <Typewriter />
            </p>

            <p className="mx-auto mt-6 max-w-2xl text-base text-gray-600">
              下单后自动发货，1 分钟完成充值。
            </p>

            {/* Social proof badge */}
            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white/80 px-5 py-2.5 text-gray-700 shadow-sm backdrop-blur">
              <div className="flex -space-x-1.5">
                {[
                  'https://images.unsplash.com/photo-1643990083137-34669413e267?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
                  'https://images.unsplash.com/photo-1643990084162-7ea1395ab14e?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
                  'https://images.unsplash.com/photo-1704731268191-e744c6d96b26?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="size-7 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <span className="text-sm">
                已帮助 <span className="font-bold text-violet-600">5.9万+</span> 位用户完成充值
              </span>
            </div>

          </div>
        </section>

        {/* Product Section */}
        <section id="product" className="max-w-6xl mx-auto px-4 pt-4 pb-8">
          <CodeGrid priceOverride={99} />
        </section>

        {/* Trust Stats Bar */}
        <section className="max-w-4xl mx-auto px-4 pb-32">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Users, value: '59,800+', label: '累计客户' },
              { icon: CheckCircle, value: '99.9%', label: '充值成功率' },
              { icon: Clock, value: '1 分钟', label: '平均完成时间' },
              { icon: Shield, value: '30 天', label: '质保期承诺' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                <item.icon className="size-5 text-violet-500 mx-auto mb-2" />
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
                <p className="mt-1 text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="max-w-5xl mx-auto px-4 pb-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-900">
            为什么选择我们服务
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-500">
            我们的 ChatGPT Plus 充值服务已上线数月，为大量用户提供稳定可靠的充值体验
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: CheckCircle,
                title: '充值失败全额退款',
                desc: '充值失败 100% 全额退款，请放心使用我们的服务。',
              },
              {
                icon: CreditCard,
                title: '无需海外信用卡',
                desc: '支持多种支付方式，无需海外信用卡，让每个人都能轻松充值 ChatGPT Plus。',
              },
              {
                icon: Shield,
                title: '安全可靠保障',
                desc: '正规充值通道，无需提供账密，安全可靠，保护您的账户信息安全。',
              },
              {
                icon: UserCheck,
                title: '支持企业服务',
                desc: '支持批量采购、对公支付，详情咨询客服。',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-violet-200 hover:bg-white hover:shadow-lg hover:shadow-violet-500/5">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-white border border-gray-100">
                  <item.icon className="size-5 text-violet-600" />
                </div>
                <h3 className="mb-2 text-base font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* User Testimonials */}
        <section className="max-w-5xl mx-auto px-4 pb-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-900">
            用户真实评价
          </h2>
          <p className="mb-10 text-center text-gray-500">累计 59,809 位用户给出五星好评</p>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-auto flex items-center gap-3 pt-2">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="size-11 rounded-full border border-violet-100 object-cover shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-900">
            如何充值 ChatGPT Plus
          </h2>
          <p className="mb-10 text-center text-gray-500">简单 3 步，轻松开通 ChatGPT Plus 会员</p>
          <div className="space-y-6">
            {[
              { step: '1', title: '选购激活码', desc: '在上方列表中选择一个 ChatGPT Plus 激活码，点击「立即购买」进入支付页面。' },
              { step: '2', title: '完成支付', desc: '选择支付宝、微信支付或信用卡完成付款，支付成功后页面将自动展示完整激活码。' },
              { step: '3', title: '激活使用', desc: '复制激活码，前往我们提供的卡密激活网站，输入激活码即可开通 ChatGPT Plus 会员。' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                  {item.step}
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Service Notice */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-900">
            充值流程与注意事项
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
                cta: { url: 'https://chong.plus', text: '前往充值网站' },
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-700">
                  {item.step}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                  {item.link && (
                    <a href={item.link.url} target="_blank" rel="noopener noreferrer" className="inline-block break-all text-sm text-violet-600 underline hover:text-violet-500">
                      {item.link.text}
                    </a>
                  )}
                  {item.extra && <p className="text-sm text-gray-500">{item.extra}</p>}
                  {item.cta && (
                    <a href={item.cta.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-500">
                      {item.cta.text}
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="space-y-2 rounded-2xl border border-violet-200 bg-violet-50/80 p-5">
              <h3 className="text-sm font-semibold text-violet-700">售后保障</h3>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li className="flex items-start gap-2"><span className="mt-0.5 text-violet-600">&#10003;</span>质保 30 天不掉订阅</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-violet-600">&#10003;</span>掉订阅按天赔付（从充值成功算起）</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-violet-600">&#10003;</span>24 小时全自动自助充值</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-violet-600">&#10003;</span>充值失败可多次重试</li>
              </ul>
            </div>
            <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
              <h3 className="text-sm font-semibold text-amber-700">充值前必读</h3>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-600">!</span>账号必须是免费版（非会员）才能充值</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-600">!</span>已有会员未到期的账号无法充值</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-600">!</span>请确保你使用过 ChatGPT 官网版</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-600">!</span>不了解此商品的用户请勿购买</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-rose-200 bg-rose-50/80 p-5">
            <h3 className="text-sm font-semibold text-rose-700">风险提示</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              不封号，封号包售后。本站保证充值会员有效期至少满 30 天，如遇封号问题请联系客服处理。
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            遇到问题？联系客服微信：<span className="text-gray-900">fanxx2029</span>
          </p>
        </section>

        {/* Trust Badges */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-gray-500">
                <Shield className="size-5 text-violet-500" />
                <span className="text-sm">SSL 加密传输</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#635BFF"/>
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .9-.779 1.424-2.133 1.424-1.89 0-4.882-.921-6.736-2.196l-.907 5.534C5.476 22.688 8.44 24 12.336 24c2.588 0 4.737-.638 6.281-1.846 1.649-1.293 2.477-3.176 2.477-5.592 0-4.145-2.503-5.81-7.118-7.412z" fill="white" transform="scale(0.5) translate(12, 12)"/>
                </svg>
                <span className="text-sm">Stripe 安全支付</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Headphones className="size-5 text-violet-500" />
                <span className="text-sm">专属客服支持</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle className="size-5 text-violet-500" />
                <span className="text-sm">30 天质保承诺</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-900">
            常见问题
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="group rounded-2xl border border-gray-100 bg-white shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-base font-medium text-gray-800 transition-colors hover:text-violet-600 [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <svg className="size-5 shrink-0 text-gray-400 transition-transform group-open:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed text-gray-500">{item.a}</div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
