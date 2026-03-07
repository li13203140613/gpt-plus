'use client'

import { useEffect, useState, useCallback } from 'react'

const PHRASES = [
  '正规充值通道',
  '专业 ChatGPT Plus 充值服务',
  '不成功100%退款',
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
    <span>
      {currentPhrase.slice(0, charIndex)}
      <span className="inline-block w-[2px] h-[1em] bg-violet-600 align-middle ml-0.5 animate-[blink_1s_step-end_infinite]" />
    </span>
  )
}
