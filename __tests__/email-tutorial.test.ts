import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock getDb to avoid real database calls
vi.mock('@/lib/db', () => ({
  getDb: () => {
    const fn = vi.fn().mockResolvedValue([{ value: 'https://chong.plus' }])
    return fn
  },
}))

const TUTORIAL_URL = 'https://my.feishu.cn/wiki/AwGNwqLZeiRPJMkX5L8cbxZCncb'

describe('激活码邮件 - 教程链接', () => {
  let capturedBody: any = null

  beforeEach(() => {
    capturedBody = null

    // Mock environment variables
    vi.stubEnv('RESEND_API_KEY', 'test-key')
    vi.stubEnv('RESEND_FROM_EMAIL', 'test@example.com')

    // Mock fetch to capture the email body
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (_url: string, options: any) => {
      capturedBody = JSON.parse(options.body)
      return { ok: true, json: async () => ({}) }
    }))
  })

  // --- 断点测试：关键节点验证 ---

  it('HTML 邮件包含教程链接 URL', async () => {
    const { sendActivationCodeEmail } = await import('@/lib/email')
    await sendActivationCodeEmail({ code: 'TEST123', to: 'user@test.com' })

    expect(capturedBody).not.toBeNull()
    expect(capturedBody.html).toContain(TUTORIAL_URL)
  })

  it('HTML 邮件包含"查看详细教程"按钮文案', async () => {
    const { sendActivationCodeEmail } = await import('@/lib/email')
    await sendActivationCodeEmail({ code: 'TEST123', to: 'user@test.com' })

    expect(capturedBody.html).toContain('查看详细教程')
  })

  it('纯文本邮件包含教程链接 URL', async () => {
    const { sendActivationCodeEmail } = await import('@/lib/email')
    await sendActivationCodeEmail({ code: 'TEST123', to: 'user@test.com' })

    expect(capturedBody.text).toContain(TUTORIAL_URL)
  })

  it('教程链接是可点击的 <a> 标签', async () => {
    const { sendActivationCodeEmail } = await import('@/lib/email')
    await sendActivationCodeEmail({ code: 'TEST123', to: 'user@test.com' })

    // 验证 href 属性正确指向教程 URL
    expect(capturedBody.html).toContain(`href="${TUTORIAL_URL}"`)
  })

  it('教程区块在激活码之后出现', async () => {
    const { sendActivationCodeEmail } = await import('@/lib/email')
    await sendActivationCodeEmail({ code: 'TEST123', to: 'user@test.com' })

    const html = capturedBody.html as string
    const codeIndex = html.indexOf('TEST123')
    const tutorialIndex = html.indexOf(TUTORIAL_URL)

    // 断点：教程链接在激活码之后
    expect(codeIndex).toBeGreaterThan(-1)
    expect(tutorialIndex).toBeGreaterThan(codeIndex)
  })
})
