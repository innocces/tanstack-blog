/** Locale switching and translated content. */
import { BASE, sleep } from './helpers.mjs'

export default async function run(page, { check }) {
  await page.goto(`${BASE}/docs/getting-started`, { waitUntil: 'networkidle0' })

  await page.click(
    '.tb-dropdown-trigger[aria-label="Language"], .tb-dropdown-trigger[aria-label="语言"]',
  )
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

  // Locale must survive navigation to another route.
  await page.goto(`${BASE}/docs/getting-started`, { waitUntil: 'networkidle0' })
  await page.click(
    '.tb-dropdown-trigger[aria-label="Language"], .tb-dropdown-trigger[aria-label="语言"]',
  )
  await page.evaluate(() => {
    ;[...document.querySelectorAll('[role="option"]')]
      .find((node) => node.textContent?.includes('中文'))
      ?.click()
  })
  await sleep(500)
  await page.goto(`${BASE}/docs/configuration`, { waitUntil: 'networkidle0' })
  await sleep(600)
  check('locale survives navigation', page.url().includes('/zh-CN/'), page.url())
  check('group titles localized', (await page.content()).includes('入门指南'))

  await page.goto(`${BASE}/zh-CN`, { waitUntil: 'networkidle0' })
  const hero = await page.$eval('.tb-hero-lead', (node) => node.textContent ?? '')
  check('hero localized', /[\u4e00-\u9fff]/.test(hero), hero)
  check(
    'header title localized',
    (await page.$eval('.tb-brand span', (node) => node.textContent ?? '')).includes('博客'),
  )
  await page.goto(`${BASE}/zh-CN/docs/getting-started`, { waitUntil: 'networkidle0' })
  const nav = await page.$$eval('.tb-main-nav a', (nodes) => nodes.map((node) => node.textContent))
  check('nav localized', nav.includes('文档') && nav.includes('主题编辑器'), nav.join(','))
  const updated = await page.$$eval('.tb-updated', (nodes) => nodes.map((node) => node.textContent))
  check(
    'last update localized',
    updated.some((text) => text.includes('最后更新')),
    updated.join(','),
  )
  const editLinks = await page.$$eval(
    'a[href*="github.com/innocces/tanstack-blog/edit"]',
    (nodes) => nodes.length,
  )
  check('edit link present', editLinks > 0, `${editLinks}`)
  await page.goto(`${BASE}/zh-CN/themes`, { waitUntil: 'networkidle0' })
  const names = await page.$$eval('.tb-theme-card-body strong', (nodes) =>
    nodes.slice(0, 6).map((node) => node.textContent),
  )
  check(
    'theme names localized',
    names.some((name) => /[\u4e00-\u9fff]/.test(name ?? '')),
    names.join(','),
  )

  const hreflang = await page.$$eval('link[hreflang]', (nodes) =>
    nodes.map((node) => node.getAttribute('hreflang')),
  )
  check(
    'hreflang links emitted',
    hreflang.includes('en') && hreflang.includes('zh-CN'),
    hreflang.join(','),
  )

  await page.goto(`${BASE}/zh-CN/tutorials/01-quickstart`, { waitUntil: 'networkidle0' })
  check(
    'tutorial has next link',
    (await page.$$eval('a[href*="/tutorials/"]', (nodes) => nodes.length)) > 0,
  )
}
