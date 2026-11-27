/** Project health checks and git-hook scaffolding for TanStack Blog projects. */
import { spawnSync } from 'node:child_process'
import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import * as c from 'kolorist'

type Level = 'pass' | 'warn' | 'fail' | 'info'

interface Result {
  level: Level
  label: string
  detail?: string
}

const ICON: Record<Level, string> = {
  pass: c.green('✓'),
  warn: c.yellow('!'),
  fail: c.red('✗'),
  info: c.blue('·'),
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function listMarkdown(dir: string): Promise<string[]> {
  const result: string[] = []
  try {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) result.push(...(await listMarkdown(full)))
      else if (entry.name.endsWith('.md')) result.push(path.relative(dir, full))
    }
  } catch {
    // missing dir
  }
  return result
}

function git(...args: string[]): string {
  return spawnSync('git', args, { encoding: 'utf8' }).stdout?.trim() ?? ''
}

/** Run project diagnostics. Returns a process exit code. */
export async function doctor(root = process.cwd(), quick = false): Promise<number> {
  const results: Result[] = []
  const add = (level: Level, label: string, detail?: string) =>
    results.push({ level, label, detail })

  const major = Number(process.versions.node.split('.')[0])
  add(major >= 20 ? 'pass' : 'fail', `Node ${process.versions.node}`, 'requires >= 20')

  const pkgPath = path.join(root, 'package.json')
  if (!(await exists(pkgPath))) {
    add('fail', 'package.json missing')
    return report(results)
  }
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as Record<string, unknown>
  const scripts = (pkg.scripts ?? {}) as Record<string, string>
  for (const name of ['dev', 'build', 'check']) {
    add(scripts[name] ? 'pass' : 'fail', `script ${name}`, scripts[name])
  }

  const pm = String(pkg.packageManager ?? 'pnpm')
  const lockFile = ['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'bun.lockb'].find(
    (file) => file.includes(pm.split('@')[0] ?? 'pnpm') || file.includes('lock'),
  )
  add(
    (await exists(path.join(root, lockFile ?? 'pnpm-lock.yaml'))) ? 'pass' : 'warn',
    'lockfile',
    pm,
  )

  // In a monorepo, app-level files live under apps/docs.
  const appRoot = (await exists(path.join(root, 'app.config.ts')))
    ? root
    : (await exists(path.join(root, 'apps/docs/app.config.ts')))
      ? path.join(root, 'apps/docs')
      : root
  add(appRoot === root ? 'info' : 'pass', 'app root', path.relative(root, appRoot) || '.')

  for (const file of [
    'app.config.ts',
    'vite.config.ts',
    'tsconfig.json',
    'src/routes/__root.tsx',
  ]) {
    add((await exists(path.join(appRoot, file))) ? 'pass' : 'fail', file)
  }

  const ignore = await readFile(path.join(root, '.gitignore'), 'utf8').catch(() => '')
  add(ignore.includes('.demand') ? 'pass' : 'warn', '.demand ignored')
  add(git('-C', root, 'ls-files', '.demand') ? 'fail' : 'pass', '.demand not tracked')

  if (!quick) {
    const contentDir = path.join(appRoot, 'content')
    const files = await listMarkdown(contentDir)
    add(files.length ? 'pass' : 'warn', `content files (${files.length})`)

    const en = files.filter((file) => file.startsWith('en/'))
    const missing = en.filter((file) => !files.includes(file.replace(/^en\//, 'zh-CN/')))
    add(
      missing.length ? 'warn' : 'pass',
      'zh-CN parity',
      missing.length ? `${missing.length} missing` : 'complete',
    )

    const appPkgPath = path.join(appRoot, 'package.json')
    const appPkg = appPkgPath === pkgPath ? pkg : JSON.parse(await readFile(appPkgPath, 'utf8'))
    const deps = {
      ...((appPkg.dependencies ?? {}) as object),
      ...((appPkg.devDependencies ?? {}) as object),
    }
    for (const dep of ['@tanstack/react-start', '@tanstack/react-router', '@tanstack-blog/core']) {
      add(dep in deps ? 'pass' : 'warn', `dependency ${dep}`)
    }
  }

  add(
    (await exists(path.join(root, 'packages/themes/registry.json'))) ? 'info' : 'info',
    'theme registry',
  )

  return report(results)
}

function report(results: Result[]): number {
  console.log('')
  console.log(`  ${c.bold('doctor')} ${c.dim('· project diagnostics')}`)
  console.log('')
  for (const result of results) {
    console.log(
      `  ${ICON[result.level]} ${result.label}${result.detail ? ` ${c.dim(result.detail)}` : ''}`,
    )
  }
  const failures = results.filter((result) => result.level === 'fail').length
  const warnings = results.filter((result) => result.level === 'warn').length
  console.log('')
  console.log(
    `  ${failures ? c.red(`${failures} failed`) : c.green('all checks passed')}${warnings ? ` · ${c.yellow(`${warnings} warnings`)}` : ''}`,
  )
  console.log('')
  return failures ? 1 : 0
}

/** Generate git hooks for a chosen tool. */
export async function hooks(tool: string, root = process.cwd()): Promise<void> {
  const choice = tool || 'all'
  const pkgPath = path.join(root, 'package.json')
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as Record<string, unknown>
  const scripts = (pkg.scripts ?? {}) as Record<string, string>
  const devDeps = (pkg.devDependencies ?? {}) as Record<string, string>
  scripts.doctor ??= 'create-tanstack-blog doctor --quick'
  const created: string[] = []

  if (choice === 'lefthook' || choice === 'all') {
    await writeFile(
      path.join(root, 'lefthook.yml'),
      `# Generated by create-tanstack-blog hooks\n` +
        `pre-commit:\n` +
        `  parallel: true\n` +
        `  commands:\n` +
        `    - name: lint\n      run: pnpm check\n` +
        `    - name: doctor\n      run: pnpm exec create-tanstack-blog doctor --quick\n` +
        `pre-push:\n` +
        `  commands:\n` +
        `    - name: typecheck\n      run: pnpm --filter @tanstack-blog/docs typecheck || true\n`,
    )
    devDeps.lefthook ??= '^1.0.0'
    scripts.postinstall ??= 'lefthook install'
    created.push('lefthook.yml')
  }

  if (choice === 'husky' || choice === 'all') {
    await mkdir(path.join(root, '.husky'), { recursive: true })
    await writeFile(
      path.join(root, '.husky/pre-commit'),
      `#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\npnpm check\npnpm exec create-tanstack-blog doctor --quick\n`,
      { mode: 0o755 },
    )
    devDeps.husky ??= '^9.0.0'
    scripts.prepare ??= 'husky'
    created.push('.husky/pre-commit')
  }

  if (choice === 'lint-staged' || choice === 'all') {
    await writeFile(
      path.join(root, '.lintstagedrc.json'),
      `${JSON.stringify(
        {
          '*.{ts,tsx,js,jsx,json,css,md}': ['biome check --write'],
          '**/*.md': ['biome format --write'],
        },
        null,
        2,
      )}\n`,
    )
    devDeps['lint-staged'] ??= '^15.0.0'
    created.push('.lintstagedrc.json')
  }

  if (!['lefthook', 'husky', 'lint-staged', 'all'].includes(choice)) {
    throw new Error(`Unknown hook tool: ${choice} (use lefthook | husky | lint-staged | all)`)
  }

  pkg.scripts = scripts
  pkg.devDependencies = devDeps
  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8')
  console.log(c.green(`✓ generated: ${created.join(', ')}`))
  console.log(
    c.dim(`  Added scripts.doctor and devDependencies. Run pnpm install to activate hooks.`),
  )
}
