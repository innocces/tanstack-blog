import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Edward Tufte theme, as an installable plugin. */
export const tufteTheme: PressTheme = defineTheme(getTheme('tufte')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function tufteThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-tufte', theme: tufteTheme }
}

export default tufteTheme
