'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { CodeCard } from './CodeCard'

interface CodeItem {
  id: string
  maskedCode: string
  price: number
}

export function CodeGrid() {
  const [codes, setCodes] = useState<CodeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCodes() {
      try {
        const res = await fetch('/api/codes')
        if (!res.ok) throw new Error('获取激活码失败')
        const data = await res.json()
        setCodes(data.codes)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取激活码失败')
      } finally {
        setLoading(false)
      }
    }
    fetchCodes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 text-emerald-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400">{error}</p>
      </div>
    )
  }

  if (codes.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400 text-lg">暂无可用激活码</p>
        <p className="text-zinc-500 text-sm mt-2">请稍后再来查看，我们会定期补充库存</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {codes.map((code, index) => (
        <CodeCard
          key={code.id}
          id={code.id}
          maskedCode={code.maskedCode}
          price={code.price}
          index={index}
        />
      ))}
    </div>
  )
}
