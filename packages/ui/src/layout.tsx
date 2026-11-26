/** Shared layout primitives. All styling is token-driven via @tanstack-blog/ui/styles.css. */

import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import type { LocaleDefinition, PressConfig, PressTheme } from '@tanstack-blog/core'
import type { ContentEntry, Heading } from '@tanstack-blog/core/content/collection'
import { type ReactNode, useEffect, useState } from 'react'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconExternal,
  IconGitHub,
  IconLanguages,
  IconMenu,
  IconMoon,
  IconSearch,
  IconSun,
  IconSystem,
  IconThemes,
  TanStackMark,
} from './icons.js'
import { useSlot, useSlots } from './slots.js'
import type { UiStore } from './store.js'

/** TanStack Router is fully typed; content-driven routes are cast at the boundary. */
function SmartLink({
  to,
  children,
  className,
  title,
}: {
  to: string
  children: ReactNode
  className?: string
  title?: string
}) {
  return (
    <Link
      to={to as never}
      className={className}
      title={title}
      activeProps={{ className: 'is-active' }}
    >
      {children}
    </Link>
  )
}

export interface HeaderProps {
  store: UiStore
  config: PressConfig
  themes: PressTheme[]
  locales: LocaleDefinition[]
  t: (key: string) => string
  /** Navigate to the equivalent route in the chosen locale. */
  onLocaleChange?: (locale: string) => void
}

export function SiteHeader({ store, config, themes, locales, t, onLocaleChange }: HeaderProps) {
  const sidebarOpen = useStore(store, (state) => state.sidebarOpen)
  const { BrandMark, Nav, ThemeSwitcher, LocaleSwitcher, SearchTrigger } = useSlots()

  return (
    <header className="tb-header">
      <div className="tb-header-inner">
        <button
          className="tb-icon-button tb-menu-button"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => store.setState((state) => ({ ...state, sidebarOpen: !state.sidebarOpen }))}
        >
          <IconMenu />
        </button>

        <a href="/" className="tb-brand">
          <BrandMark />
          <span>{t('site.title') || config.title}</span>
        </a>

        <Nav config={config} t={t} />

        <div className="tb-header-actions">
          <SearchTrigger store={store} config={config} t={t} />
          <ThemeSwitcher
            store={store}
            themes={themes}
            t={t}
            allowSwitch={config.theme.allowSwitch}
          />
          <LocaleSwitcher
            store={store}
            locales={locales}
            t={t}
            onLocaleChange={onLocaleChange ?? (() => {})}
          />
          {config.repoUrl ? (
            <a
              className="tb-icon-button"
              href={config.repoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <IconGitHub />
            </a>
          ) : null}
        </div>
      </div>
      {sidebarOpen ? (
        <button
          className="tb-sidebar-scrim"
          type="button"
          aria-label="Close navigation"
          onClick={() => store.setState((s) => ({ ...s, sidebarOpen: false }))}
        />
      ) : null}
    </header>
  )
}

export interface SidebarProps {
  store: UiStore
  entries: ContentEntry[]
  locale: string
  t: (key: string) => string
  extraLinks?: { label: string; to: string }[]
}

export function Sidebar({ store, entries, locale, t, extraLinks = [] }: SidebarProps) {
  const open = useStore(store, (state) => state.sidebarOpen)
  const [collapsed, setCollapsed] = useState<string[]>([])
  const docs = entries
    .filter((entry) => entry.type === 'docs' && entry.locale === locale)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
  const groupRank = ['Getting Started', 'Fundamentals', 'Guides', 'Reference', 'Community']
  const groups = [...new Set(docs.map((entry) => entry.group ?? entry.section))].sort((a, b) => {
    const rankA = groupRank.indexOf(a)
    const rankB = groupRank.indexOf(b)
    if (rankA !== -1 || rankB !== -1) {
      return (rankA === -1 ? 99 : rankA) - (rankB === -1 ? 99 : rankB)
    }
    const orderA = Math.min(...docs.filter((d) => (d.group ?? d.section) === a).map((d) => d.order))
    const orderB = Math.min(...docs.filter((d) => (d.group ?? d.section) === b).map((d) => d.order))
    return orderA - orderB
  })

  return (
    <aside className={`tb-sidebar${open ? ' is-open' : ''}`} aria-label={t('nav.docs')}>
      <div className="tb-sidebar-inner">
        {extraLinks.map((link) => (
          <SmartLink key={link.to} to={link.to} className="tb-sidebar-section-link">
            {link.label}
          </SmartLink>
        ))}
        {groups.map((group) => {
          const isCollapsed = collapsed.includes(group)
          return (
            <div key={group} className="tb-sidebar-group">
              <button
                type="button"
                className="tb-sidebar-title tb-sidebar-group-toggle"
                aria-expanded={!isCollapsed}
                onClick={() =>
                  setCollapsed((items) =>
                    items.includes(group)
                      ? items.filter((item) => item !== group)
                      : [...items, group],
                  )
                }
              >
                <span>{t(`group.${group.toLowerCase().replace(/\s+/g, '-')}`)}</span>
                <IconChevronDown className={isCollapsed ? 'is-collapsed' : ''} />
              </button>
              {!isCollapsed ? (
                <ul>
                  {docs
                    .filter((entry) => (entry.group ?? entry.section) === group)
                    .map((entry) => (
                      <li key={entry.id}>
                        <SmartLink to={entry.route}>{entry.title}</SmartLink>
                      </li>
                    ))}
                </ul>
              ) : null}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export function Toc({ headings, t }: { headings: Heading[]; t: (key: string) => string }) {
  if (!headings.length) return null
  return (
    <aside className="tb-toc" aria-label={t('toc.title')}>
      <p className="tb-toc-title">{t('toc.title')}</p>
      <ul>
        {headings.map((heading) => (
          <li key={heading.id} className={`tb-toc-level-${heading.level}`}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="tb-breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${item.to ?? 'current'}`}>
          {index > 0 ? <IconChevronRight className="tb-breadcrumb-sep" /> : null}
          {item.to ? (
            <SmartLink to={item.to}>{item.label}</SmartLink>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export function PageNav({
  prev,
  next,
  t,
}: {
  prev?: ContentEntry
  next?: ContentEntry
  t: (key: string) => string
}) {
  if (!prev && !next) return null
  return (
    <nav className="tb-page-nav" aria-label="Page navigation">
      {prev ? (
        <SmartLink to={prev.route} className="tb-page-nav-link">
          <IconChevronLeft />
          <span>
            <small>{t('page.prev')}</small>
            <strong>{prev.title}</strong>
          </span>
        </SmartLink>
      ) : (
        <span />
      )}
      {next ? (
        <SmartLink to={next.route} className="tb-page-nav-link is-next">
          <span>
            <small>{t('page.next')}</small>
            <strong>{next.title}</strong>
          </span>
          <IconChevronRight />
        </SmartLink>
      ) : (
        <span />
      )}
    </nav>
  )
}

export function SiteFooter({ config, t }: { config: PressConfig; t: (key: string) => string }) {
  return (
    <footer className="tb-footer">
      <div className="tb-footer-inner">
        <span>{config.description || t('footer.builtWith')}</span>
        <div className="tb-footer-links">
          {config.social.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
              <IconExternal />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export function DocShell({
  sidebar,
  children,
  toc,
}: {
  sidebar?: ReactNode
  children: ReactNode
  toc?: ReactNode
}) {
  return (
    <div className={`tb-doc-shell${sidebar ? '' : ' is-wide'}${toc ? ' has-toc' : ''}`}>
      {sidebar}
      <div className="tb-content-column">
        <main className="tb-main">{children}</main>
      </div>
      {toc}
    </div>
  )
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
      <IconExternal />
    </a>
  )
}

/** Floating back-to-top control, shown after the reader scrolls. */
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!visible) return null
  return (
    <button
      type="button"
      className="tb-back-to-top"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <IconChevronDown className="is-up" />
    </button>
  )
}
