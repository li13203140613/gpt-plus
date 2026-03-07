import Link from 'next/link'

const ALL_PAGES = [
  { href: '/', label: 'ChatGPT Plus 充值' },
  { href: '/chatgpt-plus-kaitong', label: 'ChatGPT Plus 开通' },
  { href: '/chatgpt-plus-shengji', label: 'ChatGPT Plus 升级' },
  { href: '/chatgpt-plus-dingyue', label: 'ChatGPT Plus 订阅' },
  { href: '/chatgpt-plus-goumai', label: 'ChatGPT Plus 购买' },
  { href: '/chatgpt-plus-kaitong-fuwu', label: 'ChatGPT Plus 开通服务' },
  { href: '/chatgpt-plus-dingyue-fuwu', label: 'ChatGPT Plus 订阅服务' },
  { href: '/chatgpt-plus-zhifu-xiezhu', label: 'ChatGPT Plus 支付协助' },
  { href: '/chatgpt-plus-dai-kaitong', label: 'ChatGPT Plus 代开通' },
  { href: '/chatgpt-plus-dai-dingyue', label: 'ChatGPT Plus 代订阅' },
  { href: '/chatgpt-plus-chongzhi', label: 'ChatGPT Plus 充值指南' },
]

interface SeoInternalLinksProps {
  currentPath: string
}

export function SeoInternalLinks({ currentPath }: SeoInternalLinksProps) {
  const links = ALL_PAGES.filter((p) => p.href !== currentPath)

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">相关服务</h2>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-gray-500 hover:text-violet-600 transition-colors border border-gray-200 rounded-full px-3 py-1 hover:border-violet-200"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
