# Remotion video source

Alternative code-generated clip source. The clips currently shipped in the docs are real CLI recordings (`scripts/record-cli-video.mjs`); this project remains available for generating synthetic demo clips.

## Render

```sh
cd tools/remotion
npm install
npx remotion render src/index.ts Quickstart ../../apps/docs/public/videos/quickstart.mp4
npx remotion render src/index.ts Themes ../../apps/docs/public/videos/themes.mp4
```

## Compositions

| id | Duration | Purpose |
| --- | --- | --- |
| `Quickstart` | 12s (360f @ 30fps) | Scaffold → write Markdown → themes → search/i18n/deploy |
| `Themes` | 7.5s (225f @ 30fps) | Five token-driven presets |

Both use the same token palette as the default Linear theme, so the videos stay visually consistent with the site.
