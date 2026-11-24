/**
 * Browser-safe content types and collection helpers.
 *
 * Kept separate from the Node-only loader so virtual modules can import
 * `createCollection` without pulling `node:fs` into the client bundle.
 */

export type ContentType = 'page' | 'blog' | 'docs' | 'component'

export interface Heading {
  id: string
  text: string
  level: number
}

export interface ContentEntry {
  /** Stable id, e.g. `en:docs:getting-started`. */
  id: string
  type: ContentType
  locale: string
  /** Route path including the locale prefix, e.g. `/docs/getting-started`. */
  route: string
  /** Source file relative to the content root. */
  file: string
  title: string
  description: string
  date?: string
  /** Optional last-updated date, shown in article footers. */
  updated?: string
  tags: string[]
  section: string
  /** Optional second-level menu label (e.g. `Fundamentals`). */
  group?: string
  order: number
  draft: boolean
  headings: Heading[]
  html: string
  excerpt: string
  readingTime: number
  /** Existing frontmatter, preserved for third-party components. */
  meta: Record<string, unknown>
}

export interface ContentCollection {
  entries: ContentEntry[]
  get(route: string, locale?: string): ContentEntry | undefined
  byType(type: ContentType, locale?: string): ContentEntry[]
  siblings(entry: ContentEntry): { prev?: ContentEntry; next?: ContentEntry }
}

/** Create a URL-safe slug, preserving unicode word characters for CJK titles. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
}

/** Wrap a plain entry list with lookup helpers; used by the virtual module too. */
export function createCollection(entries: ContentEntry[]): ContentCollection {
  const visible = entries.filter((entry) => !entry.draft)
  return {
    entries,
    get(route, locale) {
      return visible.find((entry) => entry.route === route && (!locale || entry.locale === locale))
    },
    byType(type, locale) {
      return visible.filter((entry) => entry.type === type && (!locale || entry.locale === locale))
    },
    siblings(entry) {
      const pool = visible.filter(
        (item) => item.type === entry.type && item.locale === entry.locale,
      )
      const index = pool.findIndex((item) => item.id === entry.id)
      return {
        prev: index > 0 ? pool[index - 1] : undefined,
        next: index >= 0 && index < pool.length - 1 ? pool[index + 1] : undefined,
      }
    },
  }
}
