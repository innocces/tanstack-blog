<!-- Mirrored from apps/docs/content/en/docs/auto-kb.md. Edit the source, not this file. -->

---
title: Auto-Sniff & Knowledge Base
description: Detect a project automatically and publish an LLM-free DeepWiki-style knowledge base.
group: Guides
order: 5
---

# Auto-Sniff & Knowledge Base

Two utilities turn any repository into documentation without an LLM or a hosted service.

## Sniff a project

```sh
pnpm exec create-tanstack-blog sniff /path/to/repo
```

The sniffer reads `package.json`, the workspace layout and the file tree, then reports the detected stack, scripts, package count and a suggested `app.config.ts`. No network call, no model.

## Generate the knowledge base

```sh
pnpm exec create-tanstack-blog kb /path/to/repo ./wiki-generated
```

`@tanstack-blog/kb` statically extracts:

- workspace packages, source-file counts and exported symbols
- runtime and development dependencies with exact ranges
- scripts, detected frameworks, README headings and the Git remote

It emits five Markdown pages: **overview**, **architecture**, **api**, **dependencies** and **glossary**. The files are deterministic, diffable and safe to commit.

## On this site

The Vite plugin runs the same analysis at build time and exposes `virtual:tanstack-blog/wiki`. Pages are rendered at `/wiki/*`, added to the sitemap and indexed by search alongside hand-written docs. Toggle with `config.wiki = false`.

## Use cases

- Onboarding contributors with an always-current architecture map
- Publishing an open-source repo as a readable knowledge base
- Generating a Wiki mirror without paying for inference
