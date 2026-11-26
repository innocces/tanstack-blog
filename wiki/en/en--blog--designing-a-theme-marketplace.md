<!-- Mirrored from apps/docs/content/en/blog/designing-a-theme-marketplace.md. Edit the source, not this file. -->

---
title: Designing a theme marketplace with nine colors
description: How a small token contract makes 25 anchored design recipes interchangeable.
date: 2026-02-11
tags: [themes, design]
updated: 2026-02-01
---

# Designing a theme marketplace with nine colors

A theme marketplace lives or dies on its contract. Too small and themes cannot express themselves; too large and every theme becomes a fork of the UI.

We landed on nine color tokens, three font stacks and a radius triple.

## Why nine colors

Documentation UIs have a limited vocabulary: page, surface, muted surface, text, muted text, border, accent, accent text and code text. Once those are assigned, every component can be styled without knowing which recipe is active.

Recipes with richer palettes — Bloomberg's positive/negative colors, for example — can add extra CSS through the theme's `css` field without changing the contract.

## Hand-tuned versus derived

Six flagship recipes have authored light and dark palettes. The remaining nineteen ship their native mode and a generated complement, so no theme is broken by the color-mode toggle. The gallery shows both rows of swatches, making that distinction visible.

## Plugins, not forks

Each flagship theme is also a standalone package exporting a `{ name, theme }` plugin. Installing `@tanstack-blog/theme-muji` adds one more object to an array. No patching, no peer conflicts with the UI package.

## The trap we avoided

We did not build a theme editor. A marketplace needs a clear, opinionated set of presets more than it needs a color picker. Users who want total control can write a theme object in twenty lines.
