import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Monocle Magazine theme, as an installable plugin. */
export const monocleTheme: PressTheme = defineTheme(getTheme('monocle')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function monocleThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-monocle', theme: monocleTheme }
}

export default monocleTheme
