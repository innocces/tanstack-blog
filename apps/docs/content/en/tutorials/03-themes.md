---
title: Themes
description: Author, preview, compare and export a theme.
order: 3
updated: 2026-02-01
---

# Themes

**Goal:** understand the four theming layers and ship your own preset.

## The layers

1. **Tokens** — nine colors, fonts, radii (`defineTheme`).
2. **Slots** — replace any React component (`theme.config.tsx`).
3. **Dictionaries** — UI copy, including Chinese (`registerDictionary`).
4. **CSS** — structural overrides through `PressTheme.css`.

## Try the marketplace

Open `/themes`. Search by name, filter by design school, select two cards and choose **Compare selected**. Each theme has a live preview at `/themes/<id>` with a token table, install command and CSS export.

## Create a preset

```ts
import { defineTheme } from '@tanstack-blog/core'

export const acmeTheme = defineTheme({
  id: 'acme',
  name: 'Acme',
  school: 'modern-tool',
  description: 'Corporate docs.',
  modes: ['light', 'dark'],
  light: { /* nine tokens */ },
  dark: { /* nine tokens */ },
})
```

Generate a standalone plugin package with:

```sh
pnpm exec create-tanstack-blog run themes
```

## Override a slot

```tsx
import { SiteHeader, type ThemeSlots } from '@tanstack-blog/ui'

export const themeSlots: Partial<ThemeSlots> = {
  Header: (props) => <SiteHeader {...props} />,
}
```

## Verify

- Both color modes have hand-tuned tokens.
- `pnpm test:visual` baselines updated with `pnpm test:visual:update`.
- Screenshot added to `docs/screenshots/themes/`.
