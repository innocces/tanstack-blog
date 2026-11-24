import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Mid-Century Modern theme, as an installable plugin. */
export const midCenturyTheme: PressTheme = defineTheme(getTheme('mid-century')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function midCenturyThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-mid-century', theme: midCenturyTheme }
}

export default midCenturyTheme
