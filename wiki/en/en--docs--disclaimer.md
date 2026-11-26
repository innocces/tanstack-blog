<!-- Mirrored from apps/docs/content/en/docs/disclaimer.md. Edit the source, not this file. -->

---
title: Disclaimer & Licenses
description: What this framework is, what it is not, and the licenses of everything it uses.
group: Reference
order: 4
updated: 2026-02-01
---

# Disclaimer & Licenses

## Project status

TanStack Blog is an independent community project. It is **not** an official TanStack product and is not endorsed or maintained by TanStack LLC. It builds on TanStack libraries, whose trademarks belong to their respective owners.

The framework is provided "as is", without warranty of any kind. Always evaluate it against your own security, accessibility and licensing requirements before production use.

## TanStack Markdown scope

TanStack Markdown is a parser/renderer, not a site generator. This framework supplies the site layer. If you expected a built-in blog mode in TanStack Markdown itself, that feature does not exist in the library; the blog behavior here is implemented by this project.

## License

The framework source is MIT licensed. See `LICENSE` at the repository root.

## Third-party components

A full inventory with versions and license IDs lives in `THIRD_PARTY_NOTICES.md`. Highlights:

| Component | License | Used for |
| --- | --- | --- |
| TanStack Start, Router, Markdown, Highlight, Store | MIT | Framework foundation |
| React, React DOM | MIT | UI runtime |
| Vite | MIT | Build tool |
| Nitro | MIT | Deployment server |
| Orama | Apache-2.0 | Full-text search |
| Zod | MIT | Config validation |
| gray-matter | MIT | Frontmatter parsing |
| Clack | MIT | CLI prompts |
| Biome | Apache-2.0 | Linting and formatting |

Design recipe names and references belong to their respective brands and studios. The token presets are original translations of publicly described palettes; no brand logos or protected imagery are bundled. Google Fonts, when used, are loaded by the consuming application under their own licenses.

## Reporting a licensing issue

Open an issue with the package name, version and the specific concern. We will update `THIRD_PARTY_NOTICES.md` in the next patch release.
