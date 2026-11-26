---
title: Custom Theme Development
description: "A dumi-inspired, layered theming system: tokens, slots, dictionaries and CSS."
group: Guides
order: 6
updated: 2026-02-01
---

# Custom Theme Development

TanStack Blog follows dumi's composition model. Dumi splits a theme into three layers — `builtins` (how Markdown syntax renders), `layouts` (global / doc / demo page shells) and `slots` (Navbar, SideMenu, HomePageHero, …). A custom theme overrides individual components by matching their names; anything not provided falls back to the built-in implementation. We implement the same idea with a typed slot registry.

## The four customization layers

| Layer | Package / file | What it changes |
| --- | --- | --- |
| Tokens | `@tanstack-blog/themes`, `defineTheme()` | Colors, fonts, radii, accent CSS |
| Slots | `theme.config.tsx`, `ThemeSlots` | Every component in the site, including page layouts |
| Copy | `registerDictionary()` | UI strings, including Chinese/English variants |
| CSS | `PressTheme.css`, `styles.css` | Anything structural a token cannot express |

All four are independent. You can ship a token-only theme, a slot-only theme, or a full visual system.

## Slot registry

`ThemeSlots` is exported from `@tanstack-blog/ui`. Every key has a built-in default, so a partial override is always safe.

| Slot | Default | Purpose |
| --- | --- | --- |
| `Header` | `SiteHeader` | Brand, navigation, theme/locale controls |
| `Footer` | `SiteFooter` | Footer links and copy |
| `Sidebar` | `Sidebar` | Left documentation tree |
| `Toc` | `Toc` | Right-hand table of contents |
| `SearchDialog` | `SearchDialog` | Command palette |
| `Article` | `Article` | Markdown "builtins" layer — override to change all rendered code, callouts and tabs |
| `DocPage` / `BlogPost` / `ComponentPage` | page components | Content page bodies |
| `BlogIndex` / `ComponentsIndex` / `ThemeGallery` / `ThemePreviewPage` | index pages | Listing and gallery layouts |
| `HomeHero` | `HomeHero` | Landing hero |
| `WikiPage` | built-in | Auto-generated knowledge base renderer |
| `BrandMark` / `Nav` / `ThemeSwitcher` / `LocaleSwitcher` / `SearchTrigger` / `VersionSwitcher` | Header pieces | Independently replaceable header elements |
| `Breadcrumbs` / `PageNav` / `DocShell` / `Feedback` / `BackToTop` | UI pieces | Small reusable elements |
| `ThemeCompare` / `ThemeSample` / `TutorialIndex` / `WikiPage` | Discovery pages | Comparison, samples, tutorial hub, generated KB |
| `NotFound` | `NotFound` | 404 page |

## Registering overrides

Create `src/theme.config.tsx` (the CLI scaffolds it for you):

```tsx
import { SiteHeader, type ThemeSlots } from '@tanstack-blog/ui'

export const themeSlots: Partial<ThemeSlots> = {
  Header: (props) => <SiteHeader {...props} />,
}
```

The root document wraps the app in `SlotsProvider`, and every page resolves components with `useSlots()`. There is no patching and no fork.

## Authoring a theme package

```ts
import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { registerDictionary } from '@tanstack-blog/core'

export const acmeTheme = defineTheme({
  id: 'acme',
  name: 'Acme Docs',
  school: 'modern-tool',
  description: 'Corporate documentation theme.',
  modes: ['light', 'dark'],
  light: { /* nine tokens */ },
  dark: { /* nine tokens */ },
  css: '.tb-header { border-bottom-width: 2px; }',
})

registerDictionary('en', { 'nav.docs': 'Guides' })
```

Then export `themeSlots` from the same package and import it in the app's `theme.config.tsx`. Theme plugins use the `{ name, theme }` shape, while slot overrides are plain React components — keep the two exports separate so a token-only consumer never loads React.

## Overriding builtins

`Article` is the builtins layer. Replace it to control how code blocks, callouts and comment components render:

```tsx
import { type ThemeSlots } from '@tanstack-blog/ui'

export const themeSlots: Partial<ThemeSlots> = {
  Article: ({ entry }) => <MyRenderer html={entry.html} />,
}
```

## Fallback rules

- A provided slot completely replaces the default; it does not merge JSX.
- Unprovided slots keep the built-in implementation.
- Slots are resolved once per render tree, so switching color themes does not remount them.
- Props are typed from the default component, so overrides cannot drift from the framework contract.

## Checklist for a custom theme

- [ ] Both light and dark token sets defined
- [ ] `favicon.ico` / `favicon.svg` and brand assets provided
- [ ] English and Chinese dictionary entries for new copy
- [ ] Every overridden slot rendered at desktop and mobile widths
- [ ] `pnpm test:visual` baselines updated after intentional visual change
- [ ] Screenshots added to the theme's README
