<!-- Mirrored from apps/docs/content/zh-CN/docs/deployment.md. Edit the source, not this file. -->

---
title: 部署
description: Cloudflare、Vercel、Netlify、Node 与 Docker。
group: Guides
order: 1
---

# 部署

> [!NOTE] 在线部署
> 本演示站通过 Cloudflare Workers 预设部署于 https://tanstack-blog.jiangjiangjiangxi.workers.dev。

TanStack Start 输出 Nitro 构建，同一份 `pnpm build` 可面向多种平台。

## Cloudflare

```toml
name = "tanstack-blog"
compatibility_date = "2026-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".output/public"
```

```sh
NITRO_PRESET=cloudflare_module pnpm build
pnpm exec wrangler deploy
```

## Vercel

```json
{ "framework": null, "buildCommand": "pnpm build", "outputDirectory": ".output/public" }
```

## Netlify

```toml
[build]
  command = "pnpm build"
  publish = ".output/public"
```

## Node / Docker

```sh
NITRO_PRESET=node_server pnpm build
node .output/server/index.mjs
```

Docker 使用多阶段构建，仅复制 `.output` 到运行镜像。

## 验证清单

检查首页、文档、博客、主题页与本地化路由；验证搜索、主题持久化与 meta 标签。
