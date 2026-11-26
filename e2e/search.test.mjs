/** Search dialog: shortcut, deep link and result scoring. */
import { BASE, sleep } from './helpers.mjs'

export default async function run(page, { check }) {
  await page.goto(`${BASE}/docs`, { waitUntil: 'networkidle0' })
  await page.keyboard.down('Control')
  await page.keyboard.press('KeyK')
  await page.keyboard.up('Control')
  await sleep(200)
  check('shortcut opens dialog', (await page.$('.tb-search-dialog')) !== null)

  await page.type('.tb-search-field input', 'theme')
  await sleep(500)
  const hits = await page.$$eval('.tb-search-result', (nodes) => nodes.length)
  check('search returns results', hits > 0, `${hits} hits`)
  check(
    'matched term highlighted',
    (await page.$$eval('.tb-search-result mark', (nodes) => nodes.length)) > 0,
  )
  const first = await page.$eval('.tb-search-result-title', (node) => node.textContent)
  check('top result is relevant', /theme/i.test(first ?? ''), first ?? '')

  await page.keyboard.press('Escape')
  await sleep(150)
  check('escape closes dialog', (await page.$('.tb-search-dialog')) === null)

  await page.goto(`${BASE}/docs?search=1&q=architecture`, { waitUntil: 'networkidle0' })
  await sleep(400)
  const deepHits = await page.$$eval('.tb-search-result', (nodes) => nodes.length)
  check('wiki pages are searchable', deepHits > 0, `${deepHits} hits`)
}
