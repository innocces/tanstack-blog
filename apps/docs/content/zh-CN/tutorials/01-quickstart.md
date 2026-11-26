---
title: 快速开始
description: 五分钟内创建站点、添加页面并在本地验证。
order: 1
updated: 2026-02-01
---

# 快速开始

**目标：** 五分钟内得到一个可运行的文档站点。

## 1. 创建项目

```sh
pnpm dlx @tanstack-blog/cli
```

选择 pnpm，启用 **文档** 与 **博客**，保留默认 Linear 主题和 Orama 搜索。TUI 会写入完整项目，包括 `app.config.ts`、`theme.config.tsx` 与虚拟模块类型声明。

## 2. 启动服务

```sh
cd my-docs
pnpm install
pnpm dev
```

打开 http://localhost:3000。首页 Hero 链接到文档、博客、主题、搜索与自动生成的 Wiki。

## 3. 添加页面

创建 `content/en/docs/hello.md`：

```md
---
title: Hello
description: 我的第一个页面。
group: Getting Started
order: 1
---

# Hello

这个 Markdown 文件现在对应 `/docs/hello`。
```

无需路由文件——catch-all 路由自动映射路径。

## 4. 验证

- `/docs/hello` 渲染标题与右侧目录。
- `⌘K` 能搜到新页面。
- 顶部切换主题后，导航仍保持该主题。

## 下一步

继续阅读 [内容与 Markdown](/tutorials/02-content-and-markdown)。
