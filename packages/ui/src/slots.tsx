/**
 * Dumi-inspired theme composition.
 *
 * A theme can override any slot independently; unprovided slots fall back to
 * the built-in implementation. This makes whole-site customization possible
 * without forking the framework or patching its components.
 */
import { type ComponentType, createContext, type ReactNode, useContext, useMemo } from 'react'
import {
  BackToTop,
  Breadcrumbs,
  DocShell,
  type HeaderProps,
  PageNav,
  Sidebar,
  type SidebarProps,
  SiteFooter,
  SiteHeader,
  Toc,
} from './layout.js'
import {
  Article,
  BlogIndex,
  BlogPost,
  ComponentPage,
  type ComponentPageProps,
  ComponentsIndex,
  DocPage,
  Feedback,
  HomeHero,
  NotFound,
  ThemeGallery,
  ThemePreviewPage,
} from './pages.js'
import { SearchDialog, type SearchDialogProps } from './SearchDialog.js'

export interface ThemeSlots {
  /** Site header, including brand, nav and controls. */
  Header: ComponentType<HeaderProps>
  /** Site footer. */
  Footer: ComponentType<{ config: HeaderProps['config']; t: (key: string) => string }>
  /** Left documentation tree. */
  Sidebar: ComponentType<SidebarProps>
  /** Right-hand table of contents. */
  Toc: ComponentType<{
    headings: Array<{ id: string; text: string; level: number }>
    t: (key: string) => string
  }>
  /** Command-palette search. */
  SearchDialog: ComponentType<SearchDialogProps>
  /** Rendered Markdown article (the "builtins" layer). */
  Article: ComponentType<Parameters<typeof Article>[0]>
  /** Page-level compositions. */
  DocPage: ComponentType<Parameters<typeof DocPage>[0]>
  BlogIndex: ComponentType<Parameters<typeof BlogIndex>[0]>
  BlogPost: ComponentType<Parameters<typeof BlogPost>[0]>
  ComponentPage: ComponentType<ComponentPageProps>
  ComponentsIndex: ComponentType<Parameters<typeof ComponentsIndex>[0]>
  ThemeGallery: ComponentType<Parameters<typeof ThemeGallery>[0]>
  ThemePreviewPage: ComponentType<Parameters<typeof ThemePreviewPage>[0]>
  HomeHero: ComponentType<Parameters<typeof HomeHero>[0]>
  WikiPage: ComponentType<{ title: string; html: string; route?: string }>
  NotFound: ComponentType<Record<string, never>>
  /** Floating controls. */
  BackToTop: ComponentType<Record<string, never>>
  Feedback: ComponentType<Parameters<typeof Feedback>[0]>
  Breadcrumbs: ComponentType<Parameters<typeof Breadcrumbs>[0]>
  PageNav: ComponentType<Parameters<typeof PageNav>[0]>
  DocShell: ComponentType<Parameters<typeof DocShell>[0]>
}

/** Built-in defaults; every key has an implementation. */
export const defaultThemeSlots: ThemeSlots = {
  Header: SiteHeader,
  Footer: SiteFooter,
  Sidebar,
  Toc,
  SearchDialog,
  Article,
  DocPage,
  BlogIndex,
  BlogPost,
  ComponentPage,
  ComponentsIndex,
  ThemeGallery,
  ThemePreviewPage,
  HomeHero,
  WikiPage: ({ title, html }) => {
    const props = { dangerouslySetInnerHTML: { __html: html } }
    return (
      <section>
        <h1>{title}</h1>
        <div {...props} />
      </section>
    )
  },
  NotFound,
  BackToTop,
  Feedback,
  Breadcrumbs,
  PageNav,
  DocShell,
}

const SlotsContext = createContext<ThemeSlots>(defaultThemeSlots)

export interface SlotsProviderProps {
  /** Partial override map supplied by a custom theme. */
  slots?: Partial<ThemeSlots>
  children: ReactNode
}

export function SlotsProvider({ slots, children }: SlotsProviderProps) {
  const merged = useMemo(() => ({ ...defaultThemeSlots, ...slots }), [slots])
  return <SlotsContext.Provider value={merged}>{children}</SlotsContext.Provider>
}

/** Resolve all slots. Use in a layout component under `SlotsProvider`. */
export function useSlots(): ThemeSlots {
  return useContext(SlotsContext)
}

/** Resolve one slot by name, with built-in fallback. */
export function useSlot<K extends keyof ThemeSlots>(name: K): ThemeSlots[K] {
  return useContext(SlotsContext)[name]
}
