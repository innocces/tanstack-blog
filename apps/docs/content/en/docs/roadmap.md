---
title: Roadmap
description: Shipped capabilities and what comes next.
group: Reference
order: 5
updated: 2026-02-01
---

# Roadmap

## Shipped in 0.1

- [x] TanStack Start + Nitro foundation and Cloudflare Workers deployment
- [x] Build-time content pipeline based on TanStack Markdown
- [x] Docs, blog and component-library modes
- [x] 25 token presets, **one plugin package per preset**, live previews and screenshots
- [x] Runtime theme and color-mode switching without remounts
- [x] Standalone `search` and `orama-search` packages, pre-serialized index, command palette
- [x] English, Chinese, French, Japanese, German and Arabic dictionaries; RTL ready
- [x] Sitemap, RSS, `llms.txt`, code copy, npm2yarn tabs, playground links, page feedback
- [x] dumi-style props tables generated from TSDoc, with `@description.zh` translations
- [x] Comment-component slots (separator, tabs, framework panels)
- [x] Live component gallery with real `@tanstack-blog/ui` examples
- [x] Clack TUI scaffolder with real session video recordings
- [x] GitHub Wiki sync, split E2E suites and per-theme visual regression
- [x] Conventional-commit release automation and CI workflows

## Next

- [ ] Full MDX evaluation (the current slot system uses Markdown comment components)
- [ ] Algolia adapter for teams already using it
- [ ] Interactive API reference from OpenAPI schemas
- [ ] Theme editor with live token overrides

## Non-goals

- Replacing TanStack Router or Start
- Full CommonMark or MDX evaluation in the parser
- Being an official TanStack product
