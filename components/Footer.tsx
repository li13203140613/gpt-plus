import Link from 'next/link'

const PRIMARY_LINKS = [
  { href: '/', label: '首页' },
  { href: '/success', label: '查看订单' },
  { href: '/chatgpt-plus-kaitong', label: '开通' },
  { href: '/chatgpt-plus-dingyue', label: '订阅' },
  { href: '/chatgpt-plus-shengji', label: '升级' },
]

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
    <footer className="mt-20 border-t border-stone-200/80 bg-[#fffaf0]/65">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-b border-stone-200/80 pb-6">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-500 transition-colors hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <p>ChatGPT Plus 充值服务 - 安全快捷的 GPT Plus 开通方案</p>
          <p>&copy; {new Date().getFullYear()} GPT Plus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
