#!/usr/bin/env node
/**
 * Visual regression for every theme at desktop and mobile viewports.
 * Baselines are committed PNGs; use `pnpm test:visual:update` after intentional UI changes.
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { BASE, launchBrowser, sleep, startServer } from '../e2e/helpers.mjs'
import { allThemes } from '../packages/themes/dist/index.js'

const UPDATE = process.argv.includes('--update')
const BASELINE = path.resolve('e2e/baselines')
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 768, height: 900 },
]
mkdirSync(BASELINE, { recursive: true })

const server = await startServer()
const browser = await launchBrowser()
let changed = 0
let checked = 0

try {
  const page = await browser.newPage()
  for (const theme of allThemes) {
    for (const viewport of VIEWPORTS) {
      await page.setViewport({ width: viewport.width, height: viewport.height })
      await page.goto(`${BASE}/themes/${theme.id}?mode=dark`, { waitUntil: 'networkidle0' })
      await sleep(120)
      const shot = await page.screenshot()
      const file = path.join(BASELINE, `${theme.id}-${viewport.name}.png`)
      const hash = createHash('sha256').update(shot).digest('hex')

      if (UPDATE || !existsSync(file)) {
        writeFileSync(file, shot)
        console.log(`baseline ${path.basename(file)}`)
        continue
      }
      const current = createHash('sha256').update(readFileSync(file)).digest('hex')
      checked += 1
      if (current !== hash) {
        changed += 1
        console.log(`✗ ${path.basename(file)} changed`)
      }
    }
  }
  await page.close()
} finally {
  await browser.close()
  server.kill()
}

console.log(`${checked} screenshots compared, ${changed} changed`)
if (changed && !UPDATE) process.exitCode = 1
