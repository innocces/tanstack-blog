import { createFileRoute } from '@tanstack/react-router'
import { t } from '../app-state.js'
import { VideosPage } from '../components/VideosPage.js'

export const Route = createFileRoute('/videos')({ component: () => <VideosPage t={t} /> })
