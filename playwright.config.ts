import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3001',
    headless: true,
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: ['--no-proxy-server'],
    },
  },
  webServer: {
    command: 'pnpm dev',
    port: 3001,
    reuseExistingServer: true,
    env: {
      NO_PROXY: 'localhost,127.0.0.1',
    },
  },
})
