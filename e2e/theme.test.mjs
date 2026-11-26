/** Theme switching, persistence and previews. */
import { BASE, sleep } from './helpers.mjs'

export default async function run(page, { check }) {
  await page.goto(`${BASE}/docs/getting-started`, { waitUntil: 'networkidle0' })

  await page.click('.tb-dropdown-trigger[aria-label="Theme"]')
  await page.evaluate(() => {
    const options = [...document.querySelectorAll('[role="option"]')]
    options
      .find((node) => node.textContent?.includes('MUJI'))
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await sleep(300)
  const applied = await page.evaluate(() => document.documentElement.dataset.theme)
  check('dropdown applies MUJI', applied === 'muji', String(applied))

  await page.evaluate(() => {
    document.querySelector('a[href="/docs/configuration"]')?.click()
  })
  await sleep(500)
  const afterNav = await page.evaluate(() => document.documentElement.dataset.theme)
  check('theme survives SPA navigation', afterNav === 'muji', String(afterNav))

  const stored = await page.evaluate(() => localStorage.getItem('tanstack-blog-theme'))
  check('theme persisted to localStorage', stored?.includes('muji'), stored ?? '')

  await page.goto(`${BASE}/themes/stripe-press`, { waitUntil: 'networkidle0' })
  const preview = await page.evaluate(() => ({
    theme: document.querySelector('.tb-theme-preview')?.getAttribute('data-theme'),
    bg: getComputedStyle(document.querySelector('.tb-theme-preview')).backgroundColor,
  }))
  check('per-theme preview renders', preview.theme === 'stripe-press', preview.bg)

  const modes = await page.$$('.tb-preview-actions .tb-mode-switch button')
  check('preview has mode toggle', modes.length === 2, `${modes.length} modes`)

  await page.evaluate(() => {
    const apply = [...document.querySelectorAll('button')].find((node) =>
      node.textContent?.includes('Apply theme'),
    )
    apply?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await sleep(600)
  check(
    'preview Apply persists theme',
    (await page.evaluate(() => localStorage.getItem('tanstack-blog-theme')))?.includes(
      'stripe-press',
    ),
  )

  // Dark mode must still apply token changes from the header dropdown.
  await page.goto(`${BASE}/docs/getting-started?mode=dark`, { waitUntil: 'networkidle0' })
  const before = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--tb-bg').trim(),
  )
  await page.click('.tb-dropdown-trigger[aria-label="Theme"]')
  await page.evaluate(() => {
    ;[...document.querySelectorAll('[role="option"]')]
      .find((node) => node.textContent?.includes('MUJI'))
      ?.click()
  })
  await sleep(300)
  const after = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--tb-bg').trim(),
  )
  check('dark-mode dropdown applies tokens', before !== after, `${before} -> ${after}`)
}
