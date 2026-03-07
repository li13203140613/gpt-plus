'use client'

import Link from 'next/link'
import { ChatGptIcon } from './ChatGptIcon'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fffaf0]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-[0_10px_24px_-14px_rgba(16,185,129,0.9)]">
              <ChatGptIcon className="size-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-lg font-bold text-transparent">
              GPT Plus
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
