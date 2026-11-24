<div align="center">

# TanStack Blog

**基于 TanStack Start 的可插拔文档、博客与组件库框架。**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![TanStack Start](https://img.shields.io/badge/built%20with-TanStack%20Start-orange.svg)](https://tanstack.com/start/latest)

[English](./README.md) · 简体中文

**在线预览：** https://tanstack-blog.jiangjiangjiangxi.workers.dev

</div>

TanStack Blog 是建立在 **[TanStack Start](https://tanstack.com/start/latest)**、**[TanStack Router](https://tanstack.com/router/latest)** 与 **[TanStack Markdown](https://tanstack.com/markdown/latest)** 之上的主题驱动文档框架。它提供内容发现、25 套主题、离线搜索、多语言与交互式脚手架。

> TanStack Markdown 是解析器/渲染器，不是站点生成器。站点层由本框架实现。

## 截图

每张截图都由明暗两种主题斜对角拼接而成：**左上为暗色，右下为亮色**。

| 文档（默认 Linear 主题） | 主题市场 |
| --- | --- |
| ![文档站明暗主题](./docs/screenshots/docs-linear.png) | ![主题画廊明暗主题](./docs/screenshots/themes.png) |

| MUJI 编辑风格主题 | 命令面板搜索 |
| --- | --- |
| ![MUJI 明暗主题](./docs/screenshots/docs-muji.png) | ![搜索明暗主题](./docs/screenshots/search.png) |

| 交互式 CLI 脚手架 | 文档界面与主题市场 |
| --- | --- |
| ![CLI 会话](./docs/screenshots/cli.png) | ![文档界面](./docs/screenshots/docs-linear.png) |

CLI 与教程界面截图见 [`docs/screenshots/`](./docs/screenshots/)；每个主题的独立预览截图位于 `docs/screenshots/themes/`。

## 功能

- 三种内容模式：文档树、博客、组件画廊
- 构建期 Markdown 解析与 TanStack Highlight 高亮，客户端零解析器
- 25 套主题令牌预设 + 3 个独立主题插件，运行时切换不重挂载 React
- 独立 `search` / `orama-search` 包，`⌘K` 命令面板
- 中英双语、RTL 就绪、明暗/跟随系统
- TanStack 原生：Router 导航、Start SSR、Store 状态
- 单一 catch-all 路由，新增 Markdown 即新增页面
- Cloudflare、Vercel、Netlify、Node、Docker 部署
- `pnpm wiki:sync` 将文档镜像到 GitHub Wiki
- Clack TUI 脚手架

## 包

| 包 | 用途 |
| --- | --- |
| `@tanstack-blog/core` | 配置、内容管线、i18n、主题契约、Vite 插件 |
| `@tanstack-blog/ui` | React 布局、主题 Provider、搜索面板、图标、样式 |
| `@tanstack-blog/search` | 默认本地搜索适配器 |
| `@tanstack-blog/orama-search` | Orama 全文适配器 |
| `@tanstack-blog/themes` | 25 套令牌预设 |
| `@tanstack-blog/theme-*` | 独立主题插件 |
| `@tanstack-blog/cli` | 交互式脚手架 |

## 快速开始

```sh
pnpm dlx @tanstack-blog/cli
pnpm install
pnpm build:packages
pnpm dev
```

完整文档位于 [`apps/docs/content`](./apps/docs/content)，包含中英双语版本。

## 视频教程

演示站的 `/videos` 页面包含真实 CLI 会话录制视频，MP4 资源位于 `apps/docs/public/videos/`，由 `scripts/record-cli-video.mjs` 录制。

## 免责声明

本项目为独立社区项目，非 TanStack 官方产品。详见[免责声明](./apps/docs/content/zh-CN/docs/disclaimer.md)与[第三方声明](./THIRD_PARTY_NOTICES.zh-CN.md)。
