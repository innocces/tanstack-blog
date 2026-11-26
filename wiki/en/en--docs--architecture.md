<!-- Mirrored from apps/docs/content/en/docs/architecture.md. Edit the source, not this file. -->

---
title: Architecture
description: How the Vite plugin, content pipeline and UI layer fit together.
group: Reference
order: 1
updated: 2026-02-01
---

# Architecture

The framework is deliberately layered. Each layer can be used alone or replaced.

```text
┌──────────────────────────────────────────────────────────┐
│  app.config.ts            defineConfig() / Zod schema    │
└───────────────────────────┬──────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────┐
│  @tanstack-blog/core/vite                                │
│  walks content → parseMarkdown → renderHtml → virtual    │
└──────────────┬─────────────────────────┬──────────────────┘
               ▼                         ▼
   virtual:…/content          virtual:…/search-data
               │                         │
               ▼                         ▼
┌──────────────────────────┐  ┌────────────────────────────┐
│ @tanstack-blog/ui        │  │ @tanstack-blog/core/search │
│ DocShell, Sidebar, Toc,  │  │ Orama / local backends     │
│ ThemeProvider, Search…   │  └────────────────────────────┘
└──────────────────────────┘
               │
               ▼
   TanStack Start + TanStack Router (SSR, streaming, deploy)
```

## Build time

1. `collectContent()` walks `contentDir`, skipping dot/underscore files.
2. `gray-matter` splits frontmatter from body.
3. `parseMarkdown()` with `docsMarkdownExtensions()` produces a deterministic AST and heading list.
4. `renderHtml()` with `headingAnchors` and the TanStack Highlight callback produces the HTML string.
5. Entries are sorted (blog by date, docs by order) and exposed through virtual modules.

The Vite plugin watches Markdown files in dev and invalidates the virtual modules on change, so edits hot-reload without a manual restart.

## Runtime

- `createUiStore()` creates a TanStack Store for theme, mode, locale and panel state.
- `ThemeProvider` writes tokens to CSS variables and persists preferences.
- `SearchDialog` builds the Orama index lazily from the virtual search data.
- The catch-all route maps a pathname to an entry using `content.get()` and picks a page component from `entry.type`.

## Why a catch-all route?

Content routes are data, not code. A single `$.tsx` route means adding a Markdown file creates a page without touching `src/routes`. TanStack Router still handles navigation, params, preloading and scroll restoration.

## Replacing a layer

- **Different Markdown renderer**: swap `collectContent()` and keep the `ContentEntry` shape.
- **Different search**: implement a function returning `SearchHit[]` and pass results to your own dialog.
- **Different layout**: use the core package directly and compose your own components from `@tanstack-blog/ui`.
- **Different state**: the UI store is a plain TanStack Store; replace it with your own instance.

Everything is exported from the package entry points, including the Zod schema (`pressConfigSchema`) and token helpers (`tokensToCssVariables`).
