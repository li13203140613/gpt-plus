'use client'

import Link from 'next/link'
import { ChatGptIcon } from './ChatGptIcon'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/20">
              <ChatGptIcon className="size-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">GPT Plus</span>
              <span className="text-[10px] leading-none text-gray-400">ChatGPT Plus 充值服务</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
