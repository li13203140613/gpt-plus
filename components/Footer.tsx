import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/chatgpt-plus-kaitong', label: 'ChatGPT Plus 开通' },
  { href: '/chatgpt-plus-shengji', label: 'ChatGPT Plus 升级' },
  { href: '/chatgpt-plus-dingyue', label: 'ChatGPT Plus 订阅' },
  { href: '/chatgpt-plus-goumai', label: 'ChatGPT Plus 购买' },
  { href: '/chatgpt-plus-chongzhi', label: 'ChatGPT Plus 充值' },
  { href: '/chatgpt-plus-kaitong-fuwu', label: '开通服务' },
  { href: '/chatgpt-plus-dingyue-fuwu', label: '订阅服务' },
  { href: '/chatgpt-plus-zhifu-xiezhu', label: '支付协助' },
  { href: '/chatgpt-plus-dai-kaitong', label: '代开通' },
  { href: '/chatgpt-plus-dai-dingyue', label: '代订阅' },
]

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-500 hover:text-emerald-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>ChatGPT Plus 充值服务 - 安全快捷的 GPT Plus 开通方案</p>
          <p>&copy; {new Date().getFullYear()} GPT Plus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
