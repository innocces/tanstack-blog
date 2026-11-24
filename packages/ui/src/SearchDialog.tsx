/** Command-palette search. The backend is an injected `SearchAdapter`. */

import { useStore } from '@tanstack/react-store'
import type { PressConfig } from '@tanstack-blog/core'
import type { SearchAdapter, SearchHit } from '@tanstack-blog/search'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconClose, IconSearch } from './icons.js'
import type { UiStore } from './store.js'

/**
 * @description Command-palette search dialog.
 * @description.zh 命令面板式搜索弹窗
 */
export interface SearchDialogProps {
  /**
   * @description Shared UI store controlling open state and locale.
   * @description.zh 控制开关状态与语言的全局 UI store
   */
  store: UiStore
  /**
   * @description Search adapter from `search` or `orama-search`.
   * @description.zh 来自 search 或 orama-search 包的搜索适配器
   */
  adapter: SearchAdapter
  /**
   * @description Resolved site configuration.
   * @description.zh 已解析的站点配置
   */
  config: PressConfig
  /**
   * @description Translation function.
   * @description.zh 翻译函数
   */
  t: (key: string) => string
  /**
   * @description Optional SPA navigation callback.
   * @description.zh 可选的客户端路由跳转回调
   */
  onNavigate?: (route: string) => void
}

export function SearchDialog({ store, adapter, config, t, onNavigate }: SearchDialogProps) {
  const open = useStore(store, (state) => state.searchOpen)
  const locale = useStore(store, (state) => state.locale)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('search') === '1') {
      store.setState((state) => ({ ...state, searchOpen: true }))
    }
    const onKey = (event: KeyboardEvent) => {
      const shortcut = (config.search.hotkey?.match(/[a-z]/i)?.[0] ?? 'k').toLowerCase()
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === shortcut) {
        event.preventDefault()
        store.setState((state) => ({ ...state, searchOpen: !state.searchOpen }))
      }
      if (event.key === 'Escape' && store.state.searchOpen) {
        store.setState((state) => ({ ...state, searchOpen: false }))
      }
    }
    const onOpen = () => store.setState((state) => ({ ...state, searchOpen: true }))
    window.addEventListener('keydown', onKey)
    window.addEventListener('tb:open-search', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('tb:open-search', onOpen)
    }
  }, [config.search.hotkey, store])

  useEffect(() => {
    if (open) {
      setQuery(new URLSearchParams(window.location.search).get('q') ?? '')
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    if (!open || !query.trim()) {
      setHits([])
      return
    }
    let cancelled = false
    void Promise.resolve(adapter.search(query, { locale, limit: 8 })).then((result) => {
      if (!cancelled) {
        setHits(result)
        setActive(0)
      }
    })
    return () => {
      cancelled = true
    }
  }, [adapter, locale, open, query])

  if (!open || typeof document === 'undefined') return null

  const navigate = (hit: SearchHit) => {
    store.setState((state) => ({ ...state, searchOpen: false }))
    if (onNavigate) onNavigate(hit.route)
    else window.location.assign(hit.route)
  }

  return createPortal(
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop click is a convenience; Escape and the close button are keyboard paths
    <div
      className="tb-search-backdrop"
      onMouseDown={() => store.setState((s) => ({ ...s, searchOpen: false }))}
    >
      <div
        className="tb-search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={t('search.placeholder')}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="tb-search-field">
          <IconSearch />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActive((value) => Math.min(value + 1, hits.length - 1))
              } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActive((value) => Math.max(value - 1, 0))
              } else if (event.key === 'Enter' && hits[active]) {
                event.preventDefault()
                navigate(hits[active]!)
              }
            }}
            placeholder={config.search.placeholder || t('search.placeholder')}
            aria-label={config.search.placeholder}
          />
          <button
            className="tb-icon-button"
            type="button"
            onClick={() => store.setState((s) => ({ ...s, searchOpen: false }))}
            aria-label="Close search"
          >
            <IconClose />
          </button>
        </div>

        <div className="tb-search-results">
          {query && hits.length === 0 ? (
            <p className="tb-search-empty">{t('search.noResults')}</p>
          ) : (
            hits.map((hit, index) => (
              <button
                key={hit.id}
                type="button"
                className={`tb-search-result${index === active ? ' is-active' : ''}`}
                onMouseEnter={() => setActive(index)}
                onClick={() => navigate(hit)}
              >
                <span className="tb-search-result-section">{hit.section}</span>
                <span className="tb-search-result-title">{hit.title}</span>
                {hit.description ? (
                  <span className="tb-search-result-desc">{hit.description}</span>
                ) : null}
              </button>
            ))
          )}
        </div>

        <div className="tb-search-footer">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
          <span className="tb-search-adapter">{adapter.id}</span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
