<!-- Mirrored from apps/docs/content/en/docs/getting-started.md. Edit the source, not this file. -->

---
title: Getting Started
description: Create a docs, blog or component-library site in a few minutes.
group: Getting Started
order: 1
updated: 2026-02-01
---

# Getting Started

TanStack Blog is a thin, opinionated layer on top of [TanStack Start](https://tanstack.com/start/latest) and [TanStack Markdown](https://tanstack.com/markdown/latest). Start handles routing, SSR and deployment; Markdown handles parsing and rendering; this framework supplies content discovery, themes, search, i18n and the layouts that tie them together.

> [!NOTE] What TanStack Markdown actually is
> TanStack Markdown is a **small synchronous parser and renderer**, not a docs framework. It has no "blog mode" route of its own. The docs preset gives it callouts, heading collection and comment components. TanStack Blog builds the site around it.

## Scaffold a project

The fastest path is the interactive CLI:

```sh
pnpm dlx @tanstack-blog/cli create-tanstack-blog
# or run the binary directly after installing
npx create-tanstack-blog my-docs
```

The TUI asks for your package manager, content modes, default theme, languages, search provider and deploy target, then writes a ready-to-run project. See [CLI](./cli.md) for every prompt.

## Manual setup

Install the packages into a TanStack Start app:

```sh
pnpm add @tanstack-blog/core @tanstack-blog/ui @tanstack-blog/themes
pnpm add @tanstack/react-start @tanstack/react-router @tanstack/react-store
```

Register the Vite plugin. It parses Markdown at build time and exposes three virtual modules:

```ts title="vite.config.ts"
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { tanstackBlog } from '@tanstack-blog/core/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import config from './app.config'

export default defineConfig({
  plugins: [tanstackBlog({ config }), nitro(), tanstackStart(), viteReact()],
})
```

Define your site:

```ts title="app.config.ts"
import { defineConfig } from '@tanstack-blog/core'

export default defineConfig({
  title: 'My Docs',
  description: 'A short description used in meta tags and search.',
  modes: { docs: true, blog: true, components: false },
  theme: { default: 'linear', allowSwitch: true },
  search: { provider: 'orama' },
})
```

Then compose the root document:

```tsx title="src/routes/__root.tsx"
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { SiteHeader, SiteFooter, ThemeProvider, SearchDialog, createUiStore } from '@tanstack-blog/ui'
import { allThemes } from '@tanstack-blog/themes'
import config from '../../app.config'

const store = createUiStore({ themeId: config.theme.default })

export const Route = createRootRoute({
  head: () => ({ meta: [{ charSet: 'utf-8' }, { title: config.title }] }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><HeadContent /></head>
      <body>
        <ThemeProvider store={store} themes={allThemes} storageKey={config.theme.storeKey}>
          <SiteHeader store={store} config={config} themes={allThemes} locales={config.i18n.locales} t={(k) => k} />
          {children}
          <SiteFooter config={config} t={(k) => k} />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
```

## Add content

Files are discovered by convention — no route manifest to maintain:

```text
content/
  en/
    index.md                  -> /
    docs/getting-started.md   -> /docs/getting-started
    blog/hello-world.md       -> /blog/hello-world
    components/callout.md     -> /components/callout
  zh-CN/
    docs/getting-started.md   -> /zh-CN/docs/getting-started
```

## Video tutorial

Watch the [12-second quickstart](/videos) and the [theme marketplace tour](/videos). Clips are real CLI sessions recorded through a pseudo-terminal.

## Run it

```sh
pnpm dev       # http://localhost:3000
pnpm build     # SSR build via Nitro
```

Press `⌘K` / `Ctrl+K` for search, use the header controls to switch theme and color mode, and switch languages from the locale selector.
