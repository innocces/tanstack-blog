import { createFileRoute } from '@tanstack/react-router'
import { VideosPage } from '../components/VideosPage.js'

export const Route = createFileRoute('/videos')({ component: VideosPage })
