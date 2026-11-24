/**
 * Configuration schema and helpers for TanStack Blog.
 *
 * The schema is intentionally strict: a config that typechecks always produces
 * a fully resolved object, so downstream code never needs fallback branches.
 * This is the single source of truth shared by the Vite plugin and the UI.
 */
import { z } from 'zod'

const localeSchema = z.object({
  /** BCP-47 code used in URLs, e.g. `en`, `zh-CN`. */
  code: z.string().min(2),
  /** Human readable label shown in the locale switcher. */
  label: z.string().min(1),
  /** Text direction; RTL locales flip the sidebar and TOC automatically. */
  dir: z.enum(['ltr', 'rtl']).default('ltr'),
})

const modesSchema = z.object({
  /** Enable the reverse-chronological article list at `/blog`. */
  blog: z.boolean().default(true),
  /** Enable the sidebar-driven documentation tree at `/docs`. */
  docs: z.boolean().default(true),
  /** Enable the component gallery at `/components`. */
  components: z.boolean().default(false),
})

const themeSchema = z.object({
  /** Theme id used when no explicit theme is selected. */
  default: z.string().default('linear'),
  /** Show the runtime theme switcher in the header. */
  allowSwitch: z.boolean().default(true),
  /** localStorage key used to persist the user choice. */
  storeKey: z.string().default('tanstack-blog-theme'),
})

const searchSchema = z.object({
  /** `orama` builds an in-memory index, `local` is a dependency-free substring search. */
  provider: z.enum(['orama', 'local', 'none']).default('orama'),
  /** Placeholder text inside the command palette. */
  placeholder: z.string().default('Search documentation…'),
  /** Keyboard shortcut used to open search (display only). */
  hotkey: z.string().default('⌘K'),
  /** Index full Markdown bodies in addition to titles and descriptions. */
  includeContent: z.boolean().default(true),
})

const i18nSchema = z.object({
  locales: z
    .array(localeSchema)
    .min(1)
    .default([{ code: 'en', label: 'English', dir: 'ltr' }]),
  defaultLocale: z.string().default('en'),
  /** Prefix the default locale with its code, e.g. `/en/docs` instead of `/docs`. */
  alwaysPrefixLocale: z.boolean().default(false),
})

const analyticsSchema = z.object({
  /** Optional provider id; the framework only emits `data-*` hooks, never scripts. */
  provider: z.enum(['none', 'plausible', 'umami', 'custom']).default('none'),
  domain: z.string().optional(),
})

export const pressConfigSchema = z.object({
  /** Site name shown in the header, title tags and search index. */
  title: z.string().min(1),
  description: z.string().default(''),
  /** Absolute site URL, required for a correct sitemap and OpenGraph output. */
  siteUrl: z.string().optional(),
  /** Content root relative to the app directory. */
  contentDir: z.string().default('content'),
  /** Navigation links rendered in the header. */
  nav: z
    .array(z.object({ label: z.string(), to: z.string(), external: z.boolean().default(false) }))
    .default([]),
  /** Social links rendered in the footer. */
  social: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  modes: modesSchema.prefault({}),
  theme: themeSchema.prefault({}),
  search: searchSchema.prefault({}),
  i18n: i18nSchema.prefault({}),
  analytics: analyticsSchema.prefault({}),
  /** Extra links in the "Edit this page" footer. */
  editUrlBase: z.string().optional(),
  /** Repository URL used for contribution links. */
  repoUrl: z.string().optional(),
})

/** Input type: every field optional except title. */
export type PressConfigInput = z.input<typeof pressConfigSchema>
/** Fully resolved type: all defaults applied. */
export type PressConfig = z.output<typeof pressConfigSchema>
export type LocaleDefinition = z.output<typeof localeSchema>

/**
 * Identity helper that gives editors autocomplete and the fully-resolved type.
 * Defaults are still applied at runtime by `resolveConfig` inside the Vite plugin.
 * @param input Partial configuration; `title` is the only required field.
 */
export function defineConfig(input: PressConfigInput): PressConfig {
  return input as PressConfig
}

/** Apply schema defaults and validate a user configuration. */
export function resolveConfig(input: PressConfigInput): PressConfig {
  return pressConfigSchema.parse(input)
}

/** Build the localized route prefix for a locale. */
export function localePrefix(config: PressConfig, locale: string): string {
  if (!config.i18n.alwaysPrefixLocale && locale === config.i18n.defaultLocale) return ''
  return `/${locale}`
}
