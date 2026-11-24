import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Raycast theme, as an installable plugin. */
export const raycastTheme: PressTheme = defineTheme(getTheme('raycast')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function raycastThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-raycast', theme: raycastTheme }
}

export default raycastTheme
