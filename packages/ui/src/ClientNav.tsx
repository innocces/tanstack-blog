/**
 * Intercepts same-origin anchor clicks (including links inside rendered
 * Markdown) so navigation stays client-side. This prevents full reloads,
 * the black flash between pages, and theme/locale state resets.
 */

import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export function ClientNav(): null {
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
      void router.navigate({ to: href as never })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [router])

  return null
}
