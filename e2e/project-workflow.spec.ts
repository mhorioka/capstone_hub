import { expect, test } from '@playwright/test'
import { createProject, resetStorage, saveNamedScreenshot } from './helpers'

test.beforeEach(async ({ page }) => {
  await resetStorage(page)
})

test('プロジェクト作成後に主要ナビゲーションへ遷移できる', async ({ page }) => {
  const { name } = await createProject(page)
  const sidebar = page.locator('aside')

  await expect(page.getByText(name)).toBeVisible()
  await expect(sidebar.getByRole('link', { name: /^市場調査/ })).toBeVisible()
  await expect(sidebar.getByRole('link', { name: /^競合分析/ })).toBeVisible()
  await expect(sidebar.getByRole('link', { name: /^GTMプラン/ })).toBeVisible()
  await expect(sidebar.getByRole('link', { name: 'レポート', exact: true })).toBeVisible()

  await saveNamedScreenshot(page, 'dashboard-after-project-create')
})

test('市場調査を入力するとレポートに反映される', async ({ page }) => {
  await createProject(page, { name: '市場調査反映テスト' })
  const sidebar = page.locator('aside')

  await sidebar.getByRole('link', { name: /^市場調査/ }).click()
  await expect(page).toHaveURL(/\/market$/)

  await page.getByLabel('市場規模').fill('1,250億円')
  await page.getByLabel(/年間成長率/).fill('4.2%')
  await page.getByLabel('市場定義').fill('A社、B社、C社が競合する国内冷凍食品市場')

  await expect(page.getByText('保存済み')).toBeVisible({ timeout: 5000 })

  await sidebar.getByRole('link', { name: 'レポート', exact: true }).click()
  await expect(page).toHaveURL(/\/report$/)
  await expect(page.getByRole('heading', { name: '市場調査' })).toBeVisible()
  await expect(page.getByText('1,250億円')).toBeVisible()
  await expect(page.getByText('4.2%')).toBeVisible()
  await expect(page.getByText('A社、B社、C社が競合する国内冷凍食品市場')).toBeVisible()

  await saveNamedScreenshot(page, 'report-with-market-overview')
})

test('言語切替で英語UIに変わる', async ({ page }) => {
  await createProject(page, { name: 'Language Toggle Check' })
  const sidebar = page.locator('aside')

  await page.getByRole('button', { name: 'Switch to English' }).click()

  await expect(sidebar.getByRole('link', { name: 'Dashboard', exact: true })).toBeVisible()
  await expect(sidebar.getByRole('link', { name: /^Market Research/ })).toBeVisible()
  await expect(sidebar.getByRole('link', { name: 'Report', exact: true })).toBeVisible()

  await saveNamedScreenshot(page, 'dashboard-in-english')
})
