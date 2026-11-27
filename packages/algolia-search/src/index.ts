/** Algolia adapter for sites that already index their content there. */

import type { SearchAdapter, SearchHit } from '@tanstack-blog/search'
import { algoliasearch } from 'algoliasearch'

export interface AlgoliaOptions {
  appId: string
  apiKey: string
  indexName: string
}

/** Records need `title`, `description`, `section`, `locale` and `route`. */
export function createAlgoliaSearchAdapter(options: AlgoliaOptions): SearchAdapter {
  const client = algoliasearch(options.appId, options.apiKey)
  return {
    id: 'algolia',
    async search(term, searchOptions) {
      if (!term.trim()) return []
      const result = await client.searchSingleIndex({
        indexName: options.indexName,
        searchParams: {
          query: term,
          hitsPerPage: searchOptions?.limit ?? 8,
          ...(searchOptions?.locale ? { facetFilters: [`locale:${searchOptions.locale}`] } : {}),
        },
      })
      return (result.hits ?? []).map((hit, index) => {
        const record = hit as Record<string, unknown>
        return {
          id: String(record.objectID ?? index),
          title: String(record.title ?? ''),
          description: String(record.description ?? ''),
          route: String(record.route ?? '#'),
          section: String(record.section ?? 'docs'),
          score: typeof record._score === 'number' ? record._score : 0,
        } satisfies SearchHit
      })
    },
  }
}
