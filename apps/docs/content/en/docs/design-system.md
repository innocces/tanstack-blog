---
title: Design System
description: Tokens, typography, spacing and the TanStack-style icon set.
group: Guides
order: 7
updated: 2026-02-01
---

# Design System

The UI layer ships one token-driven component system. Themes change values, never structure.

## Color tokens

| Variable | Role |
| --- | --- |
| `--tb-bg` | Page background |
| `--tb-surface` | Raised surface: header, cards, sidebar |
| `--tb-surface-muted` | Code blocks, hover states |
| `--tb-text` | Primary text |
| `--tb-text-muted` | Secondary text |
| `--tb-border` | Hairline borders |
| `--tb-accent` | A single accent used on active states and links |
| `--tb-accent-text` | Text on top of the accent |
| `--tb-code-text` | Inline code text |

Palette derivation uses `oklch()` where a theme needs more colors. Recipes never introduce a fifth hue just to "balance" a restricted four-color palette.

## Typography

Each theme supplies three font stacks: display, body and mono. The default Linear theme uses Inter Tight for display and body, and JetBrains Mono for code. Headings use tight letter spacing; body text starts at 15px with a 1.6 line height and `text-wrap: pretty`.

## Spacing and radius

The UI uses a 4px rhythm: 4 / 8 / 12 / 16 / 24 / 40 / 64 / 96. Radius scales are declared per theme as `[small, medium, large]`; editorial recipes set all three to 0, builder tools stay at or below 16, and playful recipes go higher.

## Motion

Hover transitions are 150ms ease-out. Layout moves use a quint curve around 350–450ms. Reduced-motion preferences disable all animation. No bouncy springs in the default theme.

## Icons

Icons use the **official TanStack brand assets**: the oval-and-twin-peaks emblem from the TanStack website, plus the same **filled Phosphor glyph family** used on tanstack.com. All icons live in `packages/ui/src/icons.tsx` with a 256×256 viewBox, `currentColor` fill, no strokes and no emoji.

```tsx
import { IconDocs, IconSearch, TanStackMark } from '@tanstack-blog/ui'
```

No icon CDN is loaded. The mark is also committed as `public/favicon.svg`, and brand wordmarks appear on the home and theme pages. If a theme needs a new glyph, add it to the icon module so it inherits the same sizing rules.
