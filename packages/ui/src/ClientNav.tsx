/**
 * Intercepts same-origin anchor clicks (including links inside rendered
 * Markdown) so navigation stays client-side. It also carries the active locale
 * onto unprefixed internal links, so switching language survives navigation.
 */

import { useRouter } from '@tanstack/react-router'
import type { PressConfig } from '@tanstack-blog/core'
import { useEffect } from 'react'
import type { UiStore } from './store.js'

export interface ClientNavProps {
  store: UiStore
  config: PressConfig
}

export function ClientNav({ store, config }: ClientNavProps): null {
  const router = useRouter()

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a')
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return
      const href = anchor.getAttribute('href')
      if (!href?.startsWith('/') || href.startsWith('//')) return

      event.preventDefault()
      const locale = store.state.locale
      let destination = href
      if (locale !== config.i18n.defaultLocale) {
        const prefix = `/${locale}`
        const [pathname, suffix = ''] = href.split('?')
        const localizedPath = pathname === '/' ? prefix : `${prefix}${pathname}`
        if (!pathname?.startsWith(prefix)) {
          destination = `${localizedPath}${suffix ? `?${suffix}` : ''}`
        }
      }
      void router.navigate({ to: destination as never })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [config.i18n.defaultLocale, router, store])

  return null
}
