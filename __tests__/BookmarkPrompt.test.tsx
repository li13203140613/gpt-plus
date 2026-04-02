import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BookmarkPrompt } from '@/components/BookmarkPrompt'

describe('BookmarkPrompt', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // --- 断点测试：验证关键状态节点 ---

  it('trigger=false 时不渲染任何内容', () => {
    const { container } = render(<BookmarkPrompt />)
    expect(container.innerHTML).toBe('')
  })

  it('trigger=true 但 3 秒内不显示', () => {
    render(<BookmarkPrompt trigger />)
    act(() => { vi.advanceTimersByTime(2999) })
    expect(screen.queryByText('收藏我们')).not.toBeInTheDocument()
  })

  it('trigger=true 3 秒后显示', () => {
    render(<BookmarkPrompt trigger />)
    act(() => { vi.advanceTimersByTime(3000) })
    expect(screen.getByText('收藏我们')).toBeInTheDocument()
  })

  // --- 单元测试：核心逻辑 ---

  it('sessionStorage 已记录 dismissed 时不显示', () => {
    sessionStorage.setItem('bookmark-dismissed', '1')
    render(<BookmarkPrompt trigger />)
    act(() => { vi.advanceTimersByTime(5000) })
    expect(screen.queryByText('收藏我们')).not.toBeInTheDocument()
  })

  it('点击"稍后再说"关闭并写入 sessionStorage', () => {
    render(<BookmarkPrompt trigger />)
    act(() => { vi.advanceTimersByTime(3000) })

    fireEvent.click(screen.getByText('稍后再说'))

    expect(screen.queryByText('收藏我们')).not.toBeInTheDocument()
    expect(sessionStorage.getItem('bookmark-dismissed')).toBe('1')
  })

  it('点击"立即收藏"弹出 alert 并关闭', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<BookmarkPrompt trigger />)
    act(() => { vi.advanceTimersByTime(3000) })

    fireEvent.click(screen.getByText('立即收藏'))

    expect(alertSpy).toHaveBeenCalledWith('按 Ctrl+D (Mac: Cmd+D) 收藏本网站')
    expect(screen.queryByText('收藏我们')).not.toBeInTheDocument()
    alertSpy.mockRestore()
  })

  it('点击 X 按钮关闭弹窗', () => {
    render(<BookmarkPrompt trigger />)
    act(() => { vi.advanceTimersByTime(3000) })

    // X 按钮是第一个 button
    const closeBtn = screen.getAllByRole('button')[0]
    fireEvent.click(closeBtn)

    expect(screen.queryByText('收藏我们')).not.toBeInTheDocument()
  })
})
