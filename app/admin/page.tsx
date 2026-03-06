'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, Plus, Lock, LogIn, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

interface Code {
  id: string
  code: string
  price: number
  status: string
  buyer_email: string | null
  sold_at: string | null
  created_at: string
}

interface Stats {
  total: number
  available: number
  reserved: number
  sold: number
  revenue: number
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [codes, setCodes] = useState<Code[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, available: 0, reserved: 0, sold: 0, revenue: 0 })
  const [loading, setLoading] = useState(false)
  const [newCodes, setNewCodes] = useState('')
  const [newPrice, setNewPrice] = useState(99)

  const fetchCodes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/codes', {
        headers: { 'x-admin-key': password },
      })
      if (!res.ok) throw new Error('获取失败')
      const data = await res.json()
      setCodes(data.codes)
      setStats(data.stats)
    } catch {
      toast.error('获取激活码列表失败')
    } finally {
      setLoading(false)
    }
  }, [password])

  useEffect(() => {
    if (authenticated) {
      fetchCodes()
    }
  }, [authenticated, fetchCodes])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/codes', {
        headers: { 'x-admin-key': password },
      })
      if (res.ok) {
        setAuthenticated(true)
      } else {
        toast.error('密码错误')
      }
    } catch {
      toast.error('验证失败')
    }
  }

  async function handleAddCodes() {
    const codesToAdd = newCodes
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c.length > 0)

    if (codesToAdd.length === 0) {
      toast.error('请输入激活码（每行一个）')
      return
    }

    try {
      const res = await fetch('/api/admin/codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': password,
        },
        body: JSON.stringify({ codes: codesToAdd, price: newPrice }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '添加失败')
      }

      const data = await res.json()
      toast.success(`成功添加 ${data.added} 个激活码`)
      setNewCodes('')
      fetchCodes()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '添加失败')
    }
  }

  // Login page
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <Toaster />
        <div className="max-w-sm w-full space-y-6">
          <div className="text-center">
            <Lock className="size-12 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">管理后台</h1>
            <p className="text-zinc-400 mt-1">请输入管理密码</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-zinc-300">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-zinc-900 border-zinc-700 text-white"
                placeholder="输入管理密码"
              />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
              <LogIn className="size-4" />
              登录
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Toaster />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">ChatGPT Plus 激活码管理</h1>
          <Button onClick={fetchCodes} variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
            <RefreshCw className="size-4" />
            刷新
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="text-sm text-zinc-400">总计</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-sm text-emerald-400">可用</p>
            <p className="text-2xl font-bold mt-1 text-emerald-400">{stats.available}</p>
          </div>
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-sm text-yellow-400">预留中</p>
            <p className="text-2xl font-bold mt-1 text-yellow-400">{stats.reserved}</p>
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-sm text-blue-400">已售</p>
            <p className="text-2xl font-bold mt-1 text-blue-400">{stats.sold}</p>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <p className="text-sm text-purple-400">总收入</p>
            <p className="text-2xl font-bold mt-1 text-purple-400">{stats.revenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Add codes */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">添加激活码</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">激活码（每行一个）</Label>
              <textarea
                value={newCodes}
                onChange={(e) => setNewCodes(e.target.value)}
                className="mt-1 w-full h-32 rounded-lg bg-zinc-800 border border-zinc-700 text-white font-mono text-sm p-3 focus:border-emerald-500 focus:outline-none resize-none"
                placeholder="XXXX-XXXX-XXXX&#10;YYYY-YYYY-YYYY&#10;ZZZZ-ZZZZ-ZZZZ"
              />
              <div className="flex items-center gap-3 mt-3">
                <Button onClick={handleAddCodes} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                  <Plus className="size-4" />
                  添加
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-zinc-300">单价（元）</Label>
              <Input
                type="number"
                min={1}
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="mt-1 w-32 bg-zinc-800 border-zinc-700 text-white"
              />
              <p className="text-xs text-zinc-500 mt-2">
                从卡密供应商获取的激活码粘贴到左侧，设置好价格后点击添加。
              </p>
            </div>
          </div>
        </div>

        {/* Codes table */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold">所有激活码</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-8 text-emerald-400 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">激活码</TableHead>
                  <TableHead className="text-zinc-400">价格</TableHead>
                  <TableHead className="text-zinc-400">状态</TableHead>
                  <TableHead className="text-zinc-400">买家邮箱</TableHead>
                  <TableHead className="text-zinc-400">售出时间</TableHead>
                  <TableHead className="text-zinc-400">创建时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => (
                  <TableRow key={code.id} className="border-zinc-800">
                    <TableCell className="font-mono font-bold text-white">{code.code}</TableCell>
                    <TableCell className="text-zinc-300">{code.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          code.status === 'available' ? 'default' :
                          code.status === 'sold' ? 'secondary' : 'outline'
                        }
                        className={
                          code.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          code.status === 'sold' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }
                      >
                        {code.status === 'available' ? '可用' :
                         code.status === 'sold' ? '已售' : '预留中'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400">{code.buyer_email || '-'}</TableCell>
                    <TableCell className="text-zinc-400">
                      {code.sold_at ? new Date(code.sold_at).toLocaleString('zh-CN') : '-'}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {new Date(code.created_at).toLocaleString('zh-CN')}
                    </TableCell>
                  </TableRow>
                ))}
                {codes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                      暂无激活码
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
