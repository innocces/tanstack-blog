/**
 * Vite integration. Generates virtual modules from the content directory so
 * applications never hand-maintain route or search manifests.
 *
 * Virtual modules:
 *   virtual:tanstack-blog/config       -> resolved config object
 *   virtual:tanstack-blog/content      -> serialized content collection
 *   virtual:tanstack-blog/search-data  -> search documents for the active provider
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { renderHtml } from '@tanstack/markdown/html'
import { buildKnowledgeBase } from '@tanstack-blog/kb'
import { createSearchIndex, serializeIndex } from '@tanstack-blog/orama-search'
import { type SearchDocument, toSearchDocuments } from '@tanstack-blog/search'
import type { Plugin } from 'vite'
import { type PressConfig, type PressConfigInput, resolveConfig } from './config.js'
import { type ContentCollection, type ContentEntry, collectContent } from './content/index.js'

export const virtualModules = {
  config: 'virtual:tanstack-blog/config',
  content: 'virtual:tanstack-blog/content',
  search: 'virtual:tanstack-blog/search-data',
  wiki: 'virtual:tanstack-blog/wiki',
} as const

const resolvedIds: Record<string, string> = {
  [virtualModules.config]: `\0${virtualModules.config}`,
  [virtualModules.content]: `\0${virtualModules.content}`,
  [virtualModules.search]: `\0${virtualModules.search}`,
  [virtualModules.wiki]: `\0${virtualModules.wiki}`,
}

export interface BlogPluginOptions {
  /** User configuration, normally imported from `app.config.ts`. */
  config: PressConfigInput
  /** Override the Vite root (defaults to Vite's resolved root). */
  root?: string
}

interface Snapshot {
  config: PressConfig
  entries: ContentEntry[]
  collection: Pick<ContentCollection, 'entries' | 'get' | 'byType' | 'siblings'>
  search: SearchDocument[]
  wiki: Array<{ id: string; title: string; route: string; html: string; headings: string[] }>
}

export function tanstackBlog(options: BlogPluginOptions): Plugin {
  const config = resolveConfig(options.config)
  let root = options.root ?? process.cwd()
  let contentRoot = path.resolve(root, config.contentDir)
  let snapshot: Snapshot | undefined
  /** Module source is prepared eagerly so the `load` hook stays synchronous. */
  const modules: Record<string, string> = {}

  async function buildSnapshot(): Promise<void> {
    const collection = await collectContent(config, contentRoot)
    const search = toSearchDocuments(collection.entries, config.search.includeContent)
    const wiki = (await buildKnowledgeBase(contentRoot)).map((page) => ({
      id: page.id,
      title: page.title,
      route: page.route,
      html: renderHtml(page.markdown, { headingAnchors: true }),
      headings: page.headings,
    }))
    search.push(
      ...wiki.map((page) => ({
        id: `wiki:${page.id}`,
        title: page.title,
        description: page.headings[0] ?? '',
        content: page.html.replace(/<[^>]+>/g, ' ').slice(0, 400),
        section: 'wiki',
        locale: config.i18n.defaultLocale,
        route: page.route,
      })),
    )
    snapshot = {
      config,
      entries: collection.entries,
      collection,
      search,
      wiki,
    }
    modules[resolvedIds[virtualModules.config]!] = `export default ${JSON.stringify(config)}`
    modules[resolvedIds[virtualModules.content]!] =
      `import { createCollection } from '@tanstack-blog/core/content/collection';
export const entries = ${JSON.stringify(collection.entries)};
export const content = createCollection(entries);
export default content;`
    modules[resolvedIds[virtualModules.search]!] = `export default ${JSON.stringify(search)}`
    modules[resolvedIds[virtualModules.wiki]!] = `export default ${JSON.stringify(wiki)}`
  }

  async function ensureSnapshot(): Promise<void> {
    if (!snapshot) await buildSnapshot()
  }

  return {
    name: 'tanstack-blog',
    enforce: 'pre',

    configResolved(resolved) {
      if (!options.root) root = resolved.root
      contentRoot = path.resolve(root, config.contentDir)
    },

    async buildStart() {
      await buildSnapshot()
      for (const entry of snapshot?.entries ?? []) {
        this.addWatchFile(path.join(contentRoot, entry.file))
      }
    },

    resolveId(id) {
      return resolvedIds[id] ?? null
    },

    load(id) {
      return modules[id] ?? null
    },

    /** Emit sitemap, RSS and llms.txt alongside the static output. */
    async closeBundle() {
      if (!snapshot || !config.siteUrl) return
      const base = config.siteUrl.replace(/\/$/, '')
      const entries = snapshot.entries.filter((entry) => !entry.draft)
      const escapeXml = (value: string) =>
        value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
  ...entries.map((entry) => `  <url><loc>${base}${entry.route}</loc></url>`),
  ...snapshot.wiki.map((page) => `  <url><loc>${base}${page.route}</loc></url>`),
].join('\n')}
</urlset>
`
      const posts = entries.filter((entry) => entry.type === 'blog')
      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${escapeXml(config.title)}</title><link>${base}</link>
  <description>${escapeXml(config.description)}</description>
${posts
  .map(
    (post) => `  <item><title>${escapeXml(post.title)}</title><link>${base}${post.route}</link>
    <description>${escapeXml(post.description)}</description></item>`,
  )
  .join('\n')}
</channel></rss>
`
      const docs = entries.filter((entry) => entry.type === 'docs')
      const llms = `# ${config.title}\n\n${config.description}\n\n${docs
        .map((entry) => `- [${entry.title}](${base}${entry.route}): ${entry.description}`)
        .join('\n')}\n`
      const llmsFull = `# ${config.title} — full documentation\n\n${docs
        .map((entry) => `## ${entry.title}\n\nSource: ${base}${entry.route}\n\n${entry.excerpt}\n`)
        .join('\n')}\n`
      const robots = `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`

      const outDir = path.resolve(root, '.output/public')
      await mkdir(outDir, { recursive: true })
      const writes = [
        writeFile(path.join(outDir, 'sitemap.xml'), sitemap, 'utf8'),
        writeFile(path.join(outDir, 'rss.xml'), rss, 'utf8'),
        writeFile(path.join(outDir, 'llms.txt'), llms, 'utf8'),
        writeFile(path.join(outDir, 'llms-full.txt'), llmsFull, 'utf8'),
        writeFile(path.join(outDir, 'robots.txt'), robots, 'utf8'),
      ]
      // Pre-serialized Orama index for large corpora; clients can skip the build step.
      if (config.search.provider === 'orama') {
        const index = await createSearchIndex(snapshot.search)
        writes.push(
          writeFile(path.join(outDir, 'search-index.json'), serializeIndex(index), 'utf8'),
        )
      }
      // Theme marketplace metadata for third-party discovery.
      const registry = await readFile(
        path.resolve(root, '../packages/themes/registry.json'),
        'utf8',
      ).catch(() => null)
      if (registry)
        writes.push(writeFile(path.join(outDir, 'theme-registry.json'), registry, 'utf8'))
      await Promise.all(writes)
    },

    configureServer(server) {
      server.watcher.add(contentRoot)
      server.watcher.on('all', (event, file) => {
        if (!file.startsWith(contentRoot) || !file.endsWith('.md')) return
        if (!['add', 'change', 'unlink'].includes(event)) return
        snapshot = undefined
        void ensureSnapshot()
        for (const id of Object.values(resolvedIds)) {
          const module = server.moduleGraph.getModuleById(id)
          if (module) server.moduleGraph.invalidateModule(module)
        }
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}
