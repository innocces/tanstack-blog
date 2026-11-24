import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { getTheme } from '@tanstack-blog/themes'

/** Mailchimp (Freddie) theme, as an installable plugin. */
export const mailchimpTheme: PressTheme = defineTheme(getTheme('mailchimp')!)

export interface ThemePlugin {
  name: string
  theme: PressTheme
}

export function mailchimpThemePlugin(): ThemePlugin {
  return { name: 'tanstack-blog-theme-mailchimp', theme: mailchimpTheme }
}

export default mailchimpTheme
