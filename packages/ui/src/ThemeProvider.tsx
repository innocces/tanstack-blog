/**
 * Applies theme tokens as CSS custom properties on <html>. Because tokens are
 * plain CSS variables, switching themes cannot remount the React tree.
 */

import { useStore } from '@tanstack/react-store'
import { type PressTheme, tokensToCssVariables } from '@tanstack-blog/core'
import { type ReactNode, useEffect, useState } from 'react'
import type { ColorMode, UiStore } from './store.js'

/**
 * @description Applies theme tokens as CSS variables before hydration.
 * @description.zh 在水合前把主题令牌写成 CSS 变量
 */
export interface ThemeProviderProps {
  /**
   * @description Store holding theme and color mode.
   * @description.zh 保存主题与明暗模式的 store
   */
  store: UiStore
  /**
   * @description Registered themes available for switching.
   * @description.zh 可切换的已注册主题列表
   */
  themes: PressTheme[]
  /**
   * @description localStorage key used for persistence.
   * @description.zh 持久化使用的 localStorage 键名
   */
  storageKey: string
  /**
   * @description Application tree.
   * @description.zh 应用子树
   */
  children: ReactNode
}

const MODE_VALUES: ColorMode[] = ['light', 'dark', 'system']

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Inline boot script. It embeds every theme's tokens so the correct colors are
 * applied *before* hydration — no flash of the default theme on navigation.
 */
export function themeInitScript(
  defaultMode: ColorMode,
  storageKey: string,
  themes: PressTheme[] = [],
  defaultThemeId = '',
): string {
  const palette = Object.fromEntries(
    themes.map((theme) => [
      theme.id,
      {
        light: tokensToCssVariables(theme.light),
        dark: tokensToCssVariables(theme.dark),
      },
    ]),
  )
  return `(function(){try{
 var k=${JSON.stringify(storageKey)},m=${JSON.stringify(defaultMode)};
 var s=JSON.parse(localStorage.getItem(k)||'null')||{};
 if(s.mode&&${JSON.stringify(MODE_VALUES)}.indexOf(s.mode)>-1)m=s.mode;
 var d=window.matchMedia('(prefers-color-scheme: dark)').matches,r=m==='system'?(d?'dark':'light'):m;
 var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(r);
 e.dataset.mode=m;e.style.colorScheme=r;
 var id=s.themeId||${JSON.stringify(defaultThemeId)};
 var T=${JSON.stringify(palette)};var t=T[id];
 if(t){var tokens=t[r]||t.light;for(var key in tokens)e.style.setProperty(key,tokens[key]);e.dataset.theme=id;}
 }catch(e){}})();`
}

export function ThemeProvider({ store, themes, storageKey, children }: ThemeProviderProps) {
  const themeId = useStore(store, (state) => state.themeId)
  const mode = useStore(store, (state) => state.mode)
  const resolvedMode = useStore(store, (state) => state.resolvedMode)
  const locale = useStore(store, (state) => state.locale)

  const theme = themes.find((item) => item.id === themeId) ?? themes[0]

  useEffect(() => {
    // Restore persisted user preferences on mount.
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as { themeId?: string; mode?: ColorMode; locale?: string }
        store.setState((state) => ({
          ...state,
          themeId:
            parsed.themeId && themes.some((t) => t.id === parsed.themeId)
              ? parsed.themeId
              : state.themeId,
          mode: parsed.mode && MODE_VALUES.includes(parsed.mode) ? parsed.mode : state.mode,
          locale: parsed.locale ?? state.locale,
        }))
      }
    } catch {
      // Corrupted storage is ignored on purpose: theme is never critical state.
    }

    // URL params win over storage, which makes any theme state deep-linkable.
    const params = new URLSearchParams(window.location.search)
    const themeParam = params.get('theme')
    const modeParam = params.get('mode')
    if (themeParam && themes.some((item) => item.id === themeParam)) {
      store.setState((state) => ({ ...state, themeId: themeParam }))
    }
    if (modeParam === 'light' || modeParam === 'dark') {
      store.setState((state) => ({ ...state, mode: modeParam }))
    }
  }, [storageKey, store, themes])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const resolved = mode === 'system' ? (media.matches ? 'dark' : 'light') : mode
      store.setState((state) => ({ ...state, resolvedMode: resolved }))
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(resolved)
      root.dataset.mode = mode
      root.style.colorScheme = resolved
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [mode, store])

  useEffect(() => {
    if (!theme) return
    const tokens = resolvedMode === 'dark' ? theme.dark : theme.light
    const root = document.documentElement
    for (const [key, value] of Object.entries(tokensToCssVariables(tokens))) {
      root.style.setProperty(key, value)
    }
    if (theme.fonts?.body) root.style.setProperty('--tb-font-body', theme.fonts.body)
    if (theme.fonts?.display) root.style.setProperty('--tb-font-display', theme.fonts.display)
    if (theme.fonts?.mono) root.style.setProperty('--tb-font-mono', theme.fonts.mono)
    if (theme.radii) {
      root.style.setProperty('--tb-radius-sm', `${theme.radii[0]}px`)
      root.style.setProperty('--tb-radius-md', `${theme.radii[1]}px`)
      root.style.setProperty('--tb-radius-lg', `${theme.radii[2]}px`)
    }
    root.dataset.theme = theme.id

    let style = document.getElementById('tb-theme-css') as HTMLStyleElement | null
    if (!style) {
      style = document.createElement('style')
      style.id = 'tb-theme-css'
      document.head.appendChild(style)
    }
    style.textContent = theme.css ?? ''
  }, [resolvedMode, theme])

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ themeId, mode, locale }))
    } catch {
      // Private browsing can disable storage; the app still works in-memory.
    }
  }, [locale, mode, storageKey, themeId])

  return <>{children}</>
}

/** Convenience selector used by the theme switcher. */
export function useResolvedMode(store: UiStore): 'light' | 'dark' {
  return useStore(store, (state) => state.resolvedMode)
}

export function useSystemPrefersDark(): boolean {
  const [prefersDark, setPrefersDark] = useState(systemPrefersDark)
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setPrefersDark(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return prefersDark
}
