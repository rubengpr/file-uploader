import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
    test('should navigate to /pricing', async ({ page }) => {
        await page.goto('/')
        
        await page.getByRole('link', { name: 'Pricing' }).click()

        await expect(page.getByRole('heading', { name: 'Storage plans for all use cases' })).toBeVisible()
    })

    test('should show correct pricing plan naming', async ({ page }) => {
        await page.goto('/')

        await page.getByRole('link', { name: 'Pricing' }).click()

        await expect(page.getByRole('heading', { name: 'Hobby' })).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Standard' })).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Max' })).toBeVisible()
    })

    test('should show correct pricing plan amounts', async ({ page }) => {
        await page.goto('/')

        await page.getByRole('link', { name: 'Pricing' }).click()

        await expect(page.getByText('Free')).toBeVisible()
        await expect(page.getByText('5€')).toBeVisible()
        await expect(page.getByText('20€')).toBeVisible()
    })

    test('should navigate to /login', async ({ page }) => {
        await page.goto('')
        
        await page.getByRole('button', { name: 'Log in' }).click()

        await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible()
    })
})