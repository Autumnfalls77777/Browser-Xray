import { test, expect } from '@playwright/test'

test.describe('Xray', () => {
  test('landing page loads with hero content', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('How much can a')).toBeVisible()
    await expect(page.getByText('website', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: /enter the lab/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /view events/i })).toBeVisible()
  })

  test('navbar renders with branding', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Xray').first()).toBeVisible()
  })

  test('interactive lab shows cards that respond to interaction', async ({ page }) => {
    await page.goto('/')
    const lab = page.locator('#lab')
    await expect(lab.getByText('Try to trigger a signal')).toBeVisible()

    const tabSwitchCard = lab.getByText('Tab Switch', { exact: true })
    await expect(tabSwitchCard).toBeVisible()

    await page.mouse.move(640, 400)
    await page.waitForTimeout(2000)

    await expect(lab.getByText('Left Click', { exact: true })).toBeVisible()
    await expect(lab.getByText('Scroll', { exact: true })).toBeVisible()
    await expect(lab.getByText('Keyboard', { exact: true })).toBeVisible()
  })

  test('keyboard activity is detected without storing key values', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('a')
    await page.waitForTimeout(500)

    const lab = page.locator('#lab')
    await expect(lab.getByText('Keyboard', { exact: true })).toBeVisible()
  })

  test('event feed shows events after interaction', async ({ page }) => {
    await page.goto('/')
    await page.mouse.move(640, 400)
    await page.waitForTimeout(2500)

    const feed = page.getByText('LIVE SIGNAL FEED', { exact: true })
    await expect(feed).toBeVisible()
  })

  test('event feed filter works', async ({ page }) => {
    await page.goto('/')
    await page.mouse.move(640, 400)
    await page.waitForTimeout(2500)

    const pointerFilter = page.getByRole('button', { name: 'POINTER', exact: true })
    await pointerFilter.click()
    await expect(pointerFilter).toHaveClass(/bg-lime/)
  })

  test('system status shows session duration', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('SESSION')).toBeVisible()
    await expect(page.locator('div').filter({ hasText: /^SIGNALS$/ }).first()).toBeVisible()
    await expect(page.getByText('SIGNALS', { exact: true }).first()).toBeVisible()
  })

  test('research section renders', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('WHAT WE CAN OBSERVE')).toBeVisible()
    await expect(page.getByText('WHAT WE CAN INFER')).toBeVisible()
    await expect(page.getByText('WHAT WE CANNOT DIRECTLY KNOW')).toBeVisible()
  })

  test('footer renders with privacy indicators', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('contentinfo').getByText(/local experiment/i)).toBeVisible()
    await expect(page.getByText(/no data transmitted/i)).toBeVisible()
  })

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/')
    await page.waitForTimeout(2000)

    expect(errors).toHaveLength(0)
  })
})
