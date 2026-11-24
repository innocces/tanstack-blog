import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** New York Times theme, as an installable plugin. */
export const nytTheme: PressTheme = defineTheme(getTheme('nyt')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function nytThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-nyt', theme: nytTheme }
}

export default nytTheme
