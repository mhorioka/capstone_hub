import { expect, type Page } from '@playwright/test'

export async function resetStorage(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.clear()
  })
}

export async function createProject(page: Page, overrides?: { name?: string; market?: string }) {
  const name = overrides?.name ?? 'E2E 食品参入プロジェクト'
  const market = overrides?.market ?? '日本'

  await page.goto('/')
  await page.getByRole('button', { name: '新規プロジェクト作成' }).click()

  await page.getByLabel(/プロジェクト名/).fill(name)
  await page.getByLabel(/対象市場/).fill(market)
  await page.getByLabel(/食品カテゴリ/).fill('冷凍食品')
  await page.getByLabel(/目標期日/).fill('2026-12-31')

  await page.getByRole('button', { name: 'プロジェクトを作成' }).click()
  await expect(page).toHaveURL(/\/projects\/.+$/)

  return { name, market }
}

export async function saveNamedScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `test-results/screenshots/${name}.png`,
    fullPage: true,
  })
}
