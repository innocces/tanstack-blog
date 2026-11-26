/** Header sub-components exposed as dumi-style slots. */
import { useStore } from '@tanstack/react-store'
import type { LocaleDefinition, PressConfig, PressTheme } from '@tanstack-blog/core'
import { localizedThemeName } from '@tanstack-blog/themes'
import { Dropdown } from './Dropdown.js'
import {
  IconLanguages,
  IconMoon,
  IconSearch,
  IconSun,
  IconSystem,
  IconThemes,
  TanStackMark,
} from './icons.js'
import type { UiStore } from './store.js'

/** @description Brand mark shown at the far left of the header. @description.zh 顶部最左侧的品牌图标 */
export interface BrandMarkProps {
  /** Optional extra class. @description.zh 可选附加类名 */
  className?: string
}

export function BrandMark({ className = '' }: BrandMarkProps) {
  return <TanStackMark className={`tb-brand-mark ${className}`} />
}

/** @description Primary navigation links. @description.zh 主导航链接 */
export interface NavProps {
  /** Resolved config. @description.zh 已解析的站点配置 */
  config: PressConfig
  /** Translation function. @description.zh 翻译函数 */
  t: (key: string) => string
}

/** Navigation links use native anchors so ClientNav can apply the locale prefix. */
export function Nav({ config, t }: NavProps) {
  return (
    <nav className="tb-main-nav" aria-label="Main navigation">
      {config.nav.length
        ? config.nav.map((item) => (
            <a key={item.to} href={item.to} target={item.external ? '_blank' : undefined}>
              {t(`nav.${item.label}`) === `nav.${item.label}` ? item.label : t(`nav.${item.label}`)}
            </a>
          ))
        : null}
    </nav>
  )
}

/** @description Color theme selector. @description.zh 明暗与主题选择器 */
export interface ThemeSwitcherProps {
  store: UiStore
  themes: PressTheme[]
  t: (key: string) => string
  allowSwitch: boolean
}

export function ThemeSwitcher({ store, themes, t, allowSwitch }: ThemeSwitcherProps) {
  const mode = useStore(store, (state) => state.mode)
  const themeId = useStore(store, (state) => state.themeId)
  const locale = useStore(store, (state) => state.locale)
  return (
    <div className="tb-header-tools">
      <div className="tb-mode-switch">
        {(['light', 'dark', 'system'] as const).map((value) => {
          const label = t(`theme.${value}`)
          const Icon = value === 'light' ? IconSun : value === 'dark' ? IconMoon : IconSystem
          return (
            <button
              key={value}
              type="button"
              className={mode === value ? 'is-active' : ''}
              title={label}
              aria-label={label}
              aria-pressed={mode === value}
              onClick={() => store.setState((state) => ({ ...state, mode: value }))}
            >
              <Icon />
            </button>
          )
        })}
      </div>
      {allowSwitch ? (
        <Dropdown
          label="Theme"
          icon={<IconThemes />}
          value={themeId}
          onChange={(id) => store.setState((state) => ({ ...state, themeId: id }))}
          options={themes.map((theme) => ({
            value: theme.id,
            label: localizedThemeName(theme, locale),
          }))}
        />
      ) : null}
    </div>
  )
}

/** @description Locale selector. @description.zh 语言选择器 */
export interface LocaleSwitcherProps {
  store: UiStore
  locales: LocaleDefinition[]
  t: (key: string) => string
  onLocaleChange: (locale: string) => void
}

export function LocaleSwitcher({ store, locales, t, onLocaleChange }: LocaleSwitcherProps) {
  const locale = useStore(store, (state) => state.locale)
  if (locales.length < 2) return null
  return (
    <Dropdown
      label={t('language.selector')}
      icon={<IconLanguages />}
      value={locale}
      onChange={(next) => {
        store.setState((state) => ({ ...state, locale: next }))
        onLocaleChange(next)
      }}
      options={locales.map((item) => ({ value: item.code, label: item.label }))}
    />
  )
}

/** @description Documentation version selector. @description.zh 文档版本选择器 */
export interface VersionSwitcherProps {
  store: UiStore
  versions: Array<{ code: string; label: string }>
  currentVersion: string
  t: (key: string) => string
  onVersionChange: (version: string) => void
}

export function VersionSwitcher({
  store,
  versions,
  currentVersion,
  t,
  onVersionChange,
}: VersionSwitcherProps) {
  const version = useStore(store, (state) => state.version)
  if (versions.length < 2) return null
  return (
    <Dropdown
      label={t('version.selector')}
      value={version}
      onChange={(next) => {
        store.setState((state) => ({ ...state, version: next }))
        onVersionChange(next)
      }}
      options={[
        { value: currentVersion, label: t('version.current') },
        ...versions.map((item) => ({ value: item.code, label: item.label })),
      ]}
    />
  )
}

/** @description Search button in the header. @description.zh 顶部搜索触发按钮 */
export interface SearchTriggerProps {
  store: UiStore
  config: PressConfig
  t: (key: string) => string
}

export function SearchTrigger({ store, config, t }: SearchTriggerProps) {
  return (
    <button
      className="tb-search-trigger"
      type="button"
      onClick={() => store.setState((state) => ({ ...state, searchOpen: true }))}
    >
      <IconSearch />
      <span>{config.search.placeholder || t('search.placeholder')}</span>
      <kbd>{config.search.hotkey}</kbd>
    </button>
  )
}
