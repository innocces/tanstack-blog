<!-- Mirrored from apps/docs/content/zh-CN/docs/getting-started.md. Edit the source, not this file. -->

---
title: 快速开始
description: 使用 TanStack Blog 创建文档、博客或组件库站点。
group: Getting Started
order: 1
updated: 2026-02-01
---

# 快速开始

TanStack Blog 建立在 **TanStack Start**、**TanStack Router** 和 **TanStack Markdown** 之上。Start 负责路由、SSR 与部署；Markdown 负责解析与渲染；本框架提供内容发现、主题、搜索、多语言与布局。

> [!NOTE] 关于 TanStack Markdown
> 它是小巧的同步解析器/渲染器，并不是站点生成器，也没有内置的 "blog 模式"。站点层由本框架实现。

## 脚手架

```sh
pnpm dlx @tanstack-blog/cli
```

TUI 会询问包管理器、内容模式、主题、语言、搜索后端与部署目标。

## 手动接入

在 Vite 中注册插件，并定义站点配置：

```ts
plugins: [tanstackBlog({ config }), nitro(), tanstackStart(), viteReact()]
```

```ts
export default defineConfig({
  title: 'My Docs',
  modes: { docs: true, blog: true, components: false },
  search: { provider: 'orama' },
})
```

## 内容约定

```text
content/en/index.md                   -> /
content/en/docs/getting-started.md    -> /docs/getting-started
content/zh-CN/docs/getting-started.md -> /zh-CN/docs/getting-started
content/en/blog/hello.md              -> /blog/hello
```

## 视频教程

观看 [12 秒快速开始](/videos) 与 [主题市场导览](/videos)。视频是真实 CLI 会话录制。

## 运行

```sh
pnpm dev
pnpm build
```

按 `⌘K` 搜索；顶部控件切换主题、明暗模式与语言。
