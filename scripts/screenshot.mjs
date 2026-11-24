#!/usr/bin/env node
/**
 * Capture the README screenshots from a running dev server.
 *
 * Every published image is a composite: the dark theme fills the upper-left
 * triangle and the light theme fills the lower-right one, split diagonally.
 * Both halves are captured from the real app, then layered with CSS clip-path
 * by headless Chrome so no image-processing dependency is needed.
 *
 * Also captures one preview screenshot per theme in `docs/screenshots/themes/`.
 * Requires Google Chrome on macOS (override with CHROME_PATH).
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const OUT = path.resolve('docs/screenshots')
const RAW = path.join(OUT, '.raw')
const THEMES_OUT = path.join(OUT, 'themes')

mkdirSync(RAW, { recursive: true })
mkdirSync(THEMES_OUT, { recursive: true })

function capture(output, url, width = 1440, height = 1000) {
  const result = spawnSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      `--window-size=${width},${height}`,
      '--virtual-time-budget=7000',
      `--screenshot=${output}`,
      url,
    ],
    { stdio: 'ignore' },
  )
  if (result.status !== 0) throw new Error(`Screenshot failed: ${path.basename(output)}`)
}

/** Capture two modes of one URL and stitch them along the diagonal. */
function diagonal(name, route, dir = OUT, width = 1440, height = 1000) {
  const dark = path.join(RAW, `${name}.dark.png`)
  const light = path.join(RAW, `${name}.light.png`)
  capture(dark, `${BASE}${route}${route.includes('?') ? '&' : '?'}mode=dark`, width, height)
  capture(light, `${BASE}${route}${route.includes('?') ? '&' : '?'}mode=light`, width, height)

  const compose = path.join(RAW, `${name}.html`)
  writeFileSync(
    compose,
    `<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{margin:0;padding:0;width:${width}px;height:${height}px;overflow:hidden;background:#000}
      img{position:absolute;left:0;top:0;width:${width}px;height:${height}px;object-fit:cover}
      .dark{clip-path:polygon(0 0, 100% 0, 0 100%)}
      .light{clip-path:polygon(100% 0, 100% 100%, 0 100%)}
    </style></head><body>
      <img class="dark" src="${dark}">
      <img class="light" src="${light}">
    </body></html>`,
    'utf8',
  )
  capture(path.join(dir, `${name}.png`), `file://${compose}`, width, height)
  console.log(`captured ${name}.png (diagonal dark/light composite)`)
}

const shots = [
  ['docs-linear', '/docs/getting-started?theme=linear'],
  ['themes', '/themes?theme=linear'],
  ['docs-muji', '/docs/getting-started?theme=muji'],
  ['search', '/docs?theme=linear&search=1&q=theme'],
]

for (const [name, route] of shots) diagonal(name, route)

/** All 25 themes get their own preview screenshot. */
const presetFile = path.resolve('packages/themes/src/presets.ts')
const source = readFileSync(presetFile, 'utf8')
const ids = [...source.matchAll(/^\s{4}id: '([^']+)',/gm)].map((match) => match[1])
console.log(`capturing ${ids.length} theme previews`)
for (const id of ids) diagonal(id, `/themes/${id}`, THEMES_OUT, 1200, 760)

rmSync(RAW, { recursive: true, force: true })
