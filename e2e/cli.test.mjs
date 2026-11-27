/** CLI utility coverage: help, doctor and hook generation. */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const CLI = path.resolve('packages/cli/dist/index.js')

function run(args, cwd) {
  return execFileSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: 'utf8',
  })
}

export default async function runSuite(_page, { check }) {
  const help = run(['help'], process.cwd())
  check('cli help lists commands', help.includes('doctor') && help.includes('hooks'))

  const doctor = run(['doctor', '.'], process.cwd())
  check('doctor passes on workspace', doctor.includes('all checks passed'))

  const dir = mkdtempSync(path.join(tmpdir(), 'tb-cli-test-'))
  try {
    writeFileSync(
      path.join(dir, 'package.json'),
      `${JSON.stringify({ name: 'probe', scripts: { dev: 'vite' }, devDependencies: {} })}\n`,
    )
    const output = run(['hooks', 'all', dir], process.cwd())
    check(
      'hooks generator reports files',
      output.includes('lefthook.yml') && output.includes('.husky/pre-commit'),
    )
    const lefthook = readFileSync(path.join(dir, 'lefthook.yml'), 'utf8')
    check('lefthook config content', lefthook.includes('pre-commit') && lefthook.includes('doctor'))
    const pkg = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'))
    check('doctor script added', pkg.scripts.doctor.includes('doctor --quick'))
    check(
      'hook devDependencies added',
      Boolean(pkg.devDependencies.lefthook && pkg.devDependencies.husky),
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}
