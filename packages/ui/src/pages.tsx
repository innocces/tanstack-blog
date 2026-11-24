/** Ready-made page compositions used by the demo app and generated projects. */

import { type PressConfig, type PressTheme, tokensToCssVariables } from '@tanstack-blog/core'
import type { ContentEntry } from '@tanstack-blog/core/content/collection'
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react'
import { enhanceCodeBlocks } from './code-block.js'
import { enhanceMarkdownComponents } from './components-enhance.js'
import {
  IconArrowUpRight,
  IconBlog,
  IconCheck,
  IconClock,
  IconClose,
  IconComponents,
  IconDocs,
  IconSearch,
  IconThemes,
} from './icons.js'
import { Breadcrumbs, ExternalLink, PageNav, Toc } from './layout.js'

/** Build-time rendered Markdown injected as HTML; TanStack Markdown escapes raw HTML by default. */
export function Article({ entry, sourceBase }: { entry: ContentEntry; sourceBase?: string }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = root.current
    if (!element || !entry.html) return
    const cleanCode = enhanceCodeBlocks(element, { sourceBase, file: entry.file })
    const cleanComponents = enhanceMarkdownComponents(element)
    return () => {
      cleanCode()
      cleanComponents()
    }
  }, [entry.file, entry.html, sourceBase])

  // Build-time TanStack Markdown escapes raw HTML; keep the injected value out of JSX lint.
  const htmlProps = { dangerouslySetInnerHTML: { __html: entry.html } }
  return <article ref={root} className="tb-markdown" {...htmlProps} />
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="tb-prose">{children}</div>
}

/**
 * @description Lightweight yes/no page feedback widget.
 * @description.zh 轻量的是/否页面反馈组件
 */
export interface FeedbackProps {
  /**
   * @description Stable id used as the localStorage key.
   * @description.zh 用作 localStorage 键名的稳定 id
   */
  entryId: string
  /**
   * @description Translation function.
   * @description.zh 翻译函数
   */
  t: (key: string) => string
}

/** Lightweight page feedback, persisted locally like the rest of the UI state. */
export function Feedback({ entryId, t }: { entryId: string; t: (key: string) => string }) {
  const [vote, setVote] = useState<'yes' | 'no' | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      return JSON.parse(window.localStorage.getItem(`tb:feedback:${entryId}`) ?? 'null')
    } catch {
      return null
    }
  })
  const cast = (value: 'yes' | 'no') => {
    setVote(value)
    try {
      window.localStorage.setItem(`tb:feedback:${entryId}`, JSON.stringify(value))
    } catch {
      // storage is optional
    }
  }
  return (
    <section className="tb-feedback" aria-label="Page feedback">
      <span>Was this page helpful?</span>
      <button
        type="button"
        className={vote === 'yes' ? 'is-selected' : ''}
        onClick={() => cast('yes')}
      >
        <IconCheck /> Yes
      </button>
      <button
        type="button"
        className={vote === 'no' ? 'is-selected' : ''}
        onClick={() => cast('no')}
      >
        <IconClose /> No
      </button>
      {vote ? <small>{t('feedback.thanks')}</small> : null}
    </section>
  )
}

export interface DocPageProps {
  entry: ContentEntry
  prev?: ContentEntry
  next?: ContentEntry
  config: PressConfig
  t: (key: string) => string
}

export function DocPage({ entry, prev, next, config, t }: DocPageProps) {
  return (
    <div className="tb-entry">
      <Breadcrumbs
        items={[
          { label: t('nav.docs'), to: '/docs' },
          { label: entry.section },
          { label: entry.title },
        ]}
      />
      <h1 className="tb-entry-title">{entry.title}</h1>
      {entry.description ? <p className="tb-entry-description">{entry.description}</p> : null}
      <Article entry={entry} sourceBase={config?.editUrlBase} />
      {entry.updated ? <p className="tb-updated">Last updated: {entry.updated}</p> : null}
      <Feedback entryId={entry.id} t={t} />
      {config.editUrlBase ? (
        <ExternalLink href={`${config.editUrlBase.replace(/\/$/, '')}/${entry.file}`}>
          {t('page.edit')}
        </ExternalLink>
      ) : null}
      <PageNav prev={prev} next={next} t={t} />
    </div>
  )
}

export interface ComponentApi {
  name: string
  file: string
  description: string
  zh?: string
  props: Array<{
    name: string
    type: string
    required: boolean
    description: string
    zh?: string
    default?: string
  }>
}

/**
 * @description Component documentation page with a live example and TSDoc props table.
 * @description.zh 带实时示例与 TSDoc 属性表的组件文档页
 */
export interface ComponentPageProps {
  /**
   * @description Content entry for this component.
   * @description.zh 该组件对应的内容条目
   */
  entry: ContentEntry
  /**
   * @description Translation function.
   * @description.zh 翻译函数
   */
  t: (key: string) => string
  /**
   * @description Live example built from the ui package.
   * @description.zh 使用 ui 子包构建的实时示例
   */
  example?: ReactNode
  /**
   * @description Props metadata generated from TSDoc comments.
   * @description.zh 由 TSDoc 生成的属性元数据
   */
  api?: ComponentApi
  /**
   * @description Active locale for bilingual prop descriptions.
   * @description.zh 用于双语属性描述的语言代码
   */
  locale?: string
  /**
   * @description Base URL for "View source" links.
   * @description.zh “查看源码”链接的基础地址
   */
  sourceBase?: string
  /** Full API catalog used to expand nested prop types. @zh 用于展开嵌套属性类型的完整 API 目录 */
  catalog?: Record<string, ComponentApi>
}

/** Component documentation uses its own layout, not the blog article layout. */
export function ComponentPage({
  entry,
  t,
  example,
  api,
  locale = 'en',
  sourceBase,
  catalog,
}: ComponentPageProps) {
  const zh = locale.startsWith('zh')
  return (
    <div className="tb-entry tb-standalone tb-component-page">
      <Breadcrumbs
        items={[{ label: t('nav.components'), to: '/components' }, { label: entry.title }]}
      />
      <div className="tb-component-header">
        <span className="tb-component-icon">
          <IconComponents />
        </span>
        <div>
          <p className="tb-eyebrow">Component</p>
          <h1 className="tb-entry-title">{entry.title}</h1>
        </div>
      </div>
      <p className="tb-entry-description">{entry.description}</p>
      {example ? (
        <section className="tb-component-demo" aria-label="Live component example">
          <p className="tb-eyebrow">{zh ? '实时示例' : 'Live example'}</p>
          {example}
        </section>
      ) : null}
      <Article entry={entry} sourceBase={sourceBase} />
      {api ? (
        <section className="tb-api-section">
          <h2>
            {zh ? '属性' : 'Props'} <code>{api.name}</code>
          </h2>
          <p>{zh ? api.zh || api.description : api.description}</p>
          <table className="tb-api-table">
            <thead>
              <tr>
                <th>{zh ? '属性' : 'Prop'}</th>
                <th>{zh ? '类型' : 'Type'}</th>
                <th>{zh ? '默认值' : 'Default'}</th>
                <th>{zh ? '说明' : 'Description'}</th>
              </tr>
            </thead>
            <tbody>
              {api.props.map((prop) => (
                <tr key={prop.name}>
                  <td>
                    <code>{prop.name}</code>
                    {prop.required ? <em> *</em> : null}
                  </td>
                  <td>
                    <code>{prop.type}</code>
                  </td>
                  <td>{prop.default ?? '—'}</td>
                  <td>{zh ? prop.zh || prop.description : prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {api.props.map((prop) => {
            const match = prop.type.match(/^([A-Z]\w+)(\[\])?$/)
            const nested = match && catalog ? catalog[match[1]!] : undefined
            if (!nested) return null
            return (
              <div key={prop.name} className="tb-api-nested">
                <h3>
                  {prop.name} → <code>{nested.name}</code>
                </h3>
                <p>{zh ? nested.zh || nested.description : nested.description}</p>
                <table className="tb-api-table">
                  <thead>
                    <tr>
                      <th>{zh ? '属性' : 'Prop'}</th>
                      <th>{zh ? '类型' : 'Type'}</th>
                      <th>{zh ? '默认值' : 'Default'}</th>
                      <th>{zh ? '说明' : 'Description'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nested.props.map((item) => (
                      <tr key={item.name}>
                        <td>
                          <code>{item.name}</code>
                          {item.required ? <em> *</em> : null}
                        </td>
                        <td>
                          <code>{item.type}</code>
                        </td>
                        <td>{item.default ?? '—'}</td>
                        <td>{zh ? item.zh || item.description : item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })}
          <small>
            {zh ? '由 TSDoc 注释自动生成' : 'Generated from TSDoc comments'} · {api.file}
          </small>
        </section>
      ) : null}
      <Feedback entryId={entry.id} t={t} />
    </div>
  )
}

export function BlogIndex({ entries, t }: { entries: ContentEntry[]; t: (key: string) => string }) {
  const initial = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search)
  const [tag, setTag] = useState(initial.get('tag') ?? '')
  const [pageState, setPageState] = useState(Number(initial.get('page') ?? 1))
  const tags = [...new Set(entries.flatMap((entry) => entry.tags))].sort()
  const filtered = tag ? entries.filter((entry) => entry.tags.includes(tag)) : entries
  const pageSize = 6
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const page = Math.min(Math.max(1, pageState || 1), pages)
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  const update = (next: { tag?: string; page?: number }) => {
    const params = new URLSearchParams(window.location.search)
    if (next.tag !== undefined) {
      if (next.tag) params.set('tag', next.tag)
      else params.delete('tag')
      setTag(next.tag)
    }
    if (next.page !== undefined) {
      if (next.page > 1) params.set('page', String(next.page))
      else params.delete('page')
      setPageState(next.page)
    }
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }

  return (
    <div className="tb-entry tb-standalone tb-blog-index">
      <p className="tb-eyebrow">Journal</p>
      <h1 className="tb-entry-title">{t('nav.blog')}</h1>
      <p className="tb-entry-description">
        Notes on building docs, themes and developer tools with TanStack.
      </p>
      <div className="tb-tag-row">
        <button
          type="button"
          className={`tb-tag${tag === '' ? ' is-selected' : ''}`}
          onClick={() => update({ tag: '', page: 1 })}
        >
          {t('blog.all')}
        </button>
        {tags.map((item) => (
          <button
            key={item}
            type="button"
            className={`tb-tag${tag === item ? ' is-selected' : ''}`}
            onClick={() => update({ tag: tag === item ? '' : item, page: 1 })}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="tb-card-grid">
        {visible.map((entry) => (
          <a key={entry.id} href={entry.route} className="tb-post-card">
            <span className="tb-post-card-icon">
              <IconBlog />
            </span>
            <span className="tb-post-card-date">{entry.date ?? '—'}</span>
            <h2>{entry.title}</h2>
            <p>{entry.description}</p>
            <span className="tb-post-card-meta">
              <IconClock /> {entry.readingTime} {t('blog.readingTime')}
            </span>
          </a>
        ))}
      </div>
      {pages > 1 ? (
        <nav className="tb-pagination" aria-label="Blog pagination">
          <button type="button" disabled={page <= 1} onClick={() => update({ page: page - 1 })}>
            ←
          </button>
          <span>
            {page} / {pages}
          </span>
          <button type="button" disabled={page >= pages} onClick={() => update({ page: page + 1 })}>
            →
          </button>
        </nav>
      ) : null}
    </div>
  )
}

export function BlogPost({
  entry,
  t,
  sourceBase,
}: {
  entry: ContentEntry
  t: (key: string) => string
  sourceBase?: string
}) {
  return (
    <div className="tb-entry tb-standalone tb-blog-post">
      <Breadcrumbs items={[{ label: t('nav.blog'), to: '/blog' }, { label: entry.title }]} />
      <p className="tb-eyebrow">{entry.date}</p>
      <h1 className="tb-entry-title">{entry.title}</h1>
      {entry.description ? <p className="tb-entry-description">{entry.description}</p> : null}
      <div className="tb-tag-row">
        {entry.tags.map((tag) => (
          <span key={tag} className="tb-tag">
            {tag}
          </span>
        ))}
        <span className="tb-reading-time">
          <IconClock /> {entry.readingTime} {t('blog.readingTime')}
        </span>
      </div>
      <Article entry={entry} sourceBase={sourceBase} />
      <Feedback entryId={entry.id} t={t} />
    </div>
  )
}

export function ComponentsIndex({
  entries,
  t,
  examples = {},
}: {
  entries: ContentEntry[]
  t: (key: string) => string
  examples?: Record<string, ReactNode>
}) {
  return (
    <div className="tb-entry tb-standalone tb-components-index">
      <p className="tb-eyebrow">Gallery</p>
      <h1 className="tb-entry-title">{t('nav.components')}</h1>
      <p className="tb-entry-description">
        Reusable UI blocks from <code>@tanstack-blog/ui</code>, shown exactly as they render.
      </p>
      <div className="tb-component-grid">
        {entries.map((entry) => {
          const key = entry.meta.example as string | undefined
          return (
            <a key={entry.id} href={entry.route} className="tb-component-card">
              <div className="tb-component-card-preview">
                {key && examples[key] ? examples[key] : <IconComponents />}
              </div>
              <div className="tb-component-card-body">
                <strong>{entry.title}</strong>
                <p>{entry.description}</p>
                <span>{t('page.next')} →</span>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export function ThemeGallery({
  themes,
  activeId,
  onSelect,
}: {
  themes: PressTheme[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="tb-entry tb-standalone tb-theme-gallery">
      <p className="tb-eyebrow">Marketplace</p>
      <h1 className="tb-entry-title">Themes</h1>
      <p className="tb-entry-description">
        Every theme is a standalone package built on the same token contract. Open a preview to see
        it on a real docs layout, then apply it with one click.
      </p>
      <div className="tb-theme-grid">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`tb-theme-card${theme.id === activeId ? ' is-active' : ''}`}
          >
            <a
              href={`/themes/${theme.id}`}
              className="tb-theme-card-link"
              aria-label={`Preview ${theme.name}`}
            >
              <span className="tb-theme-swatches">
                <span style={{ background: theme.light.background }} />
                <span style={{ background: theme.light.surface }} />
                <span style={{ background: theme.light.accent }} />
                <span style={{ background: theme.dark.background }} />
                <span style={{ background: theme.dark.surface }} />
                <span style={{ background: theme.dark.accent }} />
              </span>
              <span className="tb-theme-card-body">
                <strong>{theme.name}</strong>
                <small>{theme.school.replace(/-/g, ' ')}</small>
                <span>{theme.description}</span>
              </span>
              <IconArrowUpRight />
            </a>
            <button
              type="button"
              className="tb-theme-apply"
              onClick={() => onSelect(theme.id)}
              aria-label={`Apply ${theme.name}`}
            >
              {theme.id === activeId ? 'Active' : 'Apply'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/** A full-page, interactive preview for one theme, in both color modes. */
export function ThemePreviewPage({
  theme,
  themes,
  onApply,
  t,
}: {
  theme: PressTheme
  themes: PressTheme[]
  onApply: (id: string) => void
  t: (key: string) => string
}) {
  const [mode, setMode] = useState<'light' | 'dark'>(() =>
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('mode') === 'light'
      ? 'light'
      : 'dark',
  )
  const tokens = mode === 'dark' ? theme.dark : theme.light
  const style = tokensToCssVariables(tokens) as CSSProperties
  const cssVars = style as Record<string, string>
  if (theme.fonts?.body) cssVars['--tb-font-body'] = theme.fonts.body
  if (theme.fonts?.display) cssVars['--tb-font-display'] = theme.fonts.display
  if (theme.fonts?.mono) cssVars['--tb-font-mono'] = theme.fonts.mono
  if (theme.radii) {
    cssVars['--tb-radius-sm'] = `${theme.radii[0]}px`
    cssVars['--tb-radius-md'] = `${theme.radii[1]}px`
    cssVars['--tb-radius-lg'] = `${theme.radii[2]}px`
  }

  return (
    <div className="tb-entry tb-standalone tb-theme-preview-page">
      <Breadcrumbs items={[{ label: t('nav.themes'), to: '/themes' }, { label: theme.name }]} />
      <div className="tb-preview-heading">
        <div>
          <p className="tb-eyebrow">{theme.school.replace(/-/g, ' ')} preview</p>
          <h1 className="tb-entry-title">{theme.name}</h1>
          <p className="tb-entry-description">{theme.description}</p>
        </div>
        <div className="tb-preview-actions">
          <div className="tb-mode-switch">
            {(['light', 'dark'] as const).map((value) => (
              <button
                key={value}
                type="button"
                className={mode === value ? 'is-active' : ''}
                aria-pressed={mode === value}
                onClick={() => setMode(value)}
              >
                {t(`theme.${value}`)}
              </button>
            ))}
          </div>
          <button type="button" className="tb-button is-primary" onClick={() => onApply(theme.id)}>
            Apply theme
          </button>
        </div>
      </div>

      <div className="tb-theme-preview" style={style} data-theme={theme.id}>
        <div className="tb-preview-nav">
          <span className="tb-preview-brand">
            <IconComponents /> {theme.name}
          </span>
          <span>Docs</span>
          <span>Blog</span>
          <span>Components</span>
        </div>
        <div className="tb-preview-body">
          <aside className="tb-preview-sidebar">
            <small>Getting started</small>
            <span className="is-active">Introduction</span>
            <span>Installation</span>
            <span>Configuration</span>
            <small>Fundamentals</small>
            <span>Themes</span>
            <span>Search</span>
          </aside>
          <article className="tb-preview-article">
            <p className="tb-preview-kicker">Documentation preview</p>
            <h2>Build something remarkable</h2>
            <p>
              Every component below reads its colors from this theme&apos;s tokens. Switch the mode
              above or apply the theme to the whole site.
            </p>
            <div className="tb-preview-callout">A calm, token-driven documentation surface.</div>
            <pre>
              <code>const theme = defineTheme({'{'}</code>
            </pre>
            <div className="tb-preview-cards">
              <span>Type safe</span>
              <span>Pluggable</span>
              <span>Local first</span>
            </div>
          </article>
        </div>
      </div>

      <p className="tb-preview-other">
        Other themes:{' '}
        {themes
          .filter((item) => item.id !== theme.id)
          .slice(0, 8)
          .map((item, index) => (
            <span key={item.id}>
              {index > 0 ? ' · ' : ''}
              <a href={`/themes/${item.id}`}>{item.name}</a>
            </span>
          ))}
      </p>
    </div>
  )
}

export function HomeHero({ config, t }: { config: PressConfig; t: (key: string) => string }) {
  const cards = [
    {
      label: t('nav.docs'),
      href: '/docs',
      Icon: IconDocs,
      text: 'A documentation tree generated from your Markdown files.',
    },
    {
      label: t('nav.blog'),
      href: '/blog',
      Icon: IconBlog,
      text: 'Reverse-chronological articles with tags and reading time.',
    },
    {
      label: t('nav.themes'),
      href: '/themes',
      Icon: IconThemes,
      text: 'Swappable design-token packages, no remount required.',
    },
    {
      label: 'Search',
      href: '/docs/search',
      Icon: IconSearch,
      text: 'Orama full-text or zero-dependency local search, offline.',
    },
  ]
  return (
    <div className="tb-hero">
      <p className="tb-eyebrow">Built on TanStack Start + TanStack Markdown</p>
      <h1>{config.title}</h1>
      <p className="tb-hero-lead">
        {config.description || 'Docs, blogs and component libraries. One framework.'}
      </p>
      <div className="tb-hero-actions">
        <a className="tb-button is-primary" href="/docs">
          Read the docs <IconArrowUpRight />
        </a>
        <a className="tb-button" href="/themes">
          Browse themes
        </a>
        <button
          type="button"
          className="tb-button"
          onClick={() => window.dispatchEvent(new Event('tb:open-search'))}
        >
          Try search <IconSearch />
        </button>
      </div>
      <div className="tb-hero-cards">
        {cards.map(({ label, href, Icon, text }) => (
          <a key={href} href={href} className="tb-hero-card">
            <Icon />
            <strong>{label}</strong>
            <span>{text}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="tb-entry tb-standalone tb-not-found">
      <p className="tb-eyebrow">404</p>
      <h1 className="tb-entry-title">Page not found</h1>
      <p className="tb-entry-description">
        The page you are looking for does not exist in this locale.
      </p>
      <a className="tb-button is-primary" href="/">
        Back home
      </a>
    </div>
  )
}
