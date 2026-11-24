/// <reference types="vite/client" />

declare module 'virtual:tanstack-blog/config' {
  import type { PressConfig } from '@tanstack-blog/core'
  const config: PressConfig
  export default config
}

declare module 'virtual:tanstack-blog/content' {
  import type { ContentCollection, ContentEntry } from '@tanstack-blog/core/content/collection'
  export const entries: ContentEntry[]
  export const content: ContentCollection
  const contentDefault: ContentCollection
  export default contentDefault
}

declare module 'virtual:tanstack-blog/search-data' {
  import type { SearchDocument } from '@tanstack-blog/core/search'
  const documents: SearchDocument[]
  export default documents
}
