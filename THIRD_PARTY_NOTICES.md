# Third-Party Notices

[English](./THIRD_PARTY_NOTICES.md) · [简体中文](./THIRD_PARTY_NOTICES.zh-CN.md)

This file inventories the open-source components used by TanStack Blog. Version ranges are the ones declared in `package.json` files at the time of writing; the lockfile is authoritative.

| Package | License | Used for |
| --- | --- | --- |
| `@tanstack/react-start` | MIT | Full-stack React framework, SSR, server routes |
| `@tanstack/react-router` | MIT | Type-safe routing and navigation |
| `@tanstack/markdown` | MIT | Markdown parsing and HTML rendering |
| `@tanstack/highlight` | MIT | Build-time syntax highlighting and token themes |
| `@tanstack/store` | MIT | Framework-agnostic state store |
| `@tanstack/react-store` | MIT | React bindings for the store |
| `@tanstack/react-devtools` | MIT | Development tooling (scaffold template) |
| `react`, `react-dom` | MIT | UI runtime |
| `vite` | MIT | Build tool and dev server |
| `@vitejs/plugin-react` | MIT | React Fast Refresh |
| `nitro` | MIT | Universal deployment server |
| `@orama/orama` | Apache-2.0 | Full-text search index |
| `zod` | MIT | Configuration validation |
| `gray-matter` | MIT | Frontmatter parsing |
| `@clack/prompts` | MIT | Interactive CLI prompts |
| `@biomejs/biome` | Apache-2.0 | Linting and formatting |
| `typescript` | Apache-2.0 | Type checking and package builds |
| `wrangler` | Apache-2.0 | Cloudflare deployment (dev dependency) |

## Design references

The 25 theme presets are original token translations of palettes described in the `web-design-engineer` skill's style recipe catalog. The catalog references real brands and studios (Linear, MUJI, Stripe Press, Are.na, and others). Those names and any associated logos or imagery remain the property of their owners. No brand assets are bundled with this framework.

## Fonts

The default theme references Inter Tight and JetBrains Mono. Font files are not bundled; consuming applications load fonts themselves and are responsible for their licenses.

## Trademarks

TanStack is a trademark of TanStack LLC. This project is independent and is not endorsed by TanStack LLC.
