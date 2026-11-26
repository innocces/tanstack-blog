<!-- Mirrored from apps/docs/content/en/blog/editable-docs.md. Edit the source, not this file. -->

---
title: Docs that work on GitHub, not just on the site
description: Why the wiki mirror is a first-class output of the content pipeline.
date: 2026-01-28
tags: [docs, workflow]
updated: 2026-02-01
---

# Docs that work on GitHub, not just on the site

A rendered documentation site is great for readers. It is a poor place to review a documentation change. The diff is Markdown, so the review should happen on Markdown.

## Same source, two surfaces

Every page lives under `apps/docs/content`. The site parses it at build time; `pnpm wiki:sync` copies it into a wiki-ready directory with a short backlink. No conversion step, no divergence.

## Rules that keep both surfaces healthy

- No raw HTML — TanStack Markdown escapes it and GitHub sanitizes it differently.
- Relative asset paths that survive a copy.
- Standard headings and tables only.
- Frontmatter is allowed in the site but harmless in the wiki.

## Contribution flow

Edit the Markdown, run `pnpm wiki:sync`, open a PR. The PR checklist in the docs reminds contributors to do both. Reviewers can read the rendered site for tone and the raw Markdown for accuracy.

It is a small piece of automation, but it removes an entire class of "docs are out of sync" bugs.
