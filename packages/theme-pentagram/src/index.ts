import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Pentagram theme, as an installable plugin. */
export const pentagramTheme: PressTheme = defineTheme(getTheme('pentagram')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function pentagramThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-pentagram', theme: pentagramTheme }
}

export default pentagramTheme
