import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Are.na theme, as an installable plugin. */
export const areNaTheme: PressTheme = defineTheme(getTheme('are-na')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function areNaThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-are-na', theme: areNaTheme }
}

export default areNaTheme
