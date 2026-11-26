<!-- Mirrored from apps/docs/content/en/docs/search.md. Edit the source, not this file. -->

---
title: Search
description: Standalone search packages, Orama indexing, local fallback and the command palette.
group: Fundamentals
order: 3
---

# Search

Search is configured in `app.config.ts` and built entirely from content — there is no separate index file to maintain. The implementation lives in **two standalone packages**, not in core:

| Package | Purpose |
| --- | --- |
| `@tanstack-blog/search` | Shared `SearchAdapter` contract + zero-dependency local matcher (default) |
| `@tanstack-blog/orama-search` | Optional Orama full-text adapter with typo tolerance |

## Providers

```ts
search: {
  provider: 'orama',        // 'orama' | 'local' | 'none'
  placeholder: 'Search docs, posts and components…',
  hotkey: '⌘K',
  includeContent: true,
}
```

### Orama

The Vite plugin projects every non-draft entry into a `SearchDocument` and embeds the array in `virtual:tanstack-blog/search-data`. The app creates an adapter and injects it into the dialog:

```tsx
import { createOramaSearchAdapter } from '@tanstack-blog/orama-search'
const adapter = createOramaSearchAdapter(searchData)
<SearchDialog store={store} adapter={adapter} config={config} t={t} />
```

The index is built lazily on first query. Field boosts are title ×3, description ×2, content ×1. Results can be scoped by locale and section; `save`/`load` allow pre-serializing for very large corpora.

### Local

`local` uses `createLocalSearchAdapter` from `@tanstack-blog/search`: a weighted substring matcher scoring the title at 10, description at 4 and body at 1. It is the default dependency-free option.

### None

`none` hides the search trigger. The dialog component simply will not be wired up.

## Result highlighting

Matched terms are highlighted in titles and descriptions. The last five queries are stored locally and shown as chips when the input is empty.

## Keyboard and UX

- `⌘K` / `Ctrl+K` opens the palette from anywhere.
- `↑` / `↓` move the active result, `Enter` navigates, `Esc` closes.
- Clicking the backdrop closes the dialog.
- The footer shows the shortcut hints.

## Customizing

`SearchDialog` accepts `onNavigate` so you can route through TanStack Router instead of a full page load:

```tsx
const navigate = useNavigate()
<SearchDialog store={store} documents={searchData} config={config} t={t}
  onNavigate={(route) => navigate({ to: route as never })} />
```

To change what is indexed, use `toSearchDocuments(entries, includeContent)` from `@tanstack-blog/core/search` and extend the documents before passing them to the dialog. The `SearchDocument` shape is public.
