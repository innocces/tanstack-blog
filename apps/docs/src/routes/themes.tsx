import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { allThemes } from '@tanstack-blog/themes'
import { ThemeGallery } from '@tanstack-blog/ui'
import { store } from '../app-state.js'

export const Route = createFileRoute('/themes')({ component: ThemesPage })

function ThemesPage() {
  const themeId = useStore(store, (state) => state.themeId)
  return (
    <ThemeGallery
      themes={allThemes}
      activeId={themeId}
      onSelect={(id) => store.setState((state) => ({ ...state, themeId: id }))}
    />
  )
}
