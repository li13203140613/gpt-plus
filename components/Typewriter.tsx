'use client'

import { useEffect, useState, useCallback } from 'react'

const PHRASES = [
  '无需国外银行卡',
  '微信支付宝可付',
  '不成功100%退款',
  '正规充值通道',
  '2 分钟自助完成',
]

export function Typewriter() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  const currentPhrase = PHRASES[phraseIndex]

  const tick = useCallback(() => {
    if (!deleting) {
      if (charIndex < currentPhrase.length) {
        setCharIndex((c) => c + 1)
      } else {
        setTimeout(() => setDeleting(true), 2000)
        return
      }
    } else {
      if (charIndex > 0) {
        setCharIndex((c) => c - 1)
      } else {
        setDeleting(false)
        setPhraseIndex((p) => (p + 1) % PHRASES.length)
        return
      }
    }
  }, [charIndex, deleting, currentPhrase.length])

  useEffect(() => {
    const speed = deleting ? 40 : 80
    const timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [tick, deleting])

  return (
    <span className="inline-flex min-w-[14ch] justify-center">
      {currentPhrase.slice(0, charIndex)}
      <span className="inline-block w-[2px] h-[1em] bg-violet-600 align-middle ml-0.5 animate-[blink_1s_step-end_infinite]" />
    </span>
  )
}
