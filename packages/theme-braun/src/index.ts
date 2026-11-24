import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Dieter Rams / Braun theme, as an installable plugin. */
export const braunTheme: PressTheme = defineTheme(getTheme('braun')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function braunThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-braun', theme: braunTheme }
}

export default braunTheme
