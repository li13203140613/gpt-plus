'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'ChatGPT Plus 充值' },
  { href: '/chatgpt-plus-kaitong', label: '开通' },
  { href: '/chatgpt-plus-dingyue', label: '订阅' },
  { href: '/chatgpt-plus-shengji', label: '升级' },
]

export function Header() {
  return (
    <header className="border-b border-zinc-800/50 backdrop-blur-md bg-zinc-950/80 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Zap className="size-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              GPT Plus
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-3 ml-4 border-l border-zinc-800 pl-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 hover:text-emerald-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
