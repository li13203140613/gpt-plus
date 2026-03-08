'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ChatGptIcon } from './ChatGptIcon'

const NAMES = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
const SUFFIXES = ['先生', '女士', '同学']

function randomUser() {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)]
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]
  return `${name}${suffix}`
}

function randomTime() {
  const mins = Math.floor(Math.random() * 5)
  if (mins === 0) return '刚刚'
  return `${mins} 分钟前`
}

export function Header() {
  const [notification, setNotification] = useState({ user: '一位用户', time: '刚刚' })
  const [fade, setFade] = useState(true)

  const rotate = useCallback(() => {
    setFade(false)
    setTimeout(() => {
      setNotification({ user: randomUser(), time: randomTime() })
      setFade(true)
    }, 300)
  }, [])

  useEffect(() => {
    rotate()
    const interval = setInterval(rotate, 6000)
    return () => clearInterval(interval)
  }, [rotate])

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

      {/* Rolling notification - below header, right side */}
      <div
        className={`fixed top-20 right-6 z-40 hidden sm:inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-500 shadow-sm backdrop-blur transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="size-2 rounded-full bg-green-500 animate-pulse-dot" />
        <span className="text-yellow-500">&#9889;</span>
        <span>{notification.time}，{notification.user}成功充值了 ChatGPT Plus</span>
      </div>
    </header>
  )
}
