import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Vignelli / Swiss theme, as an installable plugin. */
export const swissTheme: PressTheme = defineTheme(getTheme('swiss')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function swissThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-swiss', theme: swissTheme }
}

export default swissTheme
