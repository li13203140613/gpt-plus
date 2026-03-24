'use client'

import { useState } from 'react'
import { MessageCircle, X, Sparkles } from 'lucide-react'

const AI_TOOLS = [
  'ChatGPT Pro',
  'Cursor',
  'Claude',
  'Gemini',
]

export function CustomerService() {
  const [open, setOpen] = useState(true)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 group"
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 transition-all group-hover:shadow-xl group-hover:shadow-violet-500/40 group-hover:scale-105">
          <MessageCircle className="size-6" />
        </div>
        <span className="text-xs font-medium text-gray-500">客服</span>
      </button>

      {/* Popup */}
      {open && (
        <>
          {/* Backdrop (no overlay, just click-to-close) */}
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="fixed right-3 bottom-20 z-[101] w-[280px] sm:right-6 sm:bottom-24 sm:w-[340px] max-w-[85vw] rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-violet-500/10">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 sm:px-6 sm:pt-5 sm:pb-3">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">联系客服</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-gray-500 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-4 space-y-3 sm:px-6 sm:pb-6 sm:space-y-5">
              {/* AI Tools Card - hidden on mobile */}
              <div className="hidden sm:block rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">AI 工具充值服务</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">支持充值多种 AI 工具，让您畅享智能体验：</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {AI_TOOLS.map((tool) => (
                    <div key={tool} className="flex items-center gap-1.5 text-sm text-gray-700">
                      <span className="size-1.5 rounded-full bg-green-500" />
                      {tool}
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm text-gray-600">遇到充值问题？添加微信获取专业帮助</p>
                <div className="mx-auto w-28 h-28 sm:w-40 sm:h-40 rounded-lg border border-gray-100 overflow-hidden">
                  <img
                    src="/wechat-qr.png"
                    alt="微信客服二维码"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Footer tips */}
              <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm">
                <p className="text-gray-500">
                  <span className="text-amber-500">💡</span>{' '}
                  <span className="text-violet-600 font-medium">专业客服团队，为您服务</span>
                </p>
                <p className="text-gray-500">
                  <span className="text-green-500">📋</span>{' '}
                  <span className="text-violet-600 font-medium">添加时请备注：gpt</span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
