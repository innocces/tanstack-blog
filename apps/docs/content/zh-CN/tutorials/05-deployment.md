---
title: 部署
description: 发布到 Cloudflare 与其他 Nitro 预设。
order: 5
updated: 2026-02-01
---

# 部署

**目标：** 将生产构建发布到边缘 Worker。

## 构建

```sh
pnpm build
```

Nitro 输出包含 `.output/public`（资源、生成的 XML/TXT、视频）与 `.output/server`。

## Cloudflare Workers

```sh
NITRO_PRESET=cloudflare_module pnpm build
pnpm exec wrangler login
pnpm deploy:cloudflare
```

`wrangler.toml` **不要**设置 `pages_build_output_dir`；Nitro 会生成 Workers `ASSETS` 绑定，而 Pages 保留该名称。

## 其他目标

| 平台 | 命令 |
| --- | --- |
| Vercel | `NITRO_PRESET=vercel pnpm build` |
| Netlify | `NITRO_PRESET=netlify pnpm build` |
| Node | `NITRO_PRESET=node_server pnpm build && node .output/server/index.mjs` |

## 验证

- `/`、`/docs`、`/blog`、`/themes`、`/wiki`、`/videos` 均返回 200。
- 存在 `sitemap.xml`、`rss.xml`、`llms.txt`。
- 刷新后主题与语言选择保持不变。
