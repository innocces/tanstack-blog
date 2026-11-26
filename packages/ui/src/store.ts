/** Global UI state, owned by TanStack Store so it survives React tree changes. */
import { Store } from '@tanstack/store'

export type ColorMode = 'light' | 'dark' | 'system'

export interface UiState {
  themeId: string
  mode: ColorMode
  resolvedMode: 'light' | 'dark'
  locale: string
  version: string
  searchOpen: boolean
  sidebarOpen: boolean
}

export interface UiStateInit {
  themeId: string
  mode?: ColorMode
  locale?: string
  version?: string
}

/** Create a fresh store; the app owns one instance and passes it to providers. */
export function createUiStore(init: UiStateInit): Store<UiState> {
  return new Store<UiState>({
    themeId: init.themeId,
    mode: init.mode ?? 'system',
    resolvedMode: 'light',
    locale: init.locale ?? 'en',
    version: init.version ?? 'current',
    searchOpen: false,
    sidebarOpen: false,
  })
}

export type UiStore = ReturnType<typeof createUiStore>

/** Persist the current UI state synchronously, e.g. before a redirect. */
export function persistUiState(store: UiStore, storageKey: string): void {
  try {
    const { themeId, mode, locale, version } = store.state
    window.localStorage.setItem(storageKey, JSON.stringify({ themeId, mode, locale, version }))
  } catch {
    // storage may be unavailable; in-memory state still works
  }
}
