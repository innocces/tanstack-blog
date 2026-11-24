#!/usr/bin/env node
/** Run each feature suite in its own page against one dev server. */
import { createChecker, launchBrowser, startServer } from './helpers.mjs'

const suites = [
  ['routes', './routes.test.mjs'],
  ['theme', './theme.test.mjs'],
  ['i18n', './i18n.test.mjs'],
  ['search', './search.test.mjs'],
  ['navigation', './navigation.test.mjs'],
]

const server = await startServer()
const browser = await launchBrowser()
const all = []

try {
  for (const [name, file] of suites) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    const checker = createChecker(name)
    const suite = await import(file)
    await suite.default(page, checker)
    all.push(...checker.results)
    await page.close()
  }
} finally {
  await browser.close()
  server.kill()
}

const failed = all.filter((result) => !result.ok)
console.log(`\n${all.length - failed.length}/${all.length} checks passed`)
if (failed.length) process.exitCode = 1
