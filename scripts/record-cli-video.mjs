#!/usr/bin/env node
/**
 * Record a REAL CLI session as an MP4.
 *
 * The terminal process is driven through a pseudo-terminal by cli-transcript.py;
 * this script replays that captured output frame-by-frame in headless Chrome and
 * encodes the frames with ffmpeg. No synthetic typing, no hand-written video.
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const FFMPEG =
  process.env.FFMPEG_PATH ??
  spawnSync('node', ['-e', 'process.stdout.write(require("ffmpeg-static"))'], {
    encoding: 'utf8',
  }).stdout.trim()
const ROOT = process.cwd()
const FRAMES = path.join(ROOT, '.video-frames')
const OUT_DIR = path.join(ROOT, 'apps/docs/public/videos')
const FPS = 8

function transcript(profile) {
  const result = spawnSync('python3', ['scripts/cli-transcript.py', profile], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  })
  if (result.status !== 0) throw new Error(result.stderr || 'transcript capture failed')
  return JSON.parse(result.stdout)
}

function html(timeline) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;width:1280px;height:720px;overflow:hidden;background:#08090a;
      font-family:'JetBrains Mono',ui-monospace,monospace}
    .label{position:absolute;left:70px;top:40px;color:#5e6ad2;font-size:15px;letter-spacing:.16em;text-transform:uppercase}
    .window{position:absolute;left:60px;top:78px;right:60px;bottom:60px;border:1px solid rgba(255,255,255,.1);
      border-radius:14px;background:#101116;box-shadow:0 30px 80px rgba(0,0,0,.5);overflow:hidden}
    .bar{height:40px;display:flex;align-items:center;gap:8px;padding:0 16px;border-bottom:1px solid rgba(255,255,255,.08);background:#16171c}
    .dot{width:10px;height:10px;border-radius:50%}
    .title{margin-left:14px;color:#6b7280;font-size:12px}
    pre{margin:0;padding:24px 28px;color:#d7ece8;font-size:15px;line-height:1.6;white-space:pre-wrap;word-break:break-word}
    pre::after{content:'▋';color:#5e6ad2;animation:blink 1s steps(1) infinite}
    @keyframes blink{50%{opacity:0}}
  </style></head><body>
    <div class="label">Real CLI session · recorded</div>
    <div class="window"><div class="bar">
      <span class="dot" style="background:#ff5f57"></span><span class="dot" style="background:#febc2e"></span>
      <span class="dot" style="background:#28c840"></span><span class="title">create-tanstack-blog — zsh</span>
    </div><pre id="term"></pre></div>
    <script>
      const timeline = ${JSON.stringify(timeline)};
      window.seek = (t) => {
        let i = 0;
        while (i + 1 < timeline.length && timeline[i + 1].t <= t) i++;
        document.getElementById('term').textContent = (timeline[i]?.lines || []).join('\\n');
      };
      window.seek(0);
    </script>
  </body></html>`
}

async function record(profile, output) {
  const data = transcript(profile)
  rmSync(FRAMES, { recursive: true, force: true })
  mkdirSync(FRAMES, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })
  await page.setContent(html(data.timeline), { waitUntil: 'load' })

  const duration = Math.max(...data.timeline.map((entry) => entry.t)) + 1.5
  const total = Math.ceil(duration * FPS)
  for (let frame = 0; frame < total; frame += 1) {
    await page.evaluate((t) => window.seek(t), frame / FPS)
    await page.screenshot({ path: path.join(FRAMES, `f-${String(frame).padStart(5, '0')}.png`) })
  }
  await browser.close()

  const result = spawnSync(
    FFMPEG,
    [
      '-y',
      '-loglevel',
      'error',
      '-framerate',
      String(FPS),
      '-i',
      path.join(FRAMES, 'f-%05d.png'),
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '22',
      output,
    ],
    { stdio: 'inherit' },
  )
  if (result.status !== 0) throw new Error('ffmpeg encode failed')
  rmSync(FRAMES, { recursive: true, force: true })
  console.log(`recorded ${path.relative(ROOT, output)} (${total} real CLI frames)`)
}

mkdirSync(OUT_DIR, { recursive: true })
await record('default', path.join(OUT_DIR, 'quickstart.mp4'))
await record('muji', path.join(OUT_DIR, 'themes.mp4'))
