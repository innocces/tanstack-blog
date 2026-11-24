/** Locale switching and translated content. */
import { BASE, sleep } from './helpers.mjs'

export default async function run(page, { check }) {
  await page.goto(`${BASE}/docs/getting-started`, { waitUntil: 'networkidle0' })

  await page.click('.tb-dropdown-trigger[aria-label="Language"]')
  const options = await page.$$('[role="option"]')
  check('locale dropdown lists languages', options.length >= 2, `${options.length} locales`)

  await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('[role="option"]')]
    nodes
      .find((node) => node.textContent?.includes('中文'))
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await sleep(700)
  check(
    'locale switch preserves route',
    page.url().includes('/zh-CN/docs/getting-started'),
    page.url(),
  )
  const content = await page.content()
  check('translated content rendered', content.includes('快速开始'))

  const dir = await page.evaluate(() => document.documentElement.dir)
  check('direction set for locale', dir === 'ltr', dir)
}
