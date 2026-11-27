/** Ready-made page compositions used by the demo app and generated projects. */

import { type PressConfig, type PressTheme, tokensToCssVariables } from '@tanstack-blog/core'
import type { ContentEntry } from '@tanstack-blog/core/content/collection'
import { localizedThemeDescription, localizedThemeName } from '@tanstack-blog/themes'
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react'
import { enhanceCodeBlocks } from './code-block.js'
import { enhanceMarkdownComponents } from './components-enhance.js'
import { Dropdown } from './Dropdown.js'
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
export function Article({
  entry,
  sourceBase,
  t,
}: {
  entry: ContentEntry
  sourceBase?: string
  t?: (key: string) => string
}) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = root.current
    if (!element || !entry.html) return
    enhanceCodeBlocks(element, { sourceBase, file: entry.file })
    enhanceMarkdownComponents(element)
    element.querySelectorAll('a.heading-anchor').forEach((anchor) => {
      anchor.setAttribute('title', t?.('page.copyLink') ?? 'Copy link')
      anchor.addEventListener('click', async (event) => {
        event.preventDefault()
        const hash = anchor.getAttribute('href') ?? ''
        try {
          await navigator.clipboard.writeText(
            `${window.location.origin}${window.location.pathname}${hash}`,
          )
          anchor.textContent = '✓'
        } catch {
          anchor.textContent = '!'
        }
        window.setTimeout(() => {
          anchor.textContent = '#'
        }, 1400)
      })
    })
    return undefined
  }, [entry.file, entry.html, sourceBase, t])

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
      <span>{t('feedback.question')}</span>
      <button
        type="button"
        className={vote === 'yes' ? 'is-selected' : ''}
        onClick={() => cast('yes')}
      >
        <IconCheck /> {t('feedback.yes')}
      </button>
      <button
        type="button"
        className={vote === 'no' ? 'is-selected' : ''}
        onClick={() => cast('no')}
      >
        <IconClose /> {t('feedback.no')}
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
      <Article entry={entry} sourceBase={config?.editUrlBase} t={t} />
      {entry.updated ? (
        <p className="tb-updated">
          {t('page.updated')}: {entry.updated}
        </p>
      ) : null}
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
          <p className="tb-eyebrow">{t('label.component')}</p>
          <h1 className="tb-entry-title">{entry.title}</h1>
        </div>
      </div>
      <p className="tb-entry-description">{entry.description}</p>
      {example ? (
        <section className="tb-component-demo" aria-label="Live component example">
          <p className="tb-eyebrow">{t('api.liveExample')}</p>
          {example}
        </section>
      ) : null}
      <Article entry={entry} sourceBase={sourceBase} t={t} />
      {api ? (
        <section className="tb-api-section">
          <h2>
            {t('api.props')} <code>{api.name}</code>
          </h2>
          <p>{zh ? api.zh || api.description : api.description}</p>
          <table className="tb-api-table">
            <thead>
              <tr>
                <th>{t('api.prop')}</th>
                <th>{t('api.type')}</th>
                <th>{t('api.default')}</th>
                <th>{t('api.description')}</th>
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
                      <th>{t('api.prop')}</th>
                      <th>{t('api.type')}</th>
                      <th>{t('api.default')}</th>
                      <th>{t('api.description')}</th>
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
            {t('api.generated')} · {api.file}
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
      <p className="tb-eyebrow">{t('label.journal')}</p>
      <h1 className="tb-entry-title">{t('nav.blog')}</h1>
      <p className="tb-entry-description">{t('blog.intro')}</p>
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
  related = [],
}: {
  entry: ContentEntry
  t: (key: string) => string
  sourceBase?: string
  related?: ContentEntry[]
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
      <Article entry={entry} sourceBase={sourceBase} t={t} />
      {related.length ? (
        <section className="tb-related-posts">
          <h2>{t('blog.related')}</h2>
          <div className="tb-card-grid">
            {related.map((item) => (
              <a key={item.id} href={item.route} className="tb-post-card">
                <span className="tb-post-card-date">{item.date ?? '—'}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}
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
      <p className="tb-eyebrow">{t('label.gallery')}</p>
      <h1 className="tb-entry-title">{t('nav.components')}</h1>
      <p className="tb-entry-description">{t('components.description')}</p>
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

/** Compact token-driven sample used by comparison and previews. */
export function ThemeSample({
  theme,
  mode = 'dark',
  t,
  locale = 'en',
}: {
  theme: PressTheme
  mode?: 'light' | 'dark'
  t: (key: string) => string
  locale?: string
}) {
  const tokens = mode === 'dark' ? theme.dark : theme.light
  const cssVars = tokensToCssVariables(tokens) as Record<string, string>
  if (theme.fonts?.body) cssVars['--tb-font-body'] = theme.fonts.body
  if (theme.fonts?.display) cssVars['--tb-font-display'] = theme.fonts.display
  return (
    <div className="tb-theme-sample" style={cssVars as CSSProperties}>
      <div className="tb-preview-nav">
        <span className="tb-preview-brand">
          <IconComponents /> {localizedThemeName(theme, locale)}
        </span>
        <span>Docs</span>
        <span>Blog</span>
        <span>Themes</span>
      </div>
      <div className="tb-preview-body">
        <aside className="tb-preview-sidebar">
          <small>{t('group.getting-started')}</small>
          <span className="is-active">Introduction</span>
          <span>Installation</span>
          <span>Configuration</span>
        </aside>
        <article className="tb-preview-article">
          <p className="tb-preview-kicker">{t('theme.sample')}</p>
          <h2>Build something remarkable</h2>
          <p>A calm, token-driven documentation surface.</p>
          <div className="tb-preview-callout">Every color comes from this theme.</div>
          <div className="tb-preview-cards">
            <span>Type safe</span>
            <span>Pluggable</span>
          </div>
        </article>
      </div>
    </div>
  )
}

export function ThemeGallery({
  themes,
  activeId,
  onSelect,
  t,
  locale = 'en',
}: {
  themes: PressTheme[]
  activeId: string
  onSelect: (id: string) => void
  t: (key: string) => string
  locale?: string
}) {
  const [query, setQuery] = useState('')
  const [school, setSchool] = useState('all')
  const [compare, setCompare] = useState<string[]>([])
  const schools = [...new Set(themes.map((theme) => theme.school))].sort()
  const filtered = themes.filter(
    (theme) =>
      (school === 'all' || theme.school === school) &&
      `${theme.name} ${theme.id} ${theme.description}`.toLowerCase().includes(query.toLowerCase()),
  )

  const toggleCompare = (id: string) =>
    setCompare((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items.slice(-1), id],
    )

  return (
    <div className="tb-entry tb-standalone tb-theme-gallery">
      <p className="tb-eyebrow">{t('theme.marketplace')}</p>
      <h1 className="tb-entry-title">{t('nav.themes')}</h1>
      <p className="tb-entry-description">{t('theme.galleryIntro')}</p>

      <div className="tb-theme-filters">
        <label className="tb-theme-search">
          <IconSearch />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('theme.search')}
            aria-label={t('theme.search')}
          />
        </label>
        <Dropdown
          label={t('theme.allSchools')}
          value={school}
          onChange={setSchool}
          options={[
            { value: 'all', label: t('theme.allSchools') },
            ...schools.map((item) => ({ value: item, label: item.replace(/-/g, ' ') })),
          ]}
        />
        <span className="tb-theme-count">
          {filtered.length} / {themes.length}
        </span>
      </div>

      {compare.length === 2 ? (
        <div className="tb-compare-bar">
          <span>{compare.join(' ↔ ')}</span>
          <a
            className="tb-button is-primary"
            href={`/themes/compare?a=${compare[0]}&b=${compare[1]}`}
          >
            {t('theme.compareReady')} <IconArrowUpRight />
          </a>
          <button type="button" className="tb-button" onClick={() => setCompare([])}>
            {t('theme.compareClear')}
          </button>
        </div>
      ) : null}

      <div className="tb-theme-grid">
        {filtered.map((theme) => (
          <div
            key={theme.id}
            className={`tb-theme-card${theme.id === activeId ? ' is-active' : ''}`}
          >
            <a
              href={`/themes/${theme.id}`}
              className="tb-theme-card-link"
              aria-label={`${t('theme.sample')} ${localizedThemeName(theme, locale)}`}
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
                <strong>{localizedThemeName(theme, locale)}</strong>
                <small>{t(`school.${theme.school}`)}</small>
                <span>{localizedThemeDescription(theme, locale)}</span>
              </span>
              <IconArrowUpRight />
            </a>
            <div className="tb-theme-card-actions">
              <button
                type="button"
                className={`tb-theme-compare${compare.includes(theme.id) ? ' is-selected' : ''}`}
                onClick={() => toggleCompare(theme.id)}
                aria-label={`${t('theme.compare')} ${theme.name}`}
              >
                {compare.includes(theme.id) ? '✓' : '+'}
              </button>
              <button
                type="button"
                className="tb-theme-apply"
                onClick={() => onSelect(theme.id)}
                aria-label={`${t('theme.apply')} ${localizedThemeName(theme, locale)}`}
              >
                {t('theme.apply')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Side-by-side theme comparison. */
export function ThemeCompare({
  left,
  right,
  t,
  locale = 'en',
}: {
  left: PressTheme
  right: PressTheme
  t: (key: string) => string
  locale?: string
}) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  return (
    <div className="tb-entry tb-standalone">
      <p className="tb-eyebrow">{t('theme.compare')}</p>
      <h1 className="tb-entry-title">
        {left.name} ↔ {right.name}
      </h1>
      <div className="tb-mode-switch">
        {(['light', 'dark'] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={mode === value ? 'is-active' : ''}
            onClick={() => setMode(value)}
          >
            {t(`theme.${value}`)}
          </button>
        ))}
      </div>
      <div className="tb-compare-grid">
        <section>
          <h2>{localizedThemeName(left, locale)}</h2>
          <ThemeSample theme={left} mode={mode} t={t} locale={locale} />
        </section>
        <section>
          <h2>{localizedThemeName(right, locale)}</h2>
          <ThemeSample theme={right} mode={mode} t={t} locale={locale} />
        </section>
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
  locale = 'en',
}: {
  theme: PressTheme
  themes: PressTheme[]
  onApply: (id: string) => void
  t: (key: string) => string
  locale?: string
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
          <h1 className="tb-entry-title">{localizedThemeName(theme, locale)}</h1>
          <p className="tb-entry-description">{localizedThemeDescription(theme, locale)}</p>
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
            {t('theme.apply')}
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

      <section className="tb-theme-detail">
        <h2>{t('theme.tokens')}</h2>
        <table className="tb-api-table tb-theme-token-table">
          <thead>
            <tr>
              <th>{t('api.prop')}</th>
              <th>{t('theme.light')}</th>
              <th>{t('theme.dark')}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tokensToCssVariables(theme.light)).map(([key, value]) => (
              <tr key={key}>
                <td>
                  <code>{key}</code>
                </td>
                <td>
                  <span className="tb-token-swatch" style={{ background: value }} />{' '}
                  <code>{value}</code>
                </td>
                <td>
                  <span
                    className="tb-token-swatch"
                    style={{
                      background: (tokensToCssVariables(theme.dark) as Record<string, string>)[key],
                    }}
                  />{' '}
                  <code>{(tokensToCssVariables(theme.dark) as Record<string, string>)[key]}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tb-theme-install">
          <code>pnpm add @tanstack-blog/theme-{theme.id}</code>
          <button
            type="button"
            className="tb-button"
            onClick={() =>
              void navigator.clipboard.writeText(`pnpm add @tanstack-blog/theme-${theme.id}`)
            }
          >
            {t('theme.copyCommand')}
          </button>
          <button
            type="button"
            className="tb-button"
            onClick={() =>
              void navigator.clipboard.writeText(
                `:root{${Object.entries(tokensToCssVariables(tokens))
                  .map(([key, value]) => `${key}:${value};`)
                  .join('')}}`,
              )
            }
          >
            {t('theme.exportCss')}
          </button>
        </div>
      </section>

      <p className="tb-preview-other">
        {t('theme.other')}:{' '}
        {themes
          .filter((item) => item.id !== theme.id)
          .slice(0, 8)
          .map((item, index) => (
            <span key={item.id}>
              {index > 0 ? ' · ' : ''}
              <a href={`/themes/${item.id}`}>{localizedThemeName(item, locale)}</a>
            </span>
          ))}
      </p>
    </div>
  )
}

export function TutorialIndex({
  entries,
  t,
}: {
  entries: Array<{ id: string; title: string; description: string; route: string; order: number }>
  t: (key: string) => string
}) {
  const sorted = [...entries].sort((a, b) => a.order - b.order)
  return (
    <div className="tb-entry tb-standalone">
      <p className="tb-eyebrow">{t('nav.tutorials')}</p>
      <h1 className="tb-entry-title">{t('tutorials.title')}</h1>
      <p className="tb-entry-description">{t('tutorials.intro')}</p>
      <div className="tb-tutorial-list">
        {sorted.map((item, index) => (
          <a key={item.id} href={item.route} className="tb-tutorial-card">
            <span className="tb-tutorial-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="tb-tutorial-body">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </span>
            <IconArrowUpRight />
          </a>
        ))}
      </div>
    </div>
  )
}

export interface WikiPageData {
  id: string
  title: string
  route: string
  html: string
  headings: string[]
}

/**
 * Auto-generated knowledge base page. @zh 自动生成的知识库页面
 */
export interface WikiPageProps {
  /** All generated pages for the side navigation. @zh 侧边导航中的全部页面 */
  pages: WikiPageData[]
  /** Active page id. @zh 当前页面 id */
  activeId: string
  /** Translation function. @zh 翻译函数 */
  t: (key: string) => string
}

export function WikiPage({ pages, activeId, t }: WikiPageProps) {
  const active = pages.find((page) => page.id === activeId) ?? pages[0]
  if (!active) return <NotFound />
  const htmlProps = { dangerouslySetInnerHTML: { __html: active.html } }
  return (
    <div className="tb-entry tb-standalone tb-wiki-page">
      <Breadcrumbs items={[{ label: t('nav.wiki'), to: '/wiki' }, { label: active.title }]} />
      <p className="tb-eyebrow">{t('wiki.kicker')}</p>
      <h1 className="tb-entry-title">{active.title}</h1>
      <p className="tb-entry-description">{t('wiki.intro')}</p>
      <nav className="tb-wiki-nav" aria-label={t('nav.wiki')}>
        {pages.map((page) => (
          <a key={page.id} href={page.route} className={page.id === active.id ? 'is-active' : ''}>
            {page.title}
          </a>
        ))}
      </nav>
      <div className="tb-prose" {...htmlProps} />
    </div>
  )
}

export function HomeHero({ config, t }: { config: PressConfig; t: (key: string) => string }) {
  const cards = [
    {
      label: t('nav.docs'),
      href: '/docs',
      Icon: IconDocs,
      text: t('hero.cardDocs'),
    },
    {
      label: t('nav.blog'),
      href: '/blog',
      Icon: IconBlog,
      text: t('hero.cardBlog'),
    },
    {
      label: t('nav.themes'),
      href: '/themes',
      Icon: IconThemes,
      text: t('hero.cardThemes'),
    },
    {
      label: 'Search',
      href: '/docs/search',
      Icon: IconSearch,
      text: t('hero.cardSearch'),
    },
  ]
  return (
    <div className="tb-hero">
      <p className="tb-eyebrow">{t('hero.kicker')}</p>
      <h1>{config.title}</h1>
      <p className="tb-hero-lead">{t('hero.description')}</p>
      <div className="tb-hero-actions">
        <a className="tb-button is-primary" href="/docs">
          {t('hero.docs')} <IconArrowUpRight />
        </a>
        <a className="tb-button" href="/themes">
          {t('hero.themes')}
        </a>
        <button
          type="button"
          className="tb-button"
          onClick={() => window.dispatchEvent(new Event('tb:open-search'))}
        >
          {t('hero.search')} <IconSearch />
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
