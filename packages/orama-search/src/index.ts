/** Full-text Orama adapter. Install only in apps that opt into `provider: 'orama'`. */

import type { AnyOrama, RawData } from '@orama/orama'
import { create, insertMultiple, load, search as oramaSearch, save } from '@orama/orama'
import type { SearchAdapter, SearchDocument, SearchHit, SearchOptions } from '@tanstack-blog/search'

const schema = {
  title: 'string',
  description: 'string',
  content: 'string',
  section: 'string',
  locale: 'string',
  route: 'string',
} as const

export type OramaSearchIndex = AnyOrama

export async function createSearchIndex(documents: SearchDocument[]): Promise<OramaSearchIndex> {
  const db = create({ schema })
  if (documents.length) await insertMultiple(db, documents as never, 500)
  return db
}

export async function searchIndex(
  index: OramaSearchIndex,
  term: string,
  options: SearchOptions = {},
): Promise<SearchHit[]> {
  if (!term.trim()) return []
  const where: Record<string, string> = {}
  if (options.locale) where.locale = options.locale
  if (options.sections?.length === 1) where.section = options.sections[0]!

  const result = await oramaSearch(index, {
    term,
    limit: options.limit ?? 8,
    where: Object.keys(where).length ? (where as never) : undefined,
    properties: ['title', 'description', 'content'],
    boost: { title: 3, description: 2, content: 1 },
  })

  return result.hits.map((hit) => {
    const doc = hit.document as unknown as SearchDocument
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      route: doc.route,
      section: doc.section,
      score: hit.score,
    }
  })
}

export function serializeIndex(index: OramaSearchIndex): string {
  return JSON.stringify(save(index))
}

export function deserializeIndex(raw: string): OramaSearchIndex {
  const db = create({ schema })
  load(db, JSON.parse(raw) as RawData)
  return db
}

/** Lazily builds the index on first query, so initial render stays cheap. */
export function createOramaSearchAdapter(
  documents: SearchDocument[],
  serialized?: string,
): SearchAdapter {
  let index: OramaSearchIndex | undefined
  let pending: Promise<OramaSearchIndex> | undefined

  return {
    id: 'orama',
    async search(term, options) {
      if (!term.trim()) return []
      if (!index) {
        pending ??= Promise.resolve(
          serialized ? deserializeIndex(serialized) : await createSearchIndex(documents),
        )
        index = await pending
      }
      return searchIndex(index, term, options)
    },
  }
}
