<!-- Mirrored from apps/docs/content/zh-CN/docs/cli.md. Edit the source, not this file. -->

---
title: CLI
description: 交互式 TUI 脚手架与全部提示项。
group: Getting Started
order: 3
---

# CLI

`@tanstack-blog/cli` 使用 Clack 生成完整项目。

## 运行

```sh
pnpm dlx @tanstack-blog/cli
pnpm dlx @tanstack-blog/cli my-docs
```

## 提示项

项目名称、包管理器、内容模式（多选）、默认主题、语言（多选）、搜索后端、部署目标、是否初始化 git。按 `Ctrl+C` 随时取消。

## 工具命令

同一个二进制还提供维护工具，文档中无需出现裸的 `node scripts/...` 命令：

| 命令 | 用途 |
| --- | --- |
| `create-tanstack-blog sniff [dir]` | 检测技术栈、脚本与工作区包 |
| `create-tanstack-blog kb [dir] [out]` | 生成无 LLM 知识库 Markdown |
| `create-tanstack-blog create-theme <id>` | 生成独立主题插件包 |
| `create-tanstack-blog run api` | 重新生成 TSDoc 属性表 |
| `create-tanstack-blog run registry` | 重新生成主题注册表 |
| `create-tanstack-blog run themes` | 重新生成 25 套主题插件包 |
| `create-tanstack-blog run visual [--update]` | 运行或更新视觉基线 |
| `create-tanstack-blog run release` | 预演 conventional commit 发版 |

## 生成内容

`app.config.ts`、`vite.config.ts`、`__root.tsx`、catch-all 路由、主题页、虚拟模块类型声明，以及按模式生成的内容文件。

## 后续步骤

```sh
cd my-docs
pnpm install
pnpm dev
```
