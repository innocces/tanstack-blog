import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** MUJI / Kenya Hara theme, as an installable plugin. */
export const mujiTheme: PressTheme = defineTheme(getTheme('muji')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function mujiThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-muji', theme: mujiTheme }
}

export default mujiTheme
