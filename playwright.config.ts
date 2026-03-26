import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const HOST = '127.0.0.1'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://${HOST}:${PORT}`,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --host ${HOST} --port ${PORT}`,
    port: PORT,
    reuseExistingServer: true,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
