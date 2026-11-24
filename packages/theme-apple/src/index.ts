import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Apple HIG theme, as an installable plugin. */
export const appleTheme: PressTheme = defineTheme(getTheme('apple')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function appleThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-apple', theme: appleTheme }
}

export default appleTheme
