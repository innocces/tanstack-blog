<!-- Mirrored from apps/docs/content/en/docs/deployment.md. Edit the source, not this file. -->

---
title: Deployment
description: Cloudflare, Vercel, Netlify, Node, Docker and other Nitro presets.
group: Guides
order: 1
updated: 2026-02-01
---

# Deployment

> [!NOTE] Live deployment
> This demo is deployed at https://tanstack-blog.jiangjiangjiangxi.workers.dev via the Cloudflare Workers preset.

TanStack Start produces a Nitro server build. That means the same `pnpm build` output can target nearly every host. This page mirrors the deployment matrix from the TanStack Start docs and adds the settings this framework needs.

## Universal build

```sh
pnpm build
```

The build emits `.output/` with a `public/` directory and a server entry. Set the preset with an environment variable when needed:

```sh
NITRO_PRESET=cloudflare_module pnpm build
```

> [!IMPORTANT] Static assets
> Content is already rendered into the SSR payload at build time. No runtime filesystem access is required, so serverless and edge targets work without bundling the `content/` directory.

## Cloudflare Workers / Pages

The repository is connected to Cloudflare. Set the build command and output:

```toml title="wrangler.toml"
name = "tanstack-blog"
compatibility_date = "2026-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".output/public"
```

```sh
pnpm build
pnpm exec wrangler deploy
# or
pnpm run deploy:cloudflare
```

For Workers, use `NITRO_PRESET=cloudflare_module`. For Pages, use `cloudflare_pages`. Set `siteUrl` in `app.config.ts` so canonical links use your `*.pages.dev` domain.

## Vercel

```json title="vercel.json"
{
  "framework": null,
  "buildCommand": "pnpm build",
  "outputDirectory": ".output/public"
}
```

Import the repo in Vercel; framework auto-detection can be left off because TanStack Start owns the build. Orama indexes are generated during the build, so no environment variables are required.

## Netlify

```toml title="netlify.toml"
[build]
  command = "pnpm build"
  publish = ".output/public"
```

Use the Nitro `netlify` preset if you need server functions; the static output works for content-only sites.

## Node / VPS

```sh
NITRO_PRESET=node_server pnpm build
node .output/server/index.mjs
```

Put it behind Caddy or nginx, or run it under PM2. The server listens on `PORT` (default 3000).

## Docker

```dockerfile
FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile && pnpm build

FROM node:22-alpine
WORKDIR /app
ENV NITRO_PRESET=node_server PORT=3000
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

## Other Nitro presets

Nitro ships presets for Deno Deploy, Bun, AWS Lambda, Azure, Google Cloud Run, Firebase, Vercel Edge and more. Set `NITRO_PRESET` to the preset id and keep the same build command. Consult the [Nitro deployment docs](https://nitro.build/deploy) for provider-specific environment variables.

## GitHub Pages (static export)

If you do not need server functions, a static export can be hosted on GitHub Pages. Set the base path to your repository name and generate a `.nojekyll` file. In the wiki scenario, the Markdown sources are copied verbatim — see [GitHub Wiki](./github-wiki.md).

## Checking a deployment

- Verify `/`, `/docs`, `/blog`, `/themes` and one localized route.
- Open `⌘K` and confirm search returns results.
- Toggle theme and color mode, then reload — the choice must persist.
- Check `view-source:` for canonical and description tags.
