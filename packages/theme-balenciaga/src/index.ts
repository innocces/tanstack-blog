import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Balenciaga theme, as an installable plugin. */
export const balenciagaTheme: PressTheme = defineTheme(getTheme('balenciaga')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function balenciagaThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-balenciaga', theme: balenciagaTheme }
}

export default balenciagaTheme
