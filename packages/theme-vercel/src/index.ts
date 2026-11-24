import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Vercel Mesh theme, as an installable plugin. */
export const vercelTheme: PressTheme = defineTheme(getTheme('vercel')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function vercelThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-vercel', theme: vercelTheme }
}

export default vercelTheme
