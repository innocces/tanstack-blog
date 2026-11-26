/**
 * Site-wide slot overrides (dumi-style).
 *
 * Every key in `ThemeSlots` can be replaced independently; anything omitted
 * falls back to the built-in component from @tanstack-blog/ui. A theme package
 * can export this object, so whole-site customization needs no framework fork.
 *
 * Example:
 *   import { SiteHeader } from '@tanstack-blog/ui'
 *   export const themeSlots: Partial<ThemeSlots> = {
 *     Header: (props) => <SiteHeader {...props} title="Acme" />,
 *   }
 */
import type { ThemeSlots } from '@tanstack-blog/ui'

export const themeSlots: Partial<ThemeSlots> = {}
