/**
 * App-wide UI state lives outside route files so Fast Refresh and route code
 * splitting keep working. TanStack Store owns the state itself.
 */

import config from 'virtual:tanstack-blog/config'
import { createTranslator } from '@tanstack-blog/core'
import { createUiStore } from '@tanstack-blog/ui'

export const store = createUiStore({
  themeId: config.theme.default,
  mode: 'system',
  locale: config.i18n.defaultLocale,
  version: config.currentVersion,
})

export const t = createTranslator(config.i18n.defaultLocale)
