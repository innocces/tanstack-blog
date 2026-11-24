/**
 * Search contracts and the default local adapter.
 *
 * The core framework has no search dependency. Applications install this
 * package for zero-dependency substring search, or `@tanstack-blog/orama-search`
 * for full-text search with typo tolerance. Both implement `SearchAdapter`.
 */

export interface SearchDocument {
  id: string
  title: string
  description: string
  content: string
  section: string
  locale: string
  route: string
}

export interface SearchHit {
  id: string
  title: string
  description: string
  route: string
  section: string
  score: number
}

export interface SearchOptions {
  locale?: string
  limit?: number
  sections?: string[]
}

export interface SearchAdapter {
  /** Stable id shown in diagnostics. */
  id: 'local' | 'orama' | string
  /** Run a query and return UI-neutral hits. */
  search(term: string, options?: SearchOptions): Promise<SearchHit[]> | SearchHit[]
}

/** Project build-time content entries into the minimal search shape. */
export function toSearchDocuments(
  entries: Array<{
    id: string
    title: string
    description: string
    excerpt: string
    section: string
    locale: string
    route: string
    draft: boolean
    headings: Array<{ text: string }>
  }>,
  includeContent = true,
): SearchDocument[] {
  return entries
    .filter((entry) => !entry.draft)
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      description: entry.description,
      content: includeContent
        ? `${entry.excerpt} ${entry.headings.map((heading) => heading.text).join(' ')}`
        : '',
      section: entry.section,
      locale: entry.locale,
      route: entry.route,
    }))
}

/** Weighted substring matcher: title ×10, description ×4, body ×1. */
export function localSearch(
  documents: SearchDocument[],
  term: string,
  options: SearchOptions = {},
): SearchHit[] {
  const query = term.trim().toLowerCase()
  if (!query) return []
  const tokens = query.split(/\s+/u)

  return documents
    .filter((doc) => !options.locale || doc.locale === options.locale)
    .filter((doc) => !options.sections?.length || options.sections.includes(doc.section))
    .map((doc) => {
      const title = doc.title.toLowerCase()
      const description = doc.description.toLowerCase()
      const content = doc.content.toLowerCase()
      const score = tokens.reduce((sum, token) => {
        if (title.includes(token)) sum += 10
        if (description.includes(token)) sum += 4
        if (content.includes(token)) sum += 1
        return sum
      }, 0)
      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        route: doc.route,
        section: doc.section,
        score,
      }
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, options.limit ?? 8)
}

/** Create the default adapter. No index build step, no async initialization. */
export function createLocalSearchAdapter(documents: SearchDocument[]): SearchAdapter {
  return {
    id: 'local',
    search: (term, options) => localSearch(documents, term, options),
  }
}
