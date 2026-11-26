<!-- Mirrored from apps/docs/content/en/docs/contributing.md. Edit the source, not this file. -->

---
title: Contributing
description: Local development, workspace layout and the pull-request checklist.
group: Community
order: 1
---

# Contributing

Thanks for helping improve the framework. This page is the source of truth for local setup and PR expectations.

## Prerequisites

- Node.js ≥ 20 (the workspace is developed on Node 26)
- pnpm 10 (`corepack enable`)
- Git

## Local setup

```sh
git clone https://github.com/innocces/tanstack-blog.git
cd tanstack-blog
pnpm install
pnpm build:packages
pnpm dev
```

The dev server runs at `http://localhost:3000`. Package changes require a rebuild because apps consume the compiled `dist/` output; for rapid iteration, run `pnpm --filter @tanstack-blog/core build --watch` in a second terminal.

> [!IMPORTANT] `.demand/` is local only
> The `.demand/` directory holds private planning notes and is listed in `.gitignore`. Never commit it or copy its contents into a PR.

## Workspace layout

| Path | Purpose |
| --- | --- |
| `packages/core` | Config schema, content pipeline, i18n, theme contract, Vite plugin |
| `packages/ui` | React layout, theme provider, search dialog, icons, CSS |
| `packages/themes` | The 25 token presets |
| `packages/theme-*` | Standalone theme plugins |
| `packages/cli` | Interactive scaffolder |
| `apps/docs` | The documentation site and full-featured demo |
| `scripts/` | Maintenance scripts (wiki sync) |

## Useful commands

```sh
pnpm dev                  # run the docs app
pnpm build:packages       # build every library package
pnpm build                # build packages + docs app
pnpm check                # Biome lint + format check
pnpm check:fix            # apply safe fixes
pnpm test                 # package tests
pnpm wiki:sync            # regenerate the wiki mirror
```

## Adding a theme

1. Add a recipe entry to `packages/themes/src/presets.ts` with light and dark tokens.
2. If it needs its own package, copy `packages/theme-linear` and update the package name and preset id.
3. Add a row to the theme table in `content/en/docs/themes.md`.
4. Capture a screenshot for the README if the theme is a flagship.

## Adding documentation

Write Markdown under `apps/docs/content/<locale>/docs/`. Frontmatter is documented in [Content & Markdown](./content-and-markdown.md). After adding a page, run `pnpm wiki:sync` so the wiki mirror stays in sync.

## Pull-request checklist

- [ ] `pnpm build:packages && pnpm build` succeeds
- [ ] `pnpm check` passes
- [ ] New code has concise English comments explaining intent
- [ ] Docs updated for any user-visible change
- [ ] `pnpm wiki:sync` run when content changed
- [ ] No `.demand/`, `.env`, build output or screenshots of local secrets included
- [ ] Screenshots attached for visual changes

## Commit style

Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`. Keep the subject under 72 characters.

## Releases

Releases are generated from Conventional Commits. `scripts/release.mjs` inspects commits since the last tag, computes the next semver (`feat` → minor, `fix` → patch, `BREAKING CHANGE` → major), bumps every `package.json`, prepends `CHANGELOG.md` and creates a git tag.

The `Release` GitHub Actions workflow runs this automatically on `main` after CI passes and publishes a GitHub release. Use `pnpm exec create-tanstack-blog run release` locally for a dry run.
