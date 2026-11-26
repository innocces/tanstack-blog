/** Shared E2E helpers: server lifecycle, browser launch and assertions. */
import { spawn } from 'node:child_process'
import puppeteer from 'puppeteer-core'

export const BASE = 'http://localhost:3000'
export const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function createChecker(suite) {
  const results = []
  return {
    results,
    check(name, condition, detail = '') {
      results.push({ suite, name, ok: Boolean(condition), detail })
      console.log(`${condition ? '✓' : '✗'} [${suite}] ${name}${detail ? ` — ${detail}` : ''}`)
    },
  }
}

export async function startServer() {
  const server = spawn(
    process.execPath,
    ['node_modules/vite/bin/vite.js', 'dev', '--port', '3000', '--strictPort'],
    {
      cwd: new URL('../apps/docs', import.meta.url).pathname,
      stdio: 'ignore',
    },
  )
  for (let i = 0; i < 60; i += 1) {
    try {
      const response = await fetch(BASE)
      if (response.ok) return server
    } catch {
      // not ready
    }
    await sleep(500)
  }
  server.kill()
  throw new Error('Dev server did not start')
}

export async function launchBrowser() {
  return puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  })
}
