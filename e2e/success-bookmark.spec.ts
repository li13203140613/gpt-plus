import { test, expect } from '@playwright/test'

test.describe('支付成功页 - 收藏提示', () => {
  test.beforeEach(async ({ page }) => {
    // Mock /api/order/* 返回支付成功
    await page.route('**/api/order/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'completed',
          code: 'TESTCODE123',
          email: 'test@example.com',
          currency: 'cny',
          paidAmount: 128,
        }),
      })
    })

    // Mock /api/settings (activation URL)
    await page.route('**/api/settings', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ activationUrl: 'https://example.com/activate' }),
      })
    })
  })

  test('支付成功后 3 秒弹出收藏提示', async ({ page }) => {
    await page.goto('/success?session_id=test_session_123')

    // 等待支付成功状态渲染
    await expect(page.locator('text=TESTCODE123').first()).toBeVisible({ timeout: 10000 })

    // 3 秒内不应显示收藏提示
    await expect(page.locator('text=收藏我们')).not.toBeVisible()

    // 等待 3 秒后应显示
    await page.waitForTimeout(3500)
    await expect(page.locator('text=收藏我们')).toBeVisible()
  })

  test('点击"稍后再说"关闭收藏提示', async ({ page }) => {
    await page.goto('/success?session_id=test_session_123')
    await expect(page.locator('text=TESTCODE123').first()).toBeVisible({ timeout: 10000 })

    await page.waitForTimeout(3500)
    await expect(page.locator('text=收藏我们')).toBeVisible()

    await page.locator('text=稍后再说').click({ force: true })
    await expect(page.locator('text=收藏我们')).not.toBeVisible()
  })

  test('关闭后刷新页面不再弹出', { timeout: 60000 }, async ({ page }) => {
    await page.goto('/success?session_id=test_session_123')
    await expect(page.locator('text=TESTCODE123').first()).toBeVisible({ timeout: 10000 })

    await page.waitForTimeout(3500)
    await page.locator('text=稍后再说').click({ force: true })

    // 重新加载（重新 mock）
    await page.route('**/api/order/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'completed',
          code: 'TESTCODE123',
          email: 'test@example.com',
          currency: 'cny',
          paidAmount: 128,
        }),
      })
    })
    await page.reload()
    await expect(page.locator('text=TESTCODE123').first()).toBeVisible({ timeout: 10000 })

    await page.waitForTimeout(3500)
    // sessionStorage 记住了，不再弹出
    await expect(page.locator('text=收藏我们')).not.toBeVisible()
  })
})
