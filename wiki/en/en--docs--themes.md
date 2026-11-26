<!-- Mirrored from apps/docs/content/en/docs/themes.md. Edit the source, not this file. -->

---
title: Themes
description: The token contract, the 25 anchored presets and how to ship a theme plugin.
group: Fundamentals
order: 2
---

# Themes

A theme is data, not a component library. It exports design tokens plus optional font, radius and CSS overrides. Switching themes writes CSS custom properties on `<html>`, so React never remounts and the transition is instantaneous.

## The token contract

```ts
import { defineTheme } from '@tanstack-blog/core'

export const myTheme = defineTheme({
  id: 'my-theme',
  name: 'My Theme',
  school: 'modern-tool',
  description: 'A short line shown in the gallery.',
  modes: ['light', 'dark'],
  light: {
    background: '#ffffff',
    surface: '#f7f8f9',
    surfaceMuted: '#eceef1',
    text: '#16171c',
    textMuted: '#6b7280',
    border: 'rgba(0,0,0,0.08)',
    accent: '#5e6ad2',
    accentText: '#ffffff',
    codeText: '#4c3fa8',
  },
  dark: { /* same keys */ },
  fonts: { display: "'Inter Tight', sans-serif", mono: "'JetBrains Mono', monospace" },
  radii: [6, 12, 16],
  css: '.tb-markdown h2 { letter-spacing: -0.03em; }',
})
```

Tokens map to CSS variables: `--tb-bg`, `--tb-surface`, `--tb-surface-muted`, `--tb-text`, `--tb-text-muted`, `--tb-border`, `--tb-accent`, `--tb-accent-text`, `--tb-code-text`, plus `--tb-font-*` and `--tb-radius-*`.

## The 25 anchored presets

The catalog is derived from the `web-design-engineer` skill's 25 style recipes. Six have hand-authored light and dark palettes (marked ✦); the rest ship their native palette with a generated complementary mode.

| School | Themes |
| --- | --- |
| Modern Tool / Builder SaaS | **linear ✦**, vercel, raycast, notion |
| Editorial / Minimalist | **muji ✦**, apple, aesop, braun, monocle, mid-century |
| Information Architecture | pentagram, swiss, bloomberg-terminal ✦, tufte, nyt |
| Motion / Experimental | field-io, active-theory, resn, y2k |
| Brutalist / Raw | **are-na ✦**, businessweek, balenciaga |
| Warm Humanist | **stripe-press ✦**, mailchimp, **headspace ✦** |

Install the bundle and register what you need:

```ts
import { allThemes, getTheme, themesBySchool } from '@tanstack-blog/themes'

const themes = allThemes                       // all 25
const onlyEditorial = themesBySchool('editorial-minimalist')
const defaultTheme = getTheme('linear')!
```

## Theme plugins

For better plug-and-play, each flagship theme is also a standalone package:

```sh
pnpm add @tanstack-blog/theme-linear
pnpm add @tanstack-blog/theme-muji
pnpm add @tanstack-blog/theme-stripe
```

```ts
import { linearThemePlugin } from '@tanstack-blog/theme-linear'
import { mujiThemePlugin } from '@tanstack-blog/theme-muji'

const themes = [linearThemePlugin().theme, mujiThemePlugin().theme]
```

A plugin returns `{ name, theme }`. The `name` is useful for diagnostics and future plugin discovery; the `theme` is what the UI consumes.

## Runtime switching

`ThemeProvider` persists `{ themeId, mode, locale }` in localStorage and applies the theme before hydration via an inline script, preventing a flash of the wrong theme. The color-mode control has three states: light, dark and system. `prefers-color-scheme` changes are observed live.

Try it: use the theme selector in the header, or click any card on the [Themes page](/themes). The marketplace supports name search, school filters and side-by-side comparison (select two cards then choose **Compare selected**). Every theme has a live preview at `/themes/<id>` with a token table, `pnpm add` command and CSS export, plus a committed dark/light diagonal screenshot under `docs/screenshots/themes/`. The machine-readable catalog is published at `/theme-registry.json`.

## Authoring guidelines

- Use one saturated accent. Never combine two recipes mid-page.
- Keep radius within the recipe's character (0 for editorial, ≤16 for builder tools).
- Derive secondary hues with `oklch()` instead of inventing new ones.
- Test both modes; a theme that declares `modes: ['light']` still falls back to generated dark tokens.
