---
title: Configuration
description: Every option in app.config.ts, with defaults and when to change it.
group: Getting Started
order: 2
updated: 2026-02-01
---

# Configuration

Configuration is validated with Zod at build time. `defineConfig` is an identity helper that gives you autocomplete; `resolveConfig` applies defaults. A config that typechecks always produces a complete object.

## Complete example

```ts title="app.config.ts"
import { defineConfig } from '@tanstack-blog/core'

export default defineConfig({
  title: 'TanStack Blog',
  description: 'Docs, blogs and component libraries.',
  siteUrl: 'https://example.com',
  contentDir: 'content',
  repoUrl: 'https://github.com/acme/docs',
  editUrlBase: 'https://github.com/acme/docs/edit/main/content',

  nav: [
    { label: 'Docs', to: '/docs' },
    { label: 'Blog', to: '/blog' },
  ],
  social: [{ label: 'GitHub', href: 'https://github.com/acme' }],

  modes: {
    blog: true,
    docs: true,
    components: false,
  },

  theme: {
    default: 'linear',
    allowSwitch: true,
    storeKey: 'tanstack-blog-theme',
  },

  search: {
    provider: 'orama',        // 'orama' | 'local' | 'none'
    placeholder: 'Search docs…',
    hotkey: '⌘K',
    includeContent: true,
  },

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', label: 'English', dir: 'ltr' },
      { code: 'zh-CN', label: '简体中文', dir: 'ltr' },
    ],
    alwaysPrefixLocale: false,
  },

  analytics: {
    provider: 'none',         // 'none' | 'plausible' | 'umami' | 'custom'
  },
})
```

## Top-level options

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `title` | `string` | required | Brand in the header and document title |
| `description` | `string` | `''` | Meta description and footer copy |
| `siteUrl` | `string` | — | Canonical URL and OpenGraph |
| `contentDir` | `string` | `'content'` | Markdown root, relative to the app |
| `repoUrl` | `string` | — | Adds the GitHub icon to the header |
| `editUrlBase` | `string` | — | Adds "Edit this page" to docs pages |
| `nav` | `{label,to,external}[]` | `[]` | Header navigation |
| `social` | `{label,href}[]` | `[]` | Footer links |

## Modes

| Mode | Route | Behavior |
| --- | --- | --- |
| `docs` | `/docs` | Sidebar tree, previous/next links, table of contents |
| `blog` | `/blog` | Reverse-chronological cards, tags, reading time |
| `components` | `/components` | Gallery of component documentation entries |

Content type is inferred from the directory name (`docs`, `blog`, `components`, `posts`, `guides`) and can be overridden with the `type` frontmatter field.

## Search

`orama` builds an in-memory [Orama](https://orama.inc) index from build-time data — full-text with typo tolerance. `local` uses weighted substring matching and no search dependency. `none` removes the UI trigger. `includeContent` controls whether excerpts and headings are indexed in addition to titles.

## i18n

`alwaysPrefixLocale: false` keeps the default locale at clean paths (`/docs`) and prefixes other locales (`/zh-CN/docs`). Set it to `true` if you want `/en/docs` for every locale. `dir: 'rtl'` flips the sidebar and table-of-contents layout.

## Autogeneration philosophy

You only describe the site. The Vite plugin generates:

- `virtual:tanstack-blog/config` — resolved config
- `virtual:tanstack-blog/content` — parsed entries and lookup helpers
- `virtual:tanstack-blog/search-data` — search documents

There is no routes file, sidebar file or search index to maintain. Advanced users can import the same core functions and replace any layer.
