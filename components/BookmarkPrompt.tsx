'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Star, X } from 'lucide-react'

export function BookmarkPrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('bookmark-dismissed')
    if (dismissed) return

    // Disabled: bookmark prompt not shown on page load
    return
  }, [])

  function handleBookmark() {
    alert('按 Ctrl+D (Mac: Cmd+D) 收藏本网站')
    handleClose()
  }

  function handleClose() {
    setShow(false)
    sessionStorage.setItem('bookmark-dismissed', '1')
  }

  if (!show) return null

  return (
      <div className="fixed right-6 bottom-24 z-[100] w-[340px] max-w-[90vw] rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl shadow-violet-500/10 animate-[slideUp_0.3s_ease-out]">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-violet-100">
          <Bookmark className="size-6 text-violet-600" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">收藏我们</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          收藏本网站，下次充值更方便！快速访问 ChatGPT Plus 代充服务。
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBookmark}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30"
          >
            <Star className="size-4" />
            立即收藏
          </button>
          <button
            onClick={handleClose}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            稍后再说
          </button>
        </div>
      </div>
  )
}
