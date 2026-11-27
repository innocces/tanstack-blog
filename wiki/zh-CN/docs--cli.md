<!-- Mirrored from apps/docs/content/zh-CN/docs/cli.md. Edit the source, not this file. -->

---
title: CLI
description: 交互式 TUI 脚手架与全部提示项。
group: Getting Started
order: 3
updated: 2026-02-01
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

## 健康检查

```sh
pnpm exec create-tanstack-blog doctor
pnpm exec create-tanstack-blog doctor --quick   # 适合 pre-commit 钩子
```

Doctor 检查 Node 版本、锁文件、必需文件、`.demand` 隔离、内容数量、中英对齐与框架依赖。在 monorepo 中会自动识别 `apps/docs` 为应用根目录。出现硬性失败时返回非零退出码，可用于 CI 或钩子拦截。

## Git 钩子

为三种主流工具生成可直接使用的钩子：

```sh
pnpm exec create-tanstack-blog hooks lefthook
pnpm exec create-tanstack-blog hooks husky
pnpm exec create-tanstack-blog hooks lint-staged
pnpm exec create-tanstack-blog hooks all
```

生成器会写入配置文件、添加 `scripts.doctor`、安装对应 devDependency（lefthook 还会添加 `postinstall`）。Lefthook 在提交时运行 `pnpm check` 与快速 doctor；husky 通过 `.husky/pre-commit` 执行同样检查；lint-staged 用 Biome 格式化暂存的 `ts/tsx/js/jsx/json/css/md` 文件。

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
