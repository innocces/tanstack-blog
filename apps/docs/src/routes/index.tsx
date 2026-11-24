import config from 'virtual:tanstack-blog/config'
import { createFileRoute } from '@tanstack/react-router'
import { HomeHero } from '@tanstack-blog/ui'
import { t } from '../app-state.js'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <HomeHero config={config} t={t} />
      <section className="tb-brand-strip" aria-label="Built with TanStack">
        <p>Powered by the TanStack ecosystem</p>
        <div className="tb-brand-row">
          <img
            className="tb-brand-wordmark"
            src="/brand/tanstack-landscape-white.svg"
            alt="TanStack"
          />
          <span>TanStack Start</span>
          <span>TanStack Router</span>
          <span>TanStack Markdown</span>
          <span>TanStack Highlight</span>
          <span>TanStack Store</span>
        </div>
      </section>
    </>
  )
}
