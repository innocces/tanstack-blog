import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Linear theme, as an installable plugin. */
export const linearTheme: PressTheme = defineTheme(getTheme('linear')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function linearThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-linear', theme: linearTheme }
}

export default linearTheme
