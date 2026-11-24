import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Bloomberg Businessweek theme, as an installable plugin. */
export const businessweekTheme: PressTheme = defineTheme(getTheme('businessweek')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function businessweekThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-businessweek', theme: businessweekTheme }
}

export default businessweekTheme
