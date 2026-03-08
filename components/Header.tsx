'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ClipboardList, Shield, Star, Users, Clock3 } from 'lucide-react'
import { ChatGptIcon } from './ChatGptIcon'

const AVATARS = [
  'https://images.unsplash.com/photo-1643990083137-34669413e267?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
  'https://images.unsplash.com/photo-1643990084162-7ea1395ab14e?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
  'https://images.unsplash.com/photo-1704731268191-e744c6d96b26?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
]

const HEADER_STATS = [
  { icon: Users, label: '服务用户', value: '5.9万+' },
  { icon: Shield, label: '成功率', value: '99.8%' },
  { icon: Clock3, label: '到账时间', value: '≤2分钟' },
  { icon: Star, label: '用户评分', value: '4.9分' },
]

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
    <>
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

        <Link href="/success" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 transition-colors">
          <ClipboardList className="size-4" />
          <span>我的订单</span>
        </Link>
      </div>

      <div className="border-t border-violet-100/80 bg-gradient-to-r from-violet-50/90 via-white to-violet-50/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
          {HEADER_STATS.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-gray-600">
              <item.icon className="size-4 flex-shrink-0 text-violet-500" />
              <span>{item.label}</span>
              <span className="font-semibold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

    </header>

      {/* Rolling notification - fixed bottom left */}
      <div
        className={`fixed bottom-6 left-6 z-[9999] inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-5 py-3 text-sm shadow-lg backdrop-blur transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="size-2.5 rounded-full bg-green-500 animate-pulse-dot" />
        <span className="text-yellow-500">&#9889;</span>
        <span className="text-gray-700">
          <span className="font-semibold text-gray-900">{notification.user}</span>
          {' '}成功充值了 ChatGPT Plus · {notification.time}
        </span>
      </div>
    </>
  )
}
