<!-- Mirrored from apps/docs/content/en/tutorials/04-search-and-i18n.md. Edit the source, not this file. -->

---
title: Search & i18n
description: Configure offline search and ship a second language.
order: 4
updated: 2026-02-01
---

# Search & i18n

**Goal:** full-text search and a localized route tree.

## Search packages

| Package | Role |
| --- | --- |
| `@tanstack-blog/search` | adapter contract + local matcher |
| `@tanstack-blog/orama-search` | typo-tolerant full-text adapter |

```tsx
const adapter = createOramaSearchAdapter(searchData)
<SearchDialog store={store} adapter={adapter} config={config} t={t} />
```

The build emits `search-index.json` so clients can skip index construction. `⌘K` opens the palette; `?search=1&q=...` deep-links a query.

## Add a language

```ts
i18n: {
  defaultLocale: 'en',
  locales: [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'zh-CN', label: '简体中文', dir: 'ltr' },
  ],
}
```

Mirror content under `content/zh-CN/`. Built-in dictionaries already cover en, zh-CN, fr, ja, de and ar; add your own with `registerDictionary`.

## Verify

- Switching language keeps the current page.
- Reloading an unprefixed URL restores the stored locale.
- Search results are scoped to the active locale.
