/** Sidebar, layout, blog filters, feedback and generated assets. */
import { BASE } from './helpers.mjs'

export default async function run(page, { check }) {
  await page.goto(`${BASE}/docs/getting-started`, { waitUntil: 'networkidle0' })
  const groups = await page.$$('.tb-sidebar-group-toggle')
  check('docs have secondary menus', groups.length >= 3, `${groups.length} groups`)
  await groups[0].click()
  const expanded = await page.$eval('.tb-sidebar-group-toggle', (node) =>
    node.getAttribute('aria-expanded'),
  )
  check('group collapses', expanded === 'false', String(expanded))

  const height = await page.evaluate(() => ({
    body: document.body.scrollHeight,
    viewport: window.innerHeight,
  }))
  check('layout fills viewport', height.body >= height.viewport, `${height.body}px`)

  const copyButtons = await page.$$('.tb-copy-code')
  check('code blocks have copy buttons', copyButtons.length > 0, `${copyButtons.length} buttons`)

  await page.goto(`${BASE}/docs/configuration`, { waitUntil: 'networkidle0' })
  check('feedback widget present', (await page.$('.tb-feedback')) !== null)

  await page.goto(`${BASE}/blog?tag=tanstack`, { waitUntil: 'networkidle0' })
  const filtered = await page.$$('.tb-post-card')
  check(
    'blog tag filter works',
    filtered.length > 0 && filtered.length < 3,
    `${filtered.length} posts`,
  )

  // TOC sits immediately to the right of the reading column.
  await page.goto(`${BASE}/docs/getting-started`, { waitUntil: 'networkidle0' })
  const columns = await page.evaluate(() => {
    const main = document.querySelector('.tb-main')?.getBoundingClientRect()
    const toc = document.querySelector('.tb-toc')?.getBoundingClientRect()
    return main && toc ? { mainRight: main.right, tocLeft: toc.left } : null
  })
  check(
    'TOC is right of content',
    columns !== null && columns.tocLeft >= columns.mainRight,
    JSON.stringify(columns),
  )

  // Component examples + generated props table.
  await page.goto(`${BASE}/components/dropdown`, { waitUntil: 'networkidle0' })
  const rows = await page.$$eval('.tb-api-table tbody tr', (nodes) => nodes.length)
  check('props table generated from TSDoc', rows >= 3, `${rows} rows`)
  check('live ui example rendered', (await page.$('.tb-demo-frame')) !== null)

  // Package-manager tabs and playground actions.
  await page.goto(`${BASE}/docs/cli`, { waitUntil: 'networkidle0' })
  const tabs = await page.$$eval('.tb-code-tabs', (nodes) => nodes.length)
  check('npm2yarn command tabs', tabs > 0, `${tabs} blocks`)
  const actions = await page.$$eval(
    '.tb-code-actions button, .tb-code-actions a',
    (nodes) => nodes.length,
  )
  check('code playground actions', actions > 0, `${actions} actions`)

  for (const name of ['sitemap.xml', 'rss.xml', 'llms.txt']) {
    const response = await fetch(`${BASE}/${name}`)
    check(`generated ${name}`, response.ok, String(response.status))
  }
  for (const name of ['quickstart.mp4', 'themes.mp4']) {
    const response = await fetch(`${BASE}/videos/${name}`)
    const length = Number(response.headers.get('content-length'))
    check(`real CLI video ${name}`, response.ok && length > 10000, `${length} bytes`)
  }
}
