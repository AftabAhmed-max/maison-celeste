import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Rooms', path: '/rooms' },
  { name: 'Experiences', path: '/experiences' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

test.describe('Smoke Tests — Page Load', () => {
  for (const page of pages) {
    test(`${page.name} page loads without error`, async ({ page: p }) => {
      const consoleErrors: string[] = []
      p.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text())
      })
      const response = await p.goto(`${BASE_URL}${page.path}`)
      expect(response?.status()).toBeLessThan(500)
      await expect(p).not.toHaveTitle(/404|500|error/i)
      expect(consoleErrors.filter(e =>
        !e.includes('favicon') &&
        !e.includes('Failed to load resource')
      )).toHaveLength(0)
    })
  }
})

test.describe('Smoke Tests — Navigation Links', () => {
  test('All navbar links work', async ({ page }) => {
    await page.goto(BASE_URL)
    const links = await page.$$eval('nav a', els =>
      els.map(el => el.getAttribute('href')).filter(Boolean)
    )
    for (const link of links) {
      if (!link || link.startsWith('#') || link.startsWith('http')) continue
      const res = await page.goto(`${BASE_URL}${link}`)
      expect(res?.status()).toBeLessThan(400)
    }
  })
})

test.describe('Smoke Tests — Core Elements', () => {
  test('Home page has hero section and CTA button', async ({ page }) => {
    await page.goto(BASE_URL)
    const hero = page.locator('section').first()
    await expect(hero).toBeVisible()
    const cta = page.locator('a[href*="rooms"], a[href*="book"], button').first()
    await expect(cta).toBeVisible()
  })

  test('Contact page has a form', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`)
    const form = page.locator('form')
    await expect(form).toBeVisible()
  })

  test('Images load without broken src', async ({ page }) => {
    await page.goto(BASE_URL)
    const images = await page.$$eval('img', imgs =>
      imgs.map(img => ({ src: img.src, alt: img.alt }))
    )
    for (const img of images) {
      expect(img.src).not.toBe('')
      expect(img.src).not.toContain('undefined')
    }
  })

  test('No broken internal links on home page', async ({ page }) => {
    await page.goto(BASE_URL)
    const links = await page.$$eval('a', els =>
      els.map(el => el.getAttribute('href')).filter(Boolean)
    )
    const internalLinks = links.filter(l => l && l.startsWith('/'))
    for (const link of internalLinks) {
      const res = await page.goto(`${BASE_URL}${link}`)
      expect(res?.status()).not.toBe(404)
    }
  })
})

test.describe('Smoke Tests — Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  for (const pg of pages) {
    test(`${pg.name} renders on mobile without overflow`, async ({ page }) => {
      await page.goto(`${BASE_URL}${pg.path}`)
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = 375
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5)
    })
  }
})