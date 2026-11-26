---
title: Quickstart
description: Create a site, add a page and verify it locally.
order: 1
updated: 2026-02-01
---

# Quickstart

**Goal:** a running docs site with one page, in under five minutes.

## 1. Scaffold

```sh
pnpm dlx @tanstack-blog/cli
```

Choose pnpm, enable **Docs** and **Blog**, keep the default Linear theme and Orama search. The TUI writes a complete project including `app.config.ts`, `theme.config.tsx` and virtual-module typings.

## 2. Start the server

```sh
cd my-docs
pnpm install
pnpm dev
```

Open http://localhost:3000. The home hero links to Docs, Blog, Themes, Search and the generated Wiki.

## 3. Add your first page

Create `content/en/docs/hello.md`:

```md
---
title: Hello
description: My first page.
group: Getting Started
order: 1
---

# Hello

This Markdown file is now a route at `/docs/hello`.
```

No route file is needed — the catch-all route maps the path to the entry.

## 4. Verify

- `/docs/hello` renders the heading and table of contents on the right.
- `⌘K` finds the new page.
- Change the theme from the header; the choice survives navigation.

## Next

Continue with [Content & Markdown](/tutorials/02-content-and-markdown).
