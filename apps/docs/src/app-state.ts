/**
 * App-wide UI state lives outside route files so Fast Refresh and route code
 * splitting keep working. TanStack Store owns the state itself.
 */

import config from 'virtual:tanstack-blog/config'
import type { PressTheme } from '@tanstack-blog/core'
import { createTranslator } from '@tanstack-blog/core'
import { allThemes } from '@tanstack-blog/themes'
import { createUiStore } from '@tanstack-blog/ui'

export const store = createUiStore({
  themeId: config.theme.default,
  mode: 'system',
  locale: config.i18n.defaultLocale,
  version: config.currentVersion,
})

export const t = createTranslator(config.i18n.defaultLocale)

/**
 * Re-register a theme created in /themes/editor before ThemeProvider mounts.
 * This keeps the custom theme available in the dropdown after a reload.
 */
if (typeof window !== 'undefined') {
  try {
    const custom = JSON.parse(
      window.localStorage.getItem('tb:custom-theme') ?? 'null',
    ) as PressTheme | null
    if (custom?.id && !allThemes.some((theme) => theme.id === custom.id)) {
      allThemes.push(custom)
    }
  } catch {
    // malformed storage is ignored
  }
}
