/** Template functions for generated projects. Kept in code so the CLI is a single installable file set. */

export interface ScaffoldOptions {
  name: string
  packageManager: 'pnpm' | 'npm' | 'yarn' | 'bun'
  modes: { blog: boolean; docs: boolean; components: boolean }
  theme: string
  locales: string[]
  search: 'orama' | 'local' | 'none'
  deploy: 'cloudflare' | 'vercel' | 'netlify' | 'node'
  git: boolean
}

const PM_INSTALL: Record<ScaffoldOptions['packageManager'], string> = {
  pnpm: 'pnpm install',
  npm: 'npm install',
  yarn: 'yarn install',
  bun: 'bun install',
}

const PM_DEV: Record<ScaffoldOptions['packageManager'], string> = {
  pnpm: 'pnpm dev',
  npm: 'npm run dev',
  yarn: 'yarn dev',
  bun: 'bun dev',
}

const PM_BUILD: Record<ScaffoldOptions['packageManager'], string> = {
  pnpm: 'pnpm build',
  npm: 'npm run build',
  yarn: 'yarn build',
  bun: 'bun run build',
}

/** Escape a value for embedding in generated TypeScript source. */
function q(value: string): string {
  return JSON.stringify(value)
}

export function projectFiles(options: ScaffoldOptions): Record<string, string> {
  const localeObjects = options.locales
    .map((code) => `    { code: ${q(code)}, label: ${q(code)}, dir: 'ltr' }`)
    .join(',\n')

  const files: Record<string, string> = {}

  files['package.json'] = `{
  "name": ${q(options.name)},
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev --port 3000",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@tanstack-blog/core": "^0.1.0",
    "@tanstack-blog/ui": "^0.1.0",
    "@tanstack-blog/themes": "^0.1.0",
    "@tanstack-blog/search": "^0.1.0",
    "@tanstack-blog/orama-search": "^0.1.0",
    "@tanstack/react-router": "^1.170.46",
    "@tanstack/react-start": "^1.169.7",
    "@tanstack/react-store": "^0.11.2",
    "@tanstack/store": "^0.11.2",
    "nitro": "^3.0.260610-beta",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@tanstack/router-plugin": "^1.169.0",
    "@vitejs/plugin-react": "^6.0.1",
    "@types/node": "^22.10.2",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "typescript": "^6.0.2",
    "vite": "^8.0.0"
  }
}
`

  files['vite.config.ts'] = `import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { tanstackBlog } from '@tanstack-blog/core/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import config from './app.config.js'

export default defineConfig({
  plugins: [
    tanstackBlog({ config }),
    nitro(),
    tanstackStart(),
    viteReact(),
  ],
})
`

  files['app.config.ts'] = `import { defineConfig } from '@tanstack-blog/core'

export default defineConfig({
  title: ${q(options.name)},
  description: 'A docs and blog site built with TanStack Blog.',
  contentDir: 'content',
  modes: {
    blog: ${options.modes.blog},
    docs: ${options.modes.docs},
    components: ${options.modes.components},
  },
  theme: { default: ${q(options.theme)}, allowSwitch: true },
  search: { provider: ${q(options.search)} },
  i18n: {
    defaultLocale: ${q(options.locales[0] ?? 'en')},
    locales: [
${localeObjects}
    ],
  },
  social: [{ label: 'TanStack', href: 'https://tanstack.com' }],
})
`

  files['tsconfig.json'] = `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "types": ["node", "vite/client"]
  },
  "include": ["src", "app.config.ts"]
}
`

  files['src/router.tsx'] =
    `import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen.js'

export function getRouter() {
  return createTanStackRouter({ routeTree, scrollRestoration: true, defaultPreload: 'intent' })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
`

  const searchAdapterImport =
    options.search === 'orama'
      ? `import { createOramaSearchAdapter } from '@tanstack-blog/orama-search'\n`
      : `import { createLocalSearchAdapter } from '@tanstack-blog/search'\n`
  const searchAdapterExpr =
    options.search === 'orama'
      ? 'createOramaSearchAdapter(searchData)'
      : 'createLocalSearchAdapter(searchData)'

  files['src/theme.config.tsx'] = `import type { ThemeSlots } from '@tanstack-blog/ui'

/** Dumi-style slot overrides. Any omitted slot falls back to the built-in component. */
export const themeSlots: Partial<ThemeSlots> = {}
`

  files['src/app-state.ts'] = `import { createTranslator } from '@tanstack-blog/core'
import { createUiStore } from '@tanstack-blog/ui'
import config from 'virtual:tanstack-blog/config'

/** App-wide state lives outside route files so Fast Refresh keeps working. */
export const store = createUiStore({
  themeId: config.theme.default,
  mode: 'system',
  locale: config.i18n.defaultLocale,
})
export const t = createTranslator(config.i18n.defaultLocale)
`

  files['src/routes/__root.tsx'] =
    `import { HeadContent, Scripts, createRootRoute, useRouter } from '@tanstack/react-router'
import {
  ClientNav,
  SlotsProvider,
  useSlots,
  ThemeProvider,
  SearchDialog,
  themeInitScript,
} from '@tanstack-blog/ui'
import { allThemes, getTheme } from '@tanstack-blog/themes'
import { switchLocaleRoute } from '@tanstack-blog/core'
${searchAdapterImport}import config from 'virtual:tanstack-blog/config'
import { store, t } from '../app-state.js'
import { themeSlots } from '../theme.config.js'
import searchData from 'virtual:tanstack-blog/search-data'
import '@tanstack-blog/ui/styles.css'

const theme = getTheme(config.theme.default) ?? allThemes[0]!
const searchAdapter = ${searchAdapterExpr}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: config.title },
      { name: 'description', content: config.description },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={config.i18n.defaultLocale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript('system', config.theme.storeKey, allThemes, config.theme.default) }} />
        <HeadContent />
      </head>
      <body>
        <SlotsProvider slots={themeSlots}>
          <AppChrome>{children}</AppChrome>
        </SlotsProvider>
        <Scripts />
      </body>
    </html>
  )
}

function AppChrome({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { Header, Footer, SearchDialog, BackToTop } = useSlots()
  const navigate = (route: string) => void router.navigate({ to: route as never })
  const onLocaleChange = (locale: string) => {
    store.setState((state) => ({ ...state, locale }))
    navigate(switchLocaleRoute(config, window.location.pathname, locale))
  }
  return (
    <ThemeProvider store={store} themes={allThemes} storageKey={config.theme.storeKey}>
      <ClientNav store={store} config={config} />
      <BackToTop />
      <div className="tb-app">
        <Header store={store} config={config} themes={allThemes} locales={config.i18n.locales} t={t} onLocaleChange={onLocaleChange} />
        <div className="tb-app-body">{children}</div>
        <Footer config={config} t={t} />
      </div>
      ${options.search === 'none' ? '' : `<SearchDialog store={store} adapter={searchAdapter} config={config} t={t} onNavigate={navigate} />`}
    </ThemeProvider>
  )
}

export { theme }
`

  files['src/routes/index.tsx'] = `import { createFileRoute } from '@tanstack/react-router'
import { HomeHero } from '@tanstack-blog/ui'
import config from 'virtual:tanstack-blog/config'
import { t } from './__root.js'

export const Route = createFileRoute('/')({ component: () => <HomeHero config={config} t={t} /> })
`

  files['src/routes/$.tsx'] = `import { createFileRoute } from '@tanstack/react-router'
import { DocPage, DocShell, Sidebar, Toc, BlogIndex, BlogPost, ComponentsIndex, HomeHero, NotFound } from '@tanstack-blog/ui'
import { createTranslator, localePrefix } from '@tanstack-blog/core'
import config from 'virtual:tanstack-blog/config'
import { content, entries } from 'virtual:tanstack-blog/content'
import { store } from '../app-state.js'

export const Route = createFileRoute('/$')({ component: ContentRoute })

/** One route maps every Markdown file to a page; adding content needs no code. */
function ContentRoute() {
  const { _splat = '' } = Route.useParams()
  const segments = _splat.split('/').filter(Boolean)
  let locale = config.i18n.defaultLocale
  let rest = segments
  if (segments[0] && config.i18n.locales.some((item) => item.code === segments[0])) {
    locale = segments[0]!
    rest = segments.slice(1)
  }

  const t = createTranslator(locale)
  const route = \`\${localePrefix(config, locale)}/\${rest.join('/')}\`.replace(/\\/$/, '') || '/'
  const entry = content.get(route, locale)
  const kind = rest[0] ?? ''

  if (rest.length === 0) return <HomeHero config={config} t={t} />
  if (kind === 'blog' && !entry) return <BlogIndex entries={content.byType('blog', locale)} t={t} />
  if (kind === 'components' && !entry)
    return <ComponentsIndex entries={content.byType('component', locale)} t={t} />
  if (!entry) return <NotFound />

  if (entry.type === 'docs') {
    const siblings = content.siblings(entry)
    return (
      <DocShell
        sidebar={<Sidebar store={store} entries={entries} locale={locale} t={t} />}
        toc={<Toc headings={entry.headings} t={t} />}
      >
        <DocPage entry={entry} prev={siblings.prev} next={siblings.next} config={config} t={t} />
      </DocShell>
    )
  }
  return <BlogPost entry={entry} t={t} />
}
`

  files['src/routes/themes.tsx'] = `import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { ThemeGallery } from '@tanstack-blog/ui'
import { allThemes } from '@tanstack-blog/themes'
import { store } from '../app-state.js'

export const Route = createFileRoute('/themes')({ component: ThemesPage })

function ThemesPage() {
  const themeId = useStore(store, (state) => state.themeId)
  return (
    <ThemeGallery
      themes={allThemes}
      activeId={themeId}
      onSelect={(id) => store.setState((state) => ({ ...state, themeId: id }))}
    />
  )
}
`

  files['src/vite-env.d.ts'] = `/// <reference types="vite/client" />
declare module 'virtual:tanstack-blog/*' {
  const value: any
  export default value
  export const entries: any
  export const content: any
}
`

  files['content/en/index.md'] = `---
title: Home
description: Welcome to your new TanStack Blog site.
---

# Welcome

Edit \`content/en/index.md\` to change this page.
`

  files['content/en/docs/getting-started.md'] = `---
title: Getting Started
description: The first document in your new documentation site.
order: 1
---

# Getting Started

This page is Markdown. It was parsed at build time with **TanStack Markdown**.

## Next steps

- Add more files under \`content/en/docs\`.
- Switch themes from the header.
- Press \`⌘K\` to search.
`

  if (options.modes.blog) {
    files['content/en/blog/hello-world.md'] = `---
title: Hello World
description: Your first article.
date: 2026-01-01
tags: [announcement, tanstack]
---

# Hello World

This is your first blog post. Write in Markdown and it appears at \`/blog\`.
`
  }

  if (options.modes.components) {
    files['content/en/components/callout.md'] = `---
title: Callout
description: A reusable documentation callout.
order: 1
---

# Callout

> [!TIP] Built in
> Callouts are provided by the TanStack Markdown docs preset.
`
  }

  files['.gitignore'] = `node_modules
.output
.nitro
.tanstack
.wrangler
dist
.env
.DS_Store
`

  files['README.md'] = `# ${options.name}

Generated with **TanStack Blog**.

## Commands

- ${PM_DEV[options.packageManager]} — start the dev server
- ${PM_BUILD[options.packageManager]} — production build
- ${PM_INSTALL[options.packageManager]} — install dependencies

## Deploy

Target: **${options.deploy}**. See https://tanstack.com/start/latest for the full deployment matrix.
`

  if (options.deploy === 'cloudflare') {
    files['wrangler.toml'] = `name = "${options.name}"
compatibility_date = "2026-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".output/public"
`
  }
  if (options.deploy === 'vercel') {
    files['vercel.json'] = `{
  "framework": null,
  "buildCommand": "${PM_BUILD[options.packageManager]}",
  "outputDirectory": ".output/public"
}
`
  }
  if (options.deploy === 'netlify') {
    files['netlify.toml'] = `[build]
  command = "${PM_BUILD[options.packageManager]}"
  publish = ".output/public"
`
  }

  return files
}
