---
title: Content & Markdown
description: Master frontmatter, callouts, code fences and component slots.
order: 2
updated: 2026-02-01
---

# Content & Markdown

**Goal:** write content that uses the full docs syntax profile.

## Frontmatter

```md
---
title: Getting Started
description: One sentence used in cards and search.
date: 2026-01-15
tags: [guide, tanstack]
order: 1
group: Fundamentals
updated: 2026-02-01
draft: false
---
```

`group` creates a collapsible sidebar section. `updated` shows a "Last updated" line. `draft` removes the page from listings and search.

## Directory conventions

| Path | Route |
| --- | --- |
| `content/en/index.md` | `/` |
| `content/en/docs/a.md` | `/docs/a` |
| `content/en/blog/a.md` | `/blog/a` |
| `content/en/components/a.md` | `/components/a` |
| `content/zh-CN/docs/a.md` | `/zh-CN/docs/a` |

## Callouts

```md
> [!TIP] Cache the AST
> Parse once, render many times.
```

## Code fences

````md
```tsx file="demo.tsx" {2}
const value = 1
console.log(value)
```
````

The toolbar offers copy, npm/pnpm/yarn/bun conversion, View source and StackBlitz / CodePen / CodeSandbox. Lines annotated with `// @ts-expect-error` show a type-hint badge.

## Comment components

```md
<!-- ::separator tone="subtle" -->

<!-- ::start:tabs -->
## React
React content
## Solid
Solid content
<!-- ::end:tabs -->
```

These become interactive tabs without MDX evaluation.

## Verify

- Edit a file with the dev server running: the virtual module invalidates and hot-reloads.
- Check `sitemap.xml`, `rss.xml` and `llms.txt` in the build output.
