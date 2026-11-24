import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Active Theory theme, as an installable plugin. */
export const activeTheoryTheme: PressTheme = defineTheme(getTheme('active-theory')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function activeTheoryThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-active-theory', theme: activeTheoryTheme }
}

export default activeTheoryTheme
