import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Bloomberg Terminal theme, as an installable plugin. */
export const bloombergTerminalTheme: PressTheme = defineTheme(getTheme('bloomberg-terminal')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function bloombergTerminalThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-bloomberg-terminal', theme: bloombergTerminalTheme }
}

export default bloombergTerminalTheme
