'use client'

import { useEffect, useState, useCallback } from 'react'

const AVATARS = [
  'https://images.unsplash.com/photo-1643990083137-34669413e267?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
  'https://images.unsplash.com/photo-1643990084162-7ea1395ab14e?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
  'https://images.unsplash.com/photo-1704731268191-e744c6d96b26?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
  'https://images.unsplash.com/photo-1758600432264-b8d2a0fd7d83?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
  'https://images.unsplash.com/photo-1770363758028-2890f5e9a731?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
  'https://images.unsplash.com/photo-1708533646155-b8738d549385?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
  'https://images.unsplash.com/photo-1762191860163-8611f177937d?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
  'https://images.unsplash.com/photo-1627007778238-e555392e1661?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
]

const NAMES = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
const SUFFIXES = ['先生', '女士', '同学']

interface Notification {
  user: string
  time: string
  key: number
}

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

export function SocialProof() {
  const [notification, setNotification] = useState<Notification>({ user: '一位用户', time: '刚刚', key: 0 })
  const [fade, setFade] = useState(true)

  const rotate = useCallback(() => {
    setFade(false)
    setTimeout(() => {
      setNotification({ user: randomUser(), time: randomTime(), key: Date.now() })
      setFade(true)
    }, 300)
  }, [])

  useEffect(() => {
    rotate()
    const interval = setInterval(rotate, 6000)
    return () => clearInterval(interval)
  }, [rotate])

  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      {/* User count badge */}
      <div className="inline-flex items-center gap-2.5 rounded-full bg-gray-900 px-5 py-2.5 text-white shadow-lg">
        <div className="flex -space-x-1.5">
          {AVATARS.slice(0, 3).map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="size-7 rounded-full border-2 border-gray-900 object-cover"
            />
          ))}
        </div>
        <span className="text-sm">
          已帮助 <span className="font-bold text-violet-300">5.9万+</span> 位用户完成充值
        </span>
      </div>

      {/* Rolling notification */}
      <div
        className={`inline-flex items-center gap-1.5 text-sm text-gray-500 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="size-2 rounded-full bg-green-500 animate-pulse-dot" />
        <span className="text-yellow-500">&#9889;</span>
        <span>{notification.time}，{notification.user}成功充值了 ChatGPT Plus</span>
      </div>
    </div>
  )
}
