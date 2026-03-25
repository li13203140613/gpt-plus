'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ClipboardList, Shield, Star, Users, Clock3 } from 'lucide-react'
import { ChatGptIcon } from './ChatGptIcon'
import { useT, useLocale } from '@/lib/i18n/context'

const STAT_ICONS = [Users, Shield, Clock3, Star]

export function Header() {
  const t = useT()
  const { locale } = useLocale()

  const [notification, setNotification] = useState({ user: '', time: '' })
  const [fade, setFade] = useState(true)

  const randomUser = useCallback(() => {
    const names = t.notificationNames
    const suffixes = t.notificationSuffixes
    const name = names[Math.floor(Math.random() * names.length)]
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
    return `${name}${suffix}`
  }, [t])

  const randomTime = useCallback(() => {
    const mins = Math.floor(Math.random() * 5)
    if (mins === 0) return t.notificationJustNow
    return t.notificationMinutesAgo.replace('{n}', String(mins))
  }, [t])

  const rotate = useCallback(() => {
    setFade(false)
    setTimeout(() => {
      setNotification({ user: randomUser(), time: randomTime() })
      setFade(true)
    }, 300)
  }, [randomUser, randomTime])

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
              <span className="text-[10px] leading-none text-gray-400">{t.headerSubtitle}</span>
            </div>
          </Link>
        </div>

        <Link href="/success" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 transition-colors">
          <ClipboardList className="size-4" />
          <span>{t.myOrders}</span>
        </Link>
      </div>

      <div className="border-t border-violet-100/80 bg-gradient-to-r from-violet-50/90 via-white to-violet-50/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
          {t.headerStats.map((item, i) => {
            const Icon = STAT_ICONS[i]
            return (
              <div key={item.label} className="flex items-center gap-2 text-gray-600">
                <Icon className="size-4 flex-shrink-0 text-violet-500" />
                <span>{item.label}</span>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
            )
          })}
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
          {' '}{t.notificationAction} · {notification.time}
        </span>
      </div>
    </>
  )
}
