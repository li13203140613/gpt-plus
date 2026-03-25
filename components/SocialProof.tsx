'use client'

import { useT } from '@/lib/i18n/context'

const AVATARS = [
  'https://images.unsplash.com/photo-1643990083137-34669413e267?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
  'https://images.unsplash.com/photo-1643990084162-7ea1395ab14e?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
  'https://images.unsplash.com/photo-1704731268191-e744c6d96b26?auto=format&fit=crop&w=64&h=64&q=80&crop=faces',
]

export function SocialProof() {
  const t = useT()

  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <div className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white/80 px-5 py-2.5 text-gray-700 shadow-sm backdrop-blur">
        <div className="flex -space-x-1.5">
          {AVATARS.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="size-7 rounded-full border-2 border-white object-cover"
            />
          ))}
        </div>
        <span className="text-sm">
          <span className="font-bold text-violet-600">{t.socialProofCount}</span> {t.socialProofText}
        </span>
      </div>
    </div>
  )
}
