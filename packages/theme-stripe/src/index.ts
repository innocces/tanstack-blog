import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Editorial theme for longform content and component libraries. */
export const stripePressTheme: PressTheme = defineTheme(getTheme('stripe-press')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function stripePressThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-stripe-press', theme: stripePressTheme }
}

export default stripePressTheme
