#!/usr/bin/env node
/**
 * Conventional-commits release helper.
 * Computes the next version, updates package versions, generates CHANGELOG.md
 * and (with --apply) commits + tags the release.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const APPLY = process.argv.includes('--apply')
const ROOT = process.cwd()

function git(...args) {
  try {
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()
  } catch {
    return ''
  }
}

function bump(version, type) {
  const [major, minor, patch] = version.split('.').map(Number)
  if (type === 'major') return `${major + 1}.0.0`
  if (type === 'minor') return `${major}.${minor + 1}.0`
  return `${major}.${minor}.${patch + 1}`
}

const packageJson = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
const current = packageJson.version ?? '0.0.0'
const lastTag = git('describe', '--tags', '--abbrev=0')
const logArgs = lastTag ? [`${lastTag}..HEAD`] : []
const commits = git('log', ...logArgs, '--pretty=format:%s%n%b')
  .split('\n')
  .filter(Boolean)

let type = 'patch'
for (const line of commits) {
  if (/BREAKING CHANGE|^\w+(\([^)]*\))?!:/.test(line)) type = 'major'
  else if (/^feat(\([^)]*\))?:/.test(line) && type !== 'major') type = 'minor'
}
if (
  commits.length &&
  !commits.some((line) =>
    /^(feat|fix|perf|refactor|build|chore|docs|test|ci)(\([^)]*\))?:/.test(line),
  )
) {
  type = 'none'
}

const next = type === 'none' ? current : bump(current, type)
const date = new Date().toISOString().slice(0, 10)

console.log(`last tag: ${lastTag || '(none)'}`)
console.log(`commits:  ${commits.length}`)
console.log(`bump:     ${type} -> ${next}`)

if (!APPLY || type === 'none') process.exit(0)

const packages = [
  'package.json',
  ...execFileSync('find', ['packages', 'apps', '-name', 'package.json'], {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .filter(Boolean),
]
for (const file of packages) {
  const full = path.join(ROOT, file)
  const data = JSON.parse(readFileSync(full, 'utf8'))
  data.version = next
  writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

const sections = commits
  .filter((line) => /^\w+(\([^)]*\))?:/.test(line))
  .map((line) => `- ${line}`)
  .join('\n')
const changelogPath = path.join(ROOT, 'CHANGELOG.md')
const existing = readFileSync(changelogPath, 'utf8')
writeFileSync(
  changelogPath,
  `## ${next} (${date})\n\n${sections || '- Maintenance'}\n\n${existing}`,
  'utf8',
)

git('add', '-A')
git('commit', '-m', `chore(release): ${next}`)
git('tag', `-a`, `v${next}`, '-m', `v${next}`)
console.log(`created tag v${next}`)
