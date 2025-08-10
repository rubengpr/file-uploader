import { test, expect } from '@playwright/test'

test.describe('Log In', () => {
    test('should navigate to /recover-password', async ({ page }) => {
        await page.goto('/login')

        await page.getByRole('link', { name: 'Forgot your password, again?' }).click()

        await expect(page.getByRole('heading', { name: 'Password recovery' })).toBeVisible()
    })

    test('should navigate to /signup', async ({ page }) => {
        await page.goto('/login')

        await page.getByRole('link', { name: 'sign up' }).click()

        await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible()
    })

    test('should login with test account and navigate to /folders', async ({ page }) => {
        await page.goto('/login')
        
        const responsePromise = page.waitForResponse('**/api/auth/login')
        await page.getByRole('button', { name: '✨ Use test account' }).click()
        await responsePromise

        await expect(page).toHaveURL('/folders')
        
        const tokens = await page.evaluate(() => {
            return {
                token: localStorage.getItem('token'),
                stoken: localStorage.getItem('stoken')
            }
        })
        
        expect(tokens.token).toBeTruthy()
        expect(tokens.stoken).toBeTruthy()
    })

    test('should manually login and navigate to /folders', async ({ page }) => {
        await page.goto('/login')
        
        await page.getByLabel('Email').fill('beffjezos@atmyzone.com')
        await page.getByLabel('Password').fill('Amazonia12!')
        
        const responsePromise = page.waitForResponse('**/api/auth/login')
        await page.getByRole('button', { name: 'Log in' }).click()
        await responsePromise
        
        await expect(page).toHaveURL('/folders')

        const tokens = await page.evaluate(() => {
            return {
                token: localStorage.getItem('token'),
                stoken: localStorage.getItem('stoken')
            }
        })
        
        expect(tokens.token).toBeTruthy()
        expect(tokens.stoken).toBeTruthy()
    })
})