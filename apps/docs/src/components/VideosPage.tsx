/** Video gallery shared by the static route and the localized catch-all route. */

/** Video gallery, localized through the shared dictionary. */
const videos = [
  {
    src: '/videos/quickstart.mp4',
    title: 'Real CLI walkthrough',
    description:
      'The default flow: pnpm, docs + blog, Linear theme, Orama search, Cloudflare deploy.',
  },
  {
    src: '/videos/themes.mp4',
    title: 'A second real session',
    description: 'MUJI theme, local search and Vercel deploy chosen interactively.',
  },
]

export function VideosPage({ t }: { t: (key: string) => string }) {
  return (
    <div className="tb-entry tb-standalone">
      <p className="tb-eyebrow">{t('nav.videos')}</p>
      <h1 className="tb-entry-title">{t('videos.title')}</h1>
      <p className="tb-entry-description">{t('videos.intro')}</p>
      <div className="tb-card-grid">
        {videos.map((video) => (
          <article key={video.src} className="tb-video-card">
            {/* biome-ignore lint/a11y/useMediaCaption: silent CLI recording, no dialogue */}
            <video controls preload="metadata" src={video.src} aria-label={video.title} />
            <h2>{video.title}</h2>
            <p>{video.description}</p>
          </article>
        ))}
      </div>
      <p className="tb-entry-description" style={{ marginTop: 24 }}>
        <a href="/zh-CN/videos">{t('videos.zhLink')}</a>
      </p>
    </div>
  )
}
