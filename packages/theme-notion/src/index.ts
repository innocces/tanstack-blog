import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Notion (Classic) theme, as an installable plugin. */
export const notionTheme: PressTheme = defineTheme(getTheme('notion')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function notionThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-notion', theme: notionTheme }
}

export default notionTheme
