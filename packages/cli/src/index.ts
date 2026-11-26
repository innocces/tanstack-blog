#!/usr/bin/env node
/** Interactive, Astro-inspired project scaffolder for TanStack Blog. */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  multiselect,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts'
import { buildKnowledgeBase, sniffProject } from '@tanstack-blog/kb'
import * as c from 'kolorist'
import { projectFiles, type ScaffoldOptions } from './templates.js'

const PM_CHOICES = [
  { value: 'pnpm', label: 'pnpm', hint: 'recommended · fast, strict' },
  { value: 'npm', label: 'npm', hint: 'ubiquitous' },
  { value: 'yarn', label: 'yarn', hint: 'classic' },
  { value: 'bun', label: 'bun', hint: 'bleeding edge' },
]

const THEME_CHOICES = [
  { value: 'linear', label: 'Linear', hint: 'default · warm dark' },
  { value: 'muji', label: 'MUJI', hint: 'quiet paper · light' },
  { value: 'stripe-press', label: 'Stripe Press', hint: 'warm editorial' },
  { value: 'vercel', label: 'Vercel Mesh', hint: 'high contrast · dark' },
  { value: 'bloomberg-terminal', label: 'Bloomberg Terminal', hint: 'data dense' },
  { value: 'are-na', label: 'Are.na', hint: 'honest web' },
]

const DEPLOY_CHOICES = [
  { value: 'cloudflare', label: 'Cloudflare', hint: 'Workers / Pages' },
  { value: 'vercel', label: 'Vercel', hint: 'zero config' },
  { value: 'netlify', label: 'Netlify', hint: 'jamstack' },
  { value: 'node', label: 'Node / Nitro', hint: 'any VPS' },
]

function guard<T>(value: T): Exclude<T, symbol> {
  if (isCancel(value)) {
    cancel('Cancelled. Nothing was written.')
    process.exit(0)
  }
  return value as Exclude<T, symbol>
}

/** Small branded banner; mirrors the calm, geometric TanStack aesthetic. */
function banner() {
  const accent = c.magenta('✦')
  console.log('')
  console.log(
    `  ${accent} ${c.bold(c.cyan('tanstack'))} ${c.dim('blog')}  ${c.dim('· create project')}`,
  )
  console.log(`  ${c.dim('Docs, blogs and component libraries on TanStack Start.')}`)
  console.log('')
}

/** Print a numbered stage label before a prompt. */
function step(index: number, total: number, label: string) {
  const badge = c.magenta(String(index).padStart(2, '0')) + c.dim(`/${total}`)
  log.info(`${badge}  ${c.bold(label)}`)
}

/** Non-interactive utilities: `sniff` and `kb`. */
async function runUtility(command: string): Promise<boolean> {
  if (command !== 'sniff' && command !== 'kb') return false
  const root = path.resolve(process.argv[3] ?? process.cwd())
  const snapshot = await sniffProject(root)
  if (command === 'sniff') {
    console.log(`name: ${snapshot.name}`)
    console.log(`stack: ${snapshot.frameworks.join(', ') || '(unknown)'}`)
    console.log(`scripts: ${Object.keys(snapshot.scripts).join(', ')}`)
    console.log(`packages: ${snapshot.packages.length}`)
    console.log(
      `suggested config: ${JSON.stringify({ title: snapshot.name, description: snapshot.description, modes: { docs: true, blog: false, components: false } })}`,
    )
    return true
  }
  const out = path.resolve(process.argv[4] ?? 'wiki-generated')
  await mkdir(out, { recursive: true })
  for (const page of await buildKnowledgeBase(root)) {
    await writeFile(path.join(out, `${page.id}.md`), page.markdown, 'utf8')
  }
  console.log(`generated ${out}`)
  return true
}

async function main() {
  if (await runUtility(process.argv[2] ?? '')) return
  banner()
  intro(c.bold('Let’s build something delightful.'))

  const total = 8
  const nameArg = process.argv[2]
  step(1, total, 'Project identity')
  const name = nameArg
    ? nameArg
    : guard(
        await text({
          message: 'What should your project be called?',
          placeholder: 'my-docs',
          validate: (value) => (!value?.trim() ? 'A project name is required' : undefined),
        }),
      )

  step(2, total, 'Tooling')
  const packageManager = guard(
    await select({
      message: 'Package manager',
      options: PM_CHOICES,
      initialValue: 'pnpm',
    }),
  )

  step(3, total, 'Content modes')
  const modes = guard(
    await multiselect({
      message: 'What are you building? (space to toggle)',
      options: [
        { value: 'docs', label: 'Documentation', hint: 'sidebar · TOC · prev/next' },
        { value: 'blog', label: 'Blog', hint: 'tags · dates · reading time' },
        { value: 'components', label: 'Component library', hint: 'gallery pages' },
      ],
      initialValues: ['docs', 'blog'],
      required: true,
    }),
  )

  step(4, total, 'Appearance')
  const theme = guard(
    await select({ message: 'Default theme', options: THEME_CHOICES, initialValue: 'linear' }),
  )

  step(5, total, 'Languages')
  const locales = guard(
    await multiselect({
      message: 'Which languages? (space to toggle)',
      options: [
        { value: 'en', label: 'English' },
        { value: 'zh-CN', label: '简体中文' },
        { value: 'ja', label: '日本語' },
        { value: 'de', label: 'Deutsch' },
      ],
      initialValues: ['en'],
      required: true,
    }),
  )

  step(6, total, 'Search')
  const search = guard(
    await select({
      message: 'Search backend',
      options: [
        { value: 'orama', label: 'Orama', hint: 'full-text · typo tolerant' },
        { value: 'local', label: 'Local', hint: 'zero dependencies' },
        { value: 'none', label: 'Disabled', hint: 'no search UI' },
      ],
      initialValue: 'orama',
    }),
  )

  step(7, total, 'Deployment')
  const deploy = guard(
    await select({
      message: 'Where will you deploy?',
      options: DEPLOY_CHOICES,
      initialValue: 'cloudflare',
    }),
  )

  step(8, total, 'Final touch')
  const git = guard(await confirm({ message: 'Initialize a git repository?', initialValue: true }))

  const options: ScaffoldOptions = {
    name: String(name),
    packageManager: packageManager as ScaffoldOptions['packageManager'],
    modes: {
      docs: (modes as string[]).includes('docs'),
      blog: (modes as string[]).includes('blog'),
      components: (modes as string[]).includes('components'),
    },
    theme: theme as string,
    locales: locales as string[],
    search: search as ScaffoldOptions['search'],
    deploy: deploy as ScaffoldOptions['deploy'],
    git,
  }

  const target = path.resolve(process.cwd(), options.name)
  const loading = spinner()
  loading.start('Writing configuration and routes')
  const files = projectFiles(options)
  for (const [relative, content] of Object.entries(files)) {
    const absolute = path.join(target, relative)
    await mkdir(path.dirname(absolute), { recursive: true })
    await writeFile(absolute, content, 'utf8')
  }
  loading.message('Preparing Markdown content')
  loading.message('Wiring themes and search')
  loading.stop('Project ready')

  if (git) {
    const { spawnSync } = await import('node:child_process')
    spawnSync('git', ['init'], { cwd: target, stdio: 'ignore' })
  }

  log.success(`${c.bold(options.name)} created at ${c.dim(target)}`)
  outro(
    [
      '',
      `  ${c.magenta('▸')} cd ${options.name}`,
      `  ${c.magenta('▸')} pnpm install`,
      `  ${c.magenta('▸')} pnpm dev`,
      '',
      c.dim('  Happy building with TanStack.'),
    ].join('\n'),
  )
}

main().catch((error) => {
  log.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
