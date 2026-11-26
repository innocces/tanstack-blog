---
title: Theme Marketplace
description: Search, filter, compare, preview, install and export any of the 25 presets.
group: Fundamentals
order: 5
updated: 2026-02-01
---

# Theme Marketplace

`/themes` is a working marketplace, not a static list. It is backed by the same token catalog that powers runtime switching.

## Find a theme

- The search box matches name, id and description.
- The school filter narrows by design family: modern-tool, editorial-minimalist, information-architecture, motion-experimental, brutalist-raw, warm-humanist.
- The counter shows `visible / total`.

## Compare two themes

Click the `+` button on any two cards, then choose **Compare selected**. The comparison page renders both themes side by side at the same viewport and color mode, so differences in spacing, radius and accent are obvious.

## Inspect one theme

Every card links to `/themes/<id>`, which includes:

- a live token-driven docs mockup with light/dark toggle
- a table of all nine token values in both modes
- a copyable `pnpm add @tanstack-blog/theme-<id>` command
- an **Export CSS** button that copies the current mode as CSS custom properties
- links to the other presets and the committed diagonal screenshot

## Apply at runtime

The **Apply** button on a card or preview page writes the theme to the TanStack Store and localStorage. The boot script applies tokens before hydration, so there is no color flash on reload.

## Machine-readable catalog

`/theme-registry.json` exposes id, name, school, accent, package name and modes for all 25 themes. Third-party marketplaces can consume it without parsing source.

```sh
pnpm exec create-tanstack-blog run registry   # regenerate packages/themes/registry.json
```

## Theme editor

Open `/themes/editor` to start from any preset, tweak the nine tokens with color pickers, preview both modes and export the resulting CSS. **Apply** registers the edited theme as "Custom" and activates it immediately.

## Authoring a new theme

```sh
pnpm exec create-tanstack-blog create-theme acme
```

This scaffolds a standalone plugin package. Fill in both token sets, then add a preview screenshot with `pnpm screenshot`.
