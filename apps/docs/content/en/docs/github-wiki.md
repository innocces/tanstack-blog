---
title: GitHub Wiki
description: Keeping documentation readable both on the site and in the repository wiki.
group: Guides
order: 2
---

# GitHub Wiki

Documentation should not be trapped inside a rendered site. Every page in `apps/docs/content` is plain Markdown, so it can be published verbatim to the repository wiki.

## Why

- Contributors can read and edit docs without running the dev server.
- Search engines and GitHub both index the same source of truth.
- A wiki clone remains useful offline.

## Sync script

```sh
pnpm wiki:sync
```

The script copies `apps/docs/content/**/*.md` into `wiki/` and prepends a short note linking back to the hosted docs. It keeps locale subdirectories and skips drafts.

```text
wiki/
├── Home.md
├── en/
│   ├── Getting-Started.md
│   └── Configuration.md
└── zh-CN/
    └── Getting-Started.md
```

> [!NOTE] One-time setup
> GitHub wikis are separate Git repositories. Enable the wiki in repository settings, clone `https://github.com/<org>/<repo>.wiki.git`, run the sync script and push the generated `wiki/` contents.

## Automation

Add a workflow step after docs changes to regenerate and push the wiki mirror. The script is idempotent and never deletes files it did not generate, so hand-written wiki pages are preserved.

## Writing for both surfaces

Because the same file is rendered by two systems:

- Prefer relative links that work in both contexts where possible; use absolute site URLs for cross-site links.
- Avoid HTML — TanStack Markdown escapes raw HTML by default, and GitHub sanitizes it differently.
- Keep images in a committed `public/` or `assets/` directory and reference them by relative path.
- Use standard headings and tables; both renderers understand them.
