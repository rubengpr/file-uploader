import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
    test('should navigate to pricing page', async ({ page }) => {
        await page.goto('/')
        
        await page.getByRole('link', { name: 'Pricing' }).click()

        await expect(page.getByRole('heading', { name: 'Storage plans for all use cases' })).toBeVisible()
    })

    test('should show correct pricing amounts', async ({ page }) => {
        await page.goto('/')

        await page.getByRole('link', { name: 'Pricing' }).click()

        await expect(page.getByRole('heading', { name: 'Hobby' })).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Standard' })).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Max' })).toBeVisible()
    })
})