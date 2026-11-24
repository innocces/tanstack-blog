import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Aesop theme, as an installable plugin. */
export const aesopTheme: PressTheme = defineTheme(getTheme('aesop')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function aesopThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-aesop', theme: aesopTheme }
}

export default aesopTheme
