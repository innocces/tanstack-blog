import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Y2K Retrofuturism theme, as an installable plugin. */
export const y2kTheme: PressTheme = defineTheme(getTheme('y2k')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function y2kThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-y2k', theme: y2kTheme }
}

export default y2kTheme
