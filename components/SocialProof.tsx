'use client'

import { useEffect, useState } from 'react'

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

export function SocialProof() {
  const [notification, setNotification] = useState({ user: '一位用户', time: '刚刚' })

  useEffect(() => {
    setNotification({ user: randomUser(), time: randomTime() })
    const interval = setInterval(() => {
      setNotification({ user: randomUser(), time: randomTime() })
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <div className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-white shadow-lg">
        <div className="flex -space-x-2">
          <div className="size-6 rounded-full bg-violet-400 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">U</div>
          <div className="size-6 rounded-full bg-purple-400 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">S</div>
          <div className="size-6 rounded-full bg-indigo-400 border-2 border-gray-900 flex items-center justify-center text-[10px] font-bold">E</div>
        </div>
        <span className="text-sm">
          已帮助 <span className="font-bold text-violet-300">5.9万+</span> 位用户完成充值
        </span>
      </div>
      <div className="inline-flex items-center gap-1.5 text-sm text-gray-500">
        <span className="size-2 rounded-full bg-green-500 animate-pulse-dot" />
        <span className="text-yellow-500">&#9889;</span>
        <span>{notification.time}，{notification.user}成功充值了 ChatGPT Plus</span>
      </div>
    </div>
  )
}
