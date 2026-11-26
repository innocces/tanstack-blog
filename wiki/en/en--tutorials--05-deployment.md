<!-- Mirrored from apps/docs/content/en/tutorials/05-deployment.md. Edit the source, not this file. -->

---
title: Deployment
description: Ship to Cloudflare and other Nitro presets.
order: 5
---

# Deployment

**Goal:** a production build deployed to an edge worker.

## Build

```sh
pnpm build
```

The Nitro output contains `.output/public` (assets, generated XML/TXT, videos) and `.output/server`.

## Cloudflare Workers

```sh
NITRO_PRESET=cloudflare_module pnpm build
pnpm exec wrangler login
pnpm deploy:cloudflare
```

`wrangler.toml` must **not** set `pages_build_output_dir`; Nitro emits a Workers `ASSETS` binding and Pages reserves that name.

## Other targets

| Platform | Command |
| --- | --- |
| Vercel | `NITRO_PRESET=vercel pnpm build` |
| Netlify | `NITRO_PRESET=netlify pnpm build` |
| Node | `NITRO_PRESET=node_server pnpm build && node .output/server/index.mjs` |

## Verify

- `/`, `/docs`, `/blog`, `/themes`, `/wiki`, `/videos` all return 200.
- `sitemap.xml`, `rss.xml`, `llms.txt` are present.
- Theme and locale choices persist after reload.
