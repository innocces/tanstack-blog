import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Stripe Press theme, as an installable plugin. */
export const stripePressTheme: PressTheme = defineTheme(getTheme('stripe-press')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function stripePressThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-stripe-press', theme: stripePressTheme }
}

export default stripePressTheme
