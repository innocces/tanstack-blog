/**
 * Deterministic project analysis and knowledge-base generation.
 *
 * No LLM, no network, no embeddings: everything is derived from package.json,
 * the file tree and exported symbols. Output is plain Markdown, so it can be
 * published to the site, GitHub Wiki or any static host.
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

export interface PackageInfo {
  name: string
  version?: string
  description?: string
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

export interface SourcePackage {
  name: string
  directory: string
  files: number
  exports: string[]
}

export interface ProjectSnapshot {
  root: string
  name: string
  description: string
  packageManager: string
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  frameworks: string[]
  packages: SourcePackage[]
  fileCount: number
  filesByExtension: Record<string, number>
  readme: string
  gitRemote: string
}

export interface KnowledgePage {
  id: string
  title: string
  route: string
  markdown: string
  headings: string[]
}

const IGNORE = new Set(['node_modules', 'dist', '.output', '.git', '.demand', 'wiki', '.wrangler'])

async function walk(dir: string): Promise<string[]> {
  const children = await readdir(dir, { withFileTypes: true })
  const result: string[] = []
  for (const child of children) {
    if (IGNORE.has(child.name)) continue
    const full = path.join(dir, child.name)
    if (child.isDirectory()) result.push(...(await walk(full)))
    else result.push(full)
  }
  return result
}

async function safeJson(file: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}

function record(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object') return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, String(item)]),
  )
}

const FRAMEWORK_HINTS: Record<string, string> = {
  '@tanstack/react-start': 'TanStack Start',
  '@tanstack/react-router': 'TanStack Router',
  '@tanstack/markdown': 'TanStack Markdown',
  react: 'React',
  vue: 'Vue',
  svelte: 'Svelte',
  next: 'Next.js',
  nuxt: 'Nuxt',
  astro: 'Astro',
  vite: 'Vite',
}

function detectFrameworks(deps: Record<string, string>): string[] {
  return [
    ...new Set(
      Object.keys(deps)
        .map((name) => FRAMEWORK_HINTS[name])
        .filter((item): item is string => Boolean(item)),
    ),
  ]
}

/** Inspect a repository and return a serializable snapshot. */
export async function sniffProject(root: string): Promise<ProjectSnapshot> {
  const pkg = (await safeJson(path.join(root, 'package.json'))) ?? {}
  const files = await walk(root)
  const readmePath = files.find((file) => /readme(\.zh-CN)?\.md$/i.test(path.basename(file)))
  const readme = readmePath ? await readFile(readmePath, 'utf8') : ''
  const gitConfig = await readFile(path.join(root, '.git/config'), 'utf8').catch(() => '')
  const gitRemote = gitConfig.match(/url = (.+)/)?.[1]?.trim() ?? ''

  const extensions: Record<string, number> = {}
  for (const file of files) {
    const ext = path.extname(file) || '(none)'
    extensions[ext] = (extensions[ext] ?? 0) + 1
  }

  const packages: SourcePackage[] = []
  const workspaceRoots = ['packages', 'apps', 'examples'].map((name) => path.join(root, name))
  for (const dir of workspaceRoots) {
    const children = await readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const child of children) {
      if (!child.isDirectory()) continue
      const packageDir = path.join(dir, child.name)
      const manifest = (await safeJson(path.join(packageDir, 'package.json'))) ?? {}
      if (!manifest.name) continue
      const sourceFiles = (await walk(packageDir)).filter((file) => /\.(ts|tsx|js|jsx)$/.test(file))
      const exports = new Set<string>()
      for (const file of sourceFiles) {
        const source = await readFile(file, 'utf8').catch(() => '')
        for (const match of source.matchAll(
          /export\s+(?:declare\s+)?(?:async\s+)?(?:function|const|class|interface|type)\s+(\w+)/g,
        )) {
          exports.add(match[1]!)
        }
      }
      packages.push({
        name: String(manifest.name),
        directory: path.relative(root, packageDir),
        files: sourceFiles.length,
        exports: [...exports].sort(),
      })
    }
  }

  const dependencies = { ...record(pkg.dependencies), ...record(pkg.devDependencies) }
  return {
    root,
    name: String(pkg.name ?? path.basename(root)),
    description: String(pkg.description ?? ''),
    packageManager: String(pkg.packageManager ?? 'pnpm'),
    scripts: record(pkg.scripts),
    dependencies: record(pkg.dependencies),
    devDependencies: record(pkg.devDependencies),
    frameworks: detectFrameworks(dependencies),
    packages,
    fileCount: files.length,
    filesByExtension: Object.fromEntries(Object.entries(extensions).sort((a, b) => b[1] - a[1])),
    readme,
    gitRemote,
  }
}

function headings(markdown: string): string[] {
  return [...markdown.matchAll(/^#{1,3}\s+(.+)$/gm)].map((match) => match[1]!.trim())
}

/** Turn a snapshot into readable Markdown pages — no model involved. */
export function generateKnowledgeBase(snapshot: ProjectSnapshot): KnowledgePage[] {
  const pages: KnowledgePage[] = []
  const add = (id: string, title: string, markdown: string) => {
    pages.push({
      id,
      title,
      route: `/wiki/${id === 'overview' ? '' : id}`.replace(/\/$/, '') || '/wiki',
      markdown,
      headings: headings(markdown),
    })
  }

  add(
    'overview',
    'Project overview',
    `# ${snapshot.name}\n\n${snapshot.description || 'Auto-generated from the repository manifest.'}\n\n` +
      `## Detected stack\n\n${snapshot.frameworks.map((item) => `- ${item}`).join('\n') || '- No known framework detected'}\n\n` +
      `## Size\n\n- ${snapshot.fileCount} tracked files\n- ${snapshot.packages.length} workspace packages\n- Source: ${snapshot.gitRemote || 'local only'}\n\n` +
      `## Quick commands\n\n${Object.entries(snapshot.scripts)
        .map(([name, command]) => `- \`pnpm ${name}\` → \`${command}\``)
        .join('\n')}\n`,
  )

  add(
    'architecture',
    'Architecture',
    `# Architecture\n\n## Workspace packages\n\n| Package | Directory | Source files | Exports |\n| --- | --- | --- | --- |\n` +
      snapshot.packages
        .map(
          (item) =>
            `| ${item.name} | ${item.directory} | ${item.files} | ${item.exports.slice(0, 6).join(', ')}${item.exports.length > 6 ? '…' : ''} |`,
        )
        .join('\n') +
      `\n\n## File types\n\n| Extension | Count |\n| --- | --- |\n` +
      Object.entries(snapshot.filesByExtension)
        .slice(0, 12)
        .map(([ext, count]) => `| ${ext} | ${count} |`)
        .join('\n'),
  )

  add(
    'api',
    'Exported API',
    `# Exported API\n\n${snapshot.packages
      .map(
        (item) =>
          `## ${item.name}\n\n${item.exports.length ? item.exports.map((name) => `- \`${name}\``).join('\n') : '_No named exports detected._'}\n`,
      )
      .join('\n')}`,
  )

  add(
    'dependencies',
    'Dependencies',
    `# Dependencies\n\n## Runtime\n\n| Package | Range |\n| --- | --- |\n` +
      Object.entries(snapshot.dependencies)
        .map(([name, range]) => `| ${name} | ${range} |`)
        .join('\n') +
      `\n\n## Development\n\n| Package | Range |\n| --- | --- |\n` +
      Object.entries(snapshot.devDependencies)
        .map(([name, range]) => `| ${name} | ${range} |`)
        .join('\n'),
  )

  add(
    'glossary',
    'Glossary',
    `# Glossary\n\n${
      snapshot.frameworks
        .map(
          (item) =>
            `## ${item}\n\nDetected from the project manifest. See the dependency table for exact versions.`,
        )
        .join('\n\n') || '_No known frameworks detected._'
    }`,
  )

  return pages
}

/** One-call helper used by the Vite plugin and the CLI. */
export async function buildKnowledgeBase(root: string): Promise<KnowledgePage[]> {
  return generateKnowledgeBase(await sniffProject(root))
}
