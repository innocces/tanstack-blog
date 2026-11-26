/**
 * Single catch-all route for all generated content. TanStack Router still owns
 * navigation and params; the framework maps the path to a content entry.
 */

import config from 'virtual:tanstack-blog/config'
import { content, entries } from 'virtual:tanstack-blog/content'
import wikiPages from 'virtual:tanstack-blog/wiki'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createTranslator, localePrefix } from '@tanstack-blog/core'
import { allThemes, getTheme } from '@tanstack-blog/themes'
import {
  BlogIndex,
  BlogPost,
  Breadcrumbs,
  type ComponentApi,
  ComponentPage,
  ComponentsIndex,
  DocPage,
  DocShell,
  HomeHero,
  NotFound,
  Prose,
  persistUiState,
  Sidebar,
  ThemePreviewPage,
  Toc,
  useSlots,
} from '@tanstack-blog/ui'
import { useEffect } from 'react'
import uiApi from '../../../../packages/ui/api.json'
import { store } from '../app-state.js'
import { componentExamples } from '../components/examples.js'
import { VideosPage } from '../components/VideosPage.js'

export const Route = createFileRoute('/$')({ component: ContentRoute })

function ContentRoute() {
  const router = useRouter()
  const slots = useSlots()
  const {
    BlogIndex: BlogIndexSlot,
    BlogPost: BlogPostSlot,
    ComponentPage: ComponentPageSlot,
    ComponentsIndex: ComponentsIndexSlot,
    DocPage: DocPageSlot,
    DocShell: DocShellSlot,
    HomeHero: HomeHeroSlot,
    NotFound: NotFoundSlot,
    Sidebar: SidebarSlot,
    ThemePreviewPage: ThemePreviewPageSlot,
    WikiPage: WikiPageSlot,
    Toc: TocSlot,
    Breadcrumbs: BreadcrumbsSlot,
  } = slots
  const { _splat = '' } = Route.useParams()
  const segments = _splat.split('/').filter(Boolean)

  const urlLocale = config.i18n.locales.find((item) => item.code === segments[0])
  const hasLocalePrefix = Boolean(urlLocale)
  const locale = urlLocale?.code ?? config.i18n.defaultLocale
  const rest = hasLocalePrefix ? segments.slice(1) : segments

  useEffect(() => {
    // A stored locale wins on unprefixed URLs, so language survives a reload.
    let desired = locale
    if (!hasLocalePrefix) {
      try {
        const stored = JSON.parse(window.localStorage.getItem(config.theme.storeKey) ?? 'null') as {
          locale?: string
        } | null
        if (stored?.locale && config.i18n.locales.some((item) => item.code === stored.locale)) {
          desired = stored.locale
        }
      } catch {
        // ignore malformed storage
      }
    }
    if (store.state.locale !== desired) store.setState((state) => ({ ...state, locale: desired }))
    const definition = config.i18n.locales.find((item) => item.code === desired)
    document.documentElement.dir = definition?.dir ?? 'ltr'
  }, [hasLocalePrefix, locale])

  const t = createTranslator(locale)
  const fullRoute = `${localePrefix(config, locale)}/${rest.join('/')}`.replace(/\/$/, '') || '/'
  const entry = content.get(fullRoute, locale)
  useEffect(() => {
    if (entry) {
      document.title = `${entry.title} — ${config.title}`
      document.querySelector('meta[name="description"]')?.setAttribute('content', entry.description)
    }
  }, [entry])

  const [kind = ''] = rest

  if (kind === 'blog' && !config.modes.blog) return <NotFoundSlot />
  if (kind === 'components' && !config.modes.components) return <NotFoundSlot />
  if (kind === 'docs' && !config.modes.docs) return <NotFoundSlot />

  if (kind === 'videos') return <VideosPage t={t} />
  // Deterministic, LLM-free knowledge base generated from the repository.
  if (kind === 'wiki') {
    const page = rest[1] ? wikiPages.find((item) => item.id === rest[1]) : wikiPages[0]
    if (!page) return <NotFoundSlot />
    return <WikiPageSlot pages={wikiPages} activeId={page.id} t={t} />
  }

  // Dedicated preview route for every theme: /themes/<id>
  if (kind === 'themes' && rest[1]) {
    const theme = getTheme(rest[1])
    if (!theme) return <NotFoundSlot />
    return (
      <ThemePreviewPageSlot
        theme={theme}
        themes={allThemes}
        t={t}
        onApply={(id) => {
          store.setState((state) => ({ ...state, themeId: id }))
          persistUiState(store, config.theme.storeKey)
          void router.navigate({ to: '/themes' as never })
        }}
      />
    )
  }

  if (rest.length === 0) {
    return <HomeHeroSlot config={config} t={t} />
  }

  if (kind === 'docs' && !entry) {
    const docs = content.byType('docs', locale)
    return (
      <DocShellSlot sidebar={<SidebarSlot store={store} entries={entries} locale={locale} t={t} />}>
        <Prose>
          <BreadcrumbsSlot items={[{ label: t('nav.docs') }]} />
          <h1 className="tb-entry-title">Documentation</h1>
          <p className="tb-entry-description">
            Everything you need to configure, theme and deploy the framework.
          </p>
          <ul>
            {docs.map((item) => (
              <li key={item.id}>
                <a href={item.route}>{item.title}</a> — {item.description}
              </li>
            ))}
          </ul>
        </Prose>
      </DocShellSlot>
    )
  }

  if (kind === 'blog' && !entry) {
    return <BlogIndexSlot entries={content.byType('blog', locale)} t={t} />
  }

  if (kind === 'components' && !entry) {
    const items = content.byType('component', locale)
    const examples = Object.fromEntries(
      Object.entries(componentExamples).map(([key, factory]) => [key, factory({ t })]),
    )
    return <ComponentsIndexSlot entries={items} t={t} examples={examples} />
  }

  if (!entry) return <NotFoundSlot />

  const siblings = content.siblings(entry)

  if (entry.type === 'blog') {
    return (
      <DocShellSlot toc={<TocSlot headings={entry.headings} t={t} />}>
        <BlogPostSlot entry={entry} t={t} sourceBase={config.editUrlBase} />
      </DocShellSlot>
    )
  }

  if (entry.type === 'component') {
    const apiName = entry.meta.api as string | undefined
    const exampleKey = entry.meta.example as string | undefined
    const Example = exampleKey ? componentExamples[exampleKey] : undefined
    const api = apiName
      ? (uiApi[apiName as keyof typeof uiApi] as ComponentApi | undefined)
      : undefined
    return (
      <DocShellSlot toc={<TocSlot headings={entry.headings} t={t} />}>
        <ComponentPageSlot
          entry={entry}
          t={t}
          locale={locale}
          sourceBase={config.editUrlBase}
          api={api}
          catalog={uiApi as Record<string, ComponentApi>}
          example={Example ? <Example t={t} /> : undefined}
        />
      </DocShellSlot>
    )
  }

  if (entry.type === 'docs') {
    return (
      <DocShellSlot
        sidebar={<SidebarSlot store={store} entries={entries} locale={locale} t={t} />}
        toc={<TocSlot headings={entry.headings} t={t} />}
      >
        <DocPageSlot
          entry={entry}
          prev={siblings.prev}
          next={siblings.next}
          config={config}
          t={t}
        />
      </DocShellSlot>
    )
  }

  return <DocPageSlot entry={entry} config={config} t={t} />
}
