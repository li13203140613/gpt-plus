'use client'

import { useEffect, useState, useCallback } from 'react'
import { useT } from '@/lib/i18n/context'

export function Typewriter() {
  const t = useT()
  const phrases = t.typewriterPhrases

  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  const currentPhrase = phrases[phraseIndex]

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
        setPhraseIndex((p) => (p + 1) % phrases.length)
        return
      }
    }
  }, [charIndex, deleting, currentPhrase.length, phrases.length])

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
