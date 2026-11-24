/** Video gallery shared by the static route and the localized catch-all route. */

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

export function VideosPage() {
  return (
    <div className="tb-entry tb-standalone">
      <p className="tb-eyebrow">Tutorials</p>
      <h1 className="tb-entry-title">Video guides</h1>
      <p className="tb-entry-description">
        Real terminal sessions: the scaffolder is driven through a pseudo-terminal, the output is
        captured frame by frame, and encoded to MP4. No scripted reenactment.
      </p>
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
        Chinese guide: <a href="/zh-CN/videos">中文视频教程</a>
      </p>
    </div>
  )
}
