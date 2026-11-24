import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Headspace theme, as an installable plugin. */
export const headspaceTheme: PressTheme = defineTheme(getTheme('headspace')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function headspaceThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-headspace', theme: headspaceTheme }
}

export default headspaceTheme
