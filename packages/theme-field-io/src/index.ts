import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Field.io theme, as an installable plugin. */
export const fieldIoTheme: PressTheme = defineTheme(getTheme('field-io')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function fieldIoThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-field-io', theme: fieldIoTheme }
}

export default fieldIoTheme
