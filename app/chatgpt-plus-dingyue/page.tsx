import type { Metadata } from 'next'
import Link from 'next/link'
import { SeoPageLayout } from '@/components/seo/SeoPageLayout'
import { SeoHero } from '@/components/seo/SeoHero'
import { SeoSection } from '@/components/seo/SeoSection'
import { SeoFaq } from '@/components/seo/SeoFaq'
import { SeoCta } from '@/components/seo/SeoCta'
import { SeoInternalLinks } from '@/components/seo/SeoInternalLinks'

export const metadata: Metadata = {
  title: { absolute: 'ChatGPT Plus 订阅 - 订阅 GPT Plus 会员服务 | GPT Plus 充值' },
  description: '全面了解 ChatGPT Plus 订阅流程、定价方案与管理方法。支持支付宝微信完成 ChatGPT Plus 订阅，享受 GPT-4o 全套高级功能。',
  keywords: [
    'chatgpt plus 订阅',
    'chatgpt plus 订阅方法',
    '订阅 chatgpt plus',
    'gpt plus 订阅',
    'chatgpt plus 订阅价格',
    'chatgpt plus 订阅管理',
  ],
  alternates: { canonical: '/chatgpt-plus-dingyue' },
}

const faqItems = [
  {
    q: 'ChatGPT Plus 订阅是按月自动续费吗？',
    a: 'ChatGPT Plus 订阅默认为按月自动续费模式，每月从绑定的支付方式扣除费用。通过我们的代订阅服务，您可以选择不自动续费的一次性订阅，避免不必要的持续扣费，订阅到期前我们会提前提醒您续订。',
  },
  {
    q: 'ChatGPT Plus 订阅价格是多少？',
    a: 'ChatGPT Plus 官方订阅价格为每月 20 美元（约合人民币 145 元）。我们提供月付、季付和半年付等多种套餐，多月套餐享有一定优惠，具体价格以网站实时展示为准。',
  },
  {
    q: '如何管理和取消 ChatGPT Plus 订阅？',
    a: '登录 ChatGPT 后，点击左下角账号头像，进入「设置」，在「订阅」选项中可以查看订阅状态、更改计划或取消订阅。取消后，当前付费周期结束前仍可使用 Plus 功能，到期后自动降级为免费版。',
  },
  {
    q: '订阅 ChatGPT Plus 后可以多设备同时使用吗？',
    a: '可以。ChatGPT Plus 订阅绑定在账号上，您可以在电脑浏览器、ChatGPT 手机 App（iOS/Android）等多个设备上登录同一账号，随时随地享受 Plus 会员权益，无设备数量限制。',
  },
  {
    q: 'ChatGPT Plus 订阅和 ChatGPT Team 订阅有什么区别？',
    a: 'ChatGPT Plus 是面向个人用户的订阅计划，每月 20 美元。ChatGPT Team 是企业团队版，每用户每月 25 至 30 美元，提供更高的使用配额、团队协作功能和更强的数据隐私保护。个人日常使用选择 Plus 订阅即可满足需求。',
  },
  {
    q: '订阅 ChatGPT Plus 后是否有每日使用限制？',
    a: 'ChatGPT Plus 订阅没有每日总使用次数限制。GPT-4o 高级消息每隔几小时有一定配额，达到上限后系统会自动切换到 GPT-4o mini，您的对话不会中断。通常情况下，一般用户的日常使用量不会触及配额上限。',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function ChatgptPlusDingyuePage() {
  return (
    <SeoPageLayout jsonLd={jsonLd}>
      <SeoHero
        badge="订阅服务"
        title="ChatGPT Plus 订阅"
        subtitle="灵活选择 ChatGPT Plus 订阅方案，国内支付宝微信直接完成，月付季付均可，专业团队保障订阅全程顺畅无阻。"
      />

      <SeoSection title="ChatGPT Plus 订阅全面解析">
        <div className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            <strong>ChatGPT Plus 订阅</strong>是 OpenAI 为个人用户提供的付费会员计划，于 2023 年 2 月正式推出。通过<strong>订阅 ChatGPT Plus</strong>，用户可以获得对 OpenAI 最新旗舰模型 GPT-4o 的完整访问权限，以及包括图像生成、数据分析、联网搜索在内的一系列高级功能。
          </p>
          <p>
            从本质上说，<strong>ChatGPT Plus 订阅</strong>是一种软件即服务（SaaS）模式的付费订阅，类似于 Microsoft 365 或 Adobe Creative Cloud。您的订阅费用支持 OpenAI 持续研发更先进的 AI 模型，也意味着您将随着 OpenAI 的技术迭代不断获得功能升级——无需额外付费，新功能会自动向 Plus 会员开放。
          </p>
          <p>
            对于国内用户而言，直接向 OpenAI 官网 <strong>订阅 ChatGPT Plus</strong> 面临支付方式不兼容的现实障碍。我们的代订阅服务通过合规渠道帮助您完成这一过程，让您用最熟悉的支付工具享受全球顶尖的 AI 服务。
          </p>
        </div>
      </SeoSection>

      <SeoSection title="ChatGPT Plus 订阅套餐与定价">
        <div className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            我们提供多种 <strong>ChatGPT Plus 订阅</strong>套餐，满足不同使用周期和预算需求。所有套餐均通过官方渠道完成，订阅有效期与 OpenAI 账号直接绑定，稳定可靠。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              {
                name: '月度订阅',
                price: '月付价格',
                period: '1 个月',
                features: [
                  '完整 GPT-4o 访问权限',
                  'DALL·E 3 图像生成',
                  '高级数据分析',
                  '联网实时搜索',
                  '自定义 GPT 完整访问',
                ],
                highlight: false,
              },
              {
                name: '季度订阅',
                price: '季付价格',
                period: '3 个月',
                features: [
                  '包含月度全部功能',
                  '享有套餐优惠',
                  '减少重复操作',
                  '稳定使用保障',
                  '优先客服支持',
                ],
                highlight: true,
              },
              {
                name: '半年订阅',
                price: '半年付价格',
                period: '6 个月',
                features: [
                  '包含月度全部功能',
                  '最高套餐折扣',
                  '长期稳定保障',
                  '专属客服通道',
                  '到期前主动提醒',
                ],
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 border ${
                  plan.highlight
                    ? 'bg-emerald-900/20 border-emerald-600/50'
                    : 'bg-zinc-800/60 border-zinc-700'
                }`}
              >
                {plan.highlight && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-900/40 px-2 py-1 rounded-full mb-3 inline-block">
                    最受欢迎
                  </span>
                )}
                <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? 'text-emerald-400' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <p className="text-zinc-400 text-sm mb-4">有效期：{plan.period}</p>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className="text-emerald-400 mt-0.5">-</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-zinc-400 text-sm mt-4">
            具体价格请访问首页查看最新报价，所有套餐均支持支付宝、微信支付，人民币结算，无隐藏费用。
          </p>
        </div>
      </SeoSection>

      <SeoSection title="ChatGPT Plus 订阅包含的核心功能">
        <div className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            <strong>ChatGPT Plus 订阅</strong>为用户提供了一个全面的 AI 能力平台，以下是订阅后可以使用的核心功能详细介绍：
          </p>
          <div className="space-y-4">
            {[
              {
                title: 'GPT-4o 旗舰模型',
                content:
                  'GPT-4o 是 OpenAI 截至 2024 年发布的最强多模态大语言模型，在 MMLU、HumanEval 等主要学术基准测试中均处于领先地位。相比免费版的 GPT-4o mini，GPT-4o 在复杂推理、代码生成、学术写作和创意内容等方面有着更高的上限，是 Plus 订阅最核心的权益。',
              },
              {
                title: 'DALL·E 3 图像生成',
                content:
                  '订阅 ChatGPT Plus 后，您可以直接在对话中向 ChatGPT 描述想要的图像，AI 会自动调用 DALL·E 3 生成高分辨率图片。支持写实摄影风格、数字艺术、插画、油画等多种风格，可指定图像尺寸，满足不同用途需求。',
              },
              {
                title: '高级数据分析（Code Interpreter）',
                content:
                  '这是 Plus 订阅中对专业用户价值最高的功能之一。您可以上传 Excel、CSV、PDF、图片等多种格式的文件，让 ChatGPT 运行 Python 代码进行数据处理、统计分析和可视化，无需自己编写代码即可完成复杂的数据分析任务。',
              },
              {
                title: 'GPT 商店完整访问',
                content:
                  'OpenAI 的 GPT 商店汇聚了数以万计的第三方自定义 GPT，涵盖编程助手、学术写作、法律咨询、设计工具等各个垂直领域。Plus 订阅用户可以完整访问 GPT 商店，使用最受欢迎的专业 GPT，大幅扩展 ChatGPT 的应用场景。',
              },
            ].map((item) => (
              <div key={item.title} className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </SeoSection>

      <SeoSection title="订阅后的账号管理与续订说明">
        <div className="space-y-4 text-zinc-300 leading-relaxed">
          <p>
            顺利完成 <strong>ChatGPT Plus 订阅</strong>后，了解如何管理您的订阅状态同样重要。以下几点可以帮助您更好地管理 Plus 会员权益：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: '查看订阅状态',
                desc: '登录 ChatGPT，点击左下角头像进入「设置与帮助」，选择「我的方案」即可查看当前订阅状态、到期日期和已用功能统计。',
              },
              {
                title: '到期续订',
                desc: '我们会在您的 ChatGPT Plus 订阅到期前 3 至 5 天主动联系您，提醒续订事宜，您无需担心忘记续费导致服务中断。',
              },
              {
                title: '取消订阅',
                desc: '如果您不需要继续使用，可以随时在账号设置中取消自动续订。当前付费周期内的 Plus 权益不受影响，到期后自动恢复免费版。',
              },
              {
                title: '多设备使用',
                desc: 'Plus 订阅账号可以在任意数量的设备上登录使用，包括浏览器版和手机 App，您的对话记录在各设备间自动同步。',
              },
            ].map((item) => (
              <div key={item.title} className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-5">
                <h3 className="text-emerald-400 font-semibold mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4">
            如果您想了解如何<Link href="/chatgpt-plus-kaitong" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 mx-1">快速开通 ChatGPT Plus</Link>，或考虑<Link href="/chatgpt-plus-goumai" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 mx-1">购买 ChatGPT Plus 激活码</Link>，欢迎查阅相关页面获取详细信息。
          </p>
        </div>
      </SeoSection>

      <SeoFaq title="ChatGPT Plus 订阅 - 常见问题" items={faqItems} />

      <SeoCta
        title="立即订阅 ChatGPT Plus"
        description="选择适合您的 ChatGPT Plus 订阅套餐，支付宝微信快速完成，专业团队全程保障，立享 GPT-4o 旗舰体验。"
        buttonText="立即订阅"
        buttonHref="/"
      />

      <SeoInternalLinks currentPath="/chatgpt-plus-dingyue" />
    </SeoPageLayout>
  )
}
