---
title: Feature Comparison
description: What the leading docs platforms ship, and how TanStack Blog compares.
group: Reference
order: 3
---

# Feature Comparison

We surveyed the five most widely used documentation platforms — **Docusaurus, Nextra, VitePress, GitBook and Mintlify** — and used their shared feature set as a checklist. This page records what TanStack Blog implements and where it intentionally differs.

| Capability | Docusaurus | Nextra | VitePress | GitBook | Mintlify | TanStack Blog |
| --- | --- | --- | --- | --- | --- | --- |
| File-based Markdown routing | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (catch-all route) |
| Blog mode | ✓ | part | ✓ | ✓ | ✓ | ✓ |
| Component gallery | part | ✓ | part | part | ✓ | ✓ |
| Generated sidebar + TOC | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Dark / light / system | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| i18n | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (en + zh built in, RTL ready) |
| Full-text search | ✓ (Algolia) | ✓ (Flexsearch) | ✓ (local/Algolia) | ✓ | ✓ | ✓ (Orama + local adapters) |
| Theme marketplace | part | ✓ | part | part | ✓ | ✓ (25 presets + plugins) |
| Versioned docs | ✓ | ✓ | ✓ | ✓ | ✓ | roadmap |
| Sitemap / RSS / `llms.txt` | part | part | part | ✓ | ✓ | ✓ (build-time) |
| Copy-code buttons | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Page feedback | part | part | part | ✓ | ✓ | ✓ (local vote) |
| Tag filter + pagination | ✓ | ✓ | ✓ | part | part | ✓ |
| Last-updated metadata | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (`updated` frontmatter) |
| Back to top | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit-on-GitHub link | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MDX / interactive components | ✓ | ✓ | ✓ | ✓ | ✓ | roadmap (comment components) |
| Deploy presets | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (Cloudflare, Vercel, Netlify, Node) |
| Offline Local-First operation | part | part | ✓ | ✗ | ✗ | ✓ (no hosted service needed) |

## What we deliberately borrowed

- **Docusaurus**: versioned *structure* of docs (groups, TOC, edit links, feedback), without its heavy config surface.
- **Nextra / Mintlify**: a theme marketplace where switching is a style change, not a rebuild.
- **VitePress**: SPA navigation after first load, build-time data loading, generated sitemap.
- **GitBook**: readable plain Markdown that also works outside the rendered site (GitHub Wiki mirror).

## Remaining gaps

See the [Roadmap](./roadmap.md): versioned docs, MDX-style interactive slots, theme packages for all 25 recipes, and visual regression testing.
