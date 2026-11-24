/**
 * Single catch-all route for all generated content. TanStack Router still owns
 * navigation and params; the framework maps the path to a content entry.
 */

import config from 'virtual:tanstack-blog/config'
import { content, entries } from 'virtual:tanstack-blog/content'
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
} from '@tanstack-blog/ui'
import { useEffect } from 'react'
import uiApi from '../../../../packages/ui/api.json'
import { store } from '../app-state.js'
import { componentExamples } from '../components/examples.js'
import { VideosPage } from '../components/VideosPage.js'

export const Route = createFileRoute('/$')({ component: ContentRoute })

function ContentRoute() {
  const router = useRouter()
  const { _splat = '' } = Route.useParams()
  const segments = _splat.split('/').filter(Boolean)

  let locale = config.i18n.defaultLocale
  let rest = segments
  if (segments[0] && config.i18n.locales.some((item) => item.code === segments[0])) {
    locale = segments[0]!
    rest = segments.slice(1)
  }

  useEffect(() => {
    if (store.state.locale !== locale) store.setState((state) => ({ ...state, locale }))
    const definition = config.i18n.locales.find((item) => item.code === locale)
    document.documentElement.dir = definition?.dir ?? 'ltr'
  }, [locale])

  const t = createTranslator(locale)
  const fullRoute = `${localePrefix(config, locale)}/${rest.join('/')}`.replace(/\/$/, '') || '/'
  const entry = content.get(fullRoute, locale)
  const [kind = ''] = rest

  if (kind === 'blog' && !config.modes.blog) return <NotFound />
  if (kind === 'components' && !config.modes.components) return <NotFound />
  if (kind === 'docs' && !config.modes.docs) return <NotFound />

  if (kind === 'videos') return <VideosPage />

  // Dedicated preview route for every theme: /themes/<id>
  if (kind === 'themes' && rest[1]) {
    const theme = getTheme(rest[1])
    if (!theme) return <NotFound />
    return (
      <ThemePreviewPage
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
    return <HomeHero config={config} t={t} />
  }

  if (kind === 'docs' && !entry) {
    const docs = content.byType('docs', locale)
    return (
      <DocShell sidebar={<Sidebar store={store} entries={entries} locale={locale} t={t} />}>
        <Prose>
          <Breadcrumbs items={[{ label: t('nav.docs') }]} />
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
      </DocShell>
    )
  }

  if (kind === 'blog' && !entry) {
    return <BlogIndex entries={content.byType('blog', locale)} t={t} />
  }

  if (kind === 'components' && !entry) {
    const items = content.byType('component', locale)
    const examples = Object.fromEntries(
      Object.entries(componentExamples).map(([key, factory]) => [key, factory({ t })]),
    )
    return <ComponentsIndex entries={items} t={t} examples={examples} />
  }

  if (!entry) return <NotFound />

  const siblings = content.siblings(entry)

  if (entry.type === 'blog') {
    return (
      <DocShell toc={<Toc headings={entry.headings} t={t} />}>
        <BlogPost entry={entry} t={t} sourceBase={config.editUrlBase} />
      </DocShell>
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
      <DocShell toc={<Toc headings={entry.headings} t={t} />}>
        <ComponentPage
          entry={entry}
          t={t}
          locale={locale}
          sourceBase={config.editUrlBase}
          api={api}
          catalog={uiApi as Record<string, ComponentApi>}
          example={Example ? <Example t={t} /> : undefined}
        />
      </DocShell>
    )
  }

  if (entry.type === 'docs') {
    return (
      <DocShell
        sidebar={<Sidebar store={store} entries={entries} locale={locale} t={t} />}
        toc={<Toc headings={entry.headings} t={t} />}
      >
        <DocPage entry={entry} prev={siblings.prev} next={siblings.next} config={config} t={t} />
      </DocShell>
    )
  }

  return <DocPage entry={entry} config={config} t={t} />
}
