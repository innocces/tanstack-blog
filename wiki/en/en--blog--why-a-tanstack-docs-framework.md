<!-- Mirrored from apps/docs/content/en/blog/why-a-tanstack-docs-framework.md. Edit the source, not this file. -->

---
title: Why a docs framework on top of TanStack?
description: TanStack Markdown parses beautifully, but a documentation site needs more than a parser.
date: 2026-02-18
tags: [tanstack, architecture]
updated: 2026-02-01
---

# Why a docs framework on top of TanStack?

TanStack Markdown does one thing well: it turns a constrained flavor of Markdown into a deterministic AST and renders it safely to HTML or React. That focus is a feature. It also means a site built around it still needs content discovery, navigation, search, themes and deployment.

TanStack Blog fills that gap without forking the parser.

## Parse once, render many

The pipeline parses every file at build time and caches the HTML string plus its heading list. The browser never downloads a Markdown parser or a syntax-highlight grammar. SSR and client output are identical because both consume the same pre-rendered data.

## Routing stays with TanStack

We deliberately did not generate one route module per content file. A single catch-all route maps a pathname to an entry, while TanStack Router keeps ownership of navigation, preloading and scroll restoration. Adding a page is adding a file.

## Themes as data

A theme is nine color tokens, three font stacks and a radius scale. Because the UI reads CSS variables, switching themes is a style recalculation, not a React remount. That made it practical to ship 25 anchored presets from the design recipe catalog.

## Search without a service

Orama runs in the browser over an index derived from build-time content. No API key, no external service, no runtime secret. Small sites can switch to the dependency-free local matcher with one config line.

## Try it

The site you are reading is the demo. Switch themes in the header, press `⌘K`, or read the [architecture notes](/docs/architecture).
