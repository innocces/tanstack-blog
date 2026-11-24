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

## 生成内容

`app.config.ts`、`vite.config.ts`、`__root.tsx`、catch-all 路由、主题页、虚拟模块类型声明，以及按模式生成的内容文件。

## 后续步骤

```sh
cd my-docs
pnpm install
pnpm dev
```
