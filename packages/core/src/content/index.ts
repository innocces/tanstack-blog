/**
 * Node-only content pipeline: Markdown on disk -> serializable entries.
 *
 * Parsing and highlighting happen once at build time. The browser receives
 * plain JSON (HTML strings + TOC), which keeps the client bundle tiny and
 * makes SSR output identical to the static output.
 *
 * Browser code must import the `collection` subpath instead of this module.
 */
import { type Dirent, promises as fs } from 'node:fs'
import path from 'node:path'
import { createHighlighter } from '@tanstack/highlight/core'
import { html as htmlLanguage } from '@tanstack/highlight/languages/html'
import { js as jsLanguage } from '@tanstack/highlight/languages/js'
import { plaintext } from '@tanstack/highlight/languages/plaintext'
import { ts as tsLanguage } from '@tanstack/highlight/languages/ts'
import { tsx as tsxLanguage } from '@tanstack/highlight/languages/tsx'
import { createTanStackMarkdownHighlighter } from '@tanstack/highlight/markdown'
import type { CodeHighlighter } from '@tanstack/markdown'
import { docsMarkdownExtensions } from '@tanstack/markdown/extensions/docs'
import { renderHtml } from '@tanstack/markdown/html'
import { parseMarkdown } from '@tanstack/markdown/parser'
import matter from 'gray-matter'
import { localePrefix, type PressConfig } from '../config.js'
import {
  type ContentCollection,
  type ContentEntry,
  type ContentType,
  createCollection,
  type Heading,
} from './collection.js'

export {
  type ContentCollection,
  type ContentEntry,
  type ContentType,
  createCollection,
  type Heading,
  slugify,
} from './collection.js'

const extensions = docsMarkdownExtensions()

const highlighter: CodeHighlighter = createTanStackMarkdownHighlighter(
  createHighlighter({
    languages: [plaintext, htmlLanguage, jsLanguage, tsLanguage, tsxLanguage],
  }),
)

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string')
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  return []
}

function estimateReadingTime(source: string): number {
  const words = source.trim().split(/\s+/u).length
  const cjk = (source.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu) ?? [])
    .length
  return Math.max(1, Math.ceil(words / 220 + cjk / 400))
}

function stripMarkdown(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^[#>\s*-]+/gm, '')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function walk(dir: string): Promise<string[]> {
  let children: Dirent[]
  try {
    children = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
  const files: string[] = []
  for (const child of children) {
    if (child.name.startsWith('.') || child.name.startsWith('_')) continue
    const full = path.join(dir, child.name)
    if (child.isDirectory()) files.push(...(await walk(full)))
    else if (child.name.endsWith('.md')) files.push(full)
  }
  return files
}

function inferLocale(config: PressConfig, relative: string): { locale: string; rest: string[] } {
  const segments = relative.split(path.sep)
  const first = segments[0]
  if (first && config.i18n.locales.some((item) => item.code === first)) {
    return { locale: first, rest: segments.slice(1) }
  }
  return { locale: config.i18n.defaultLocale, rest: segments }
}

function inferType(rest: string[]): ContentType {
  const first = rest[0] ?? ''
  if (first === 'blog' || first === 'posts') return 'blog'
  if (first === 'docs' || first === 'guide' || first === 'guides') return 'docs'
  if (first === 'components' || first === 'component') return 'component'
  return 'page'
}

function buildRoute(
  config: PressConfig,
  locale: string,
  type: ContentType,
  rest: string[],
  metaType: unknown,
): { route: string; section: string } {
  const typeFromMeta = typeof metaType === 'string' ? (metaType as ContentType) : type
  const prefix = localePrefix(config, locale)
  const withoutExt = (item: string) => item.replace(/\.md$/, '')
  const tail = rest.map(withoutExt)
  const isIndex = tail.at(-1) === 'index'
  const parts = isIndex ? tail.slice(0, -1) : tail

  if (typeFromMeta === 'blog') {
    const slug = parts.slice(1).join('/') || parts[0] || 'index'
    return { route: `${prefix}/blog/${slug}`, section: 'blog' }
  }
  if (typeFromMeta === 'docs') {
    const section = parts[1] ?? 'docs'
    return { route: `${prefix}/docs/${parts.slice(1).join('/')}`, section }
  }
  if (typeFromMeta === 'component') {
    const slug = parts.slice(1).join('/') || parts[0] || 'index'
    return { route: `${prefix}/components/${slug}`, section: 'components' }
  }
  return { route: `${prefix}/${parts.join('/')}`, section: 'pages' }
}

/** Read and parse every Markdown file under the configured content directory. */
export async function collectContent(
  config: PressConfig,
  contentRoot: string,
): Promise<ContentCollection> {
  const files = await walk(contentRoot)
  const entries: ContentEntry[] = []

  for (const file of files) {
    const relative = path.relative(contentRoot, file).split(path.sep).join('/')
    const raw = await fs.readFile(file, 'utf8')
    const { data, content } = matter(raw)
    const { locale, rest } = inferLocale(config, relative)
    const type = inferType(rest)
    const { route, section } = buildRoute(config, locale, type, rest, data.type)

    const document = parseMarkdown(content, { extensions })
    const renderedHeadingList = (document.headings ?? []) as Heading[]
    const headings = renderedHeadingList.filter((item) => item.level === 2 || item.level === 3)
    const rendered = renderHtml(document, {
      extensions,
      headingAnchors: true,
      highlighter,
      codeLineNumbers: true,
    })
    // The page component renders the title from frontmatter; drop the leading
    // H1 from the article body so screen readers and the design see one H1.
    const html = rendered.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>/, '')

    const firstParagraph = content
      .split(/\n\s*\n/u)
      .map((block) => block.trim())
      .find((block) => block && !block.startsWith('#') && !block.startsWith('```'))
    const description =
      String(data.description ?? '') || stripMarkdown(firstParagraph ?? '').slice(0, 180)

    entries.push({
      id: `${locale}:${type}:${relative}`,
      type,
      locale,
      route: route.replace(/\/$/, '') || '/',
      file: relative,
      title: String(data.title ?? headings[0]?.text ?? path.basename(relative, '.md')),
      description,
      date: data.date ? String(data.date) : undefined,
      updated: data.updated ? String(data.updated) : undefined,
      tags: toArray(data.tags),
      section,
      group: data.group ? String(data.group) : undefined,
      order: Number(data.order ?? 999),
      draft: Boolean(data.draft ?? false),
      headings,
      html,
      excerpt: stripMarkdown(content).slice(0, 240),
      readingTime: estimateReadingTime(content),
      meta: data as Record<string, unknown>,
    })
  }

  entries.sort((a, b) => {
    if (a.type === 'blog' && b.type === 'blog') return (b.date ?? '').localeCompare(a.date ?? '')
    if (a.section === b.section) return a.order - b.order || a.title.localeCompare(b.title)
    return a.route.localeCompare(b.route)
  })

  return createCollection(entries)
}
