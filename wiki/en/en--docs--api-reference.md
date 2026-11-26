<!-- Mirrored from apps/docs/content/en/docs/api-reference.md. Edit the source, not this file. -->

---
title: API Reference
description: Public exports from every package in the workspace.
group: Reference
order: 2
updated: 2026-02-01
---

# API Reference

## `@tanstack-blog/core`

| Export | Kind | Purpose |
| --- | --- | --- |
| `defineConfig(input)` | function | Typed identity helper for config |
| `resolveConfig(input)` | function | Validate and apply defaults |
| `pressConfigSchema` | Zod schema | The config schema, reusable in your own tooling |
| `localePrefix(config, locale)` | function | Build the URL prefix for a locale |
| `createTranslator(locale)` | function | Returns `t(key)` with fallback chain |
| `registerDictionary(locale, dict)` | function | Add or override UI copy |
| `resolveLocale(config, candidate)` | function | Best-match locale resolution |
| `defineTheme(theme)` | function | Typed identity helper for themes |
| `tokensToCssVariables(tokens)` | function | Convert tokens to CSS custom properties |

## `@tanstack-blog/core/content`

| Export | Purpose |
| --- | --- |
| `collectContent(config, root)` | Parse the content directory into a collection |
| `createCollection(entries)` | Add `get`, `byType` and `siblings` helpers |
| `slugify(value)` | Deterministic URL-safe slug |
| `ContentEntry`, `ContentCollection`, `Heading` | Types |

## `@tanstack-blog/core/search`

| Export | Purpose |
| --- | --- |
| `toSearchDocuments(entries, includeContent)` | Project entries into search documents |
| `createSearchIndex(documents)` | Build an Orama index |
| `searchIndex(index, term, options)` | Query Orama, returns `SearchHit[]` |
| `serializeIndex` / `deserializeIndex` | Persist an Orama index |
| `localSearch(documents, term, options)` | Dependency-free fallback |

## `@tanstack-blog/core/vite`

`tanstackBlog({ config, root? })` returns a Vite plugin that generates the three virtual modules. `virtualModules` exposes their ids.

## `@tanstack-blog/themes`

`allThemes`, `flagshipThemes`, `defaultTheme`, `getTheme(id)`, `themesBySchool(school)`.

## `@tanstack-blog/ui`

- State: `createUiStore`, `UiStore`, `ColorMode`
- Theme: `ThemeProvider`, `themeInitScript`, `useResolvedMode`, `useSystemPrefersDark`
- Search: `SearchDialog`
- Layout: `SiteHeader`, `SiteFooter`, `Sidebar`, `Toc`, `Breadcrumbs`, `PageNav`, `DocShell`
- Pages: `Article`, `DocPage`, `BlogIndex`, `BlogPost`, `ComponentsIndex`, `ThemeGallery`, `HomeHero`, `NotFound`
- Icons: `TanStackMark`, `IconDocs`, `IconBlog`, `IconComponents`, `IconThemes`, `IconSearch`, `IconSun`, `IconMoon`, `IconSystem`, `IconLanguages`, `IconGitHub`, `IconExternal`, and more
- Styles: `@tanstack-blog/ui/styles.css`

## `@tanstack-blog/cli`

The `create-tanstack-blog` binary. No programmatic API yet; the TUI is intentional so generated projects stay consistent.
