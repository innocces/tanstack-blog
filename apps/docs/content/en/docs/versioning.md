---
title: Versioned Documentation
description: Publish frozen versions alongside current docs with a header switcher.
group: Guides
order: 3
---

# Versioned Documentation

Versioned docs keep older API documentation available while development continues — a standard feature of Docusaurus, VitePress and GitBook.

## Configure versions

```ts title="app.config.ts"
export default defineConfig({
  title: 'My Docs',
  currentVersion: 'current',
  versions: [
    { code: 'v1.0', label: 'v1.0' },
    { code: 'v2.0', label: 'v2.0' },
  ],
})
```

`currentVersion` is the unprefixed, live documentation. Every other code becomes a URL segment.

## Content layout

```text
content/
  en/docs/api.md                 -> /docs/api
  zh-CN/docs/api.md              -> /zh-CN/docs/api
  v1.0/en/docs/api.md            -> /v/v1.0/docs/api
  v1.0/zh-CN/docs/api.md         -> /zh-CN/v/v1.0/docs/api
```

Place files under `content/<version>/<locale>/...`. The loader detects the version segment, records `entry.version`, and builds the prefixed route automatically.

## Switching versions

When more than one version is configured, a **Version** dropdown appears in the header. Selecting an option calls `switchVersionRoute`, which preserves the current page and locale:

- `/docs/api` → `/v/v1.0/docs/api`
- `/zh-CN/docs/api` → `/zh-CN/v/v1.0/docs/api`

Switching back to **Current** removes the version segment.

## Sidebar scoping

The sidebar filters entries by the active version, so a v1.0 page never leaks into the current docs tree. Search, sitemap and llms.txt include every version.

## Checklist

- [ ] Every versioned entry has an equivalent current page
- [ ] Version labels are short and stable
- [ ] Both locale trees are mirrored when translating
