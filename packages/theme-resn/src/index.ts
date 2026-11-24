import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Resn Storytelling theme, as an installable plugin. */
export const resnTheme: PressTheme = defineTheme(getTheme('resn')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function resnThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-resn', theme: resnTheme }
}

export default resnTheme
