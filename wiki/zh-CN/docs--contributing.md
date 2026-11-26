<!-- Mirrored from apps/docs/content/zh-CN/docs/contributing.md. Edit the source, not this file. -->

---
title: 参与贡献
description: 本地开发与 PR 检查清单。
group: Community
order: 1
---

# 参与贡献

## 前置条件

Node.js ≥ 20、pnpm 10、Git。

## 本地搭建

```sh
pnpm install
pnpm build:packages
pnpm dev
```

开发服务器位于 `http://localhost:3000`。修改包后需重新构建。

> [!IMPORTANT] `.demand/` 仅本地使用
> 该目录保存私有规划笔记，已加入 `.gitignore`，请勿提交。

## 工作区

`core`、`ui`、`search`、`orama-search`、`themes`、`theme-*`、`cli`、`apps/docs`、`scripts`。

## 常用命令

`pnpm dev`、`pnpm build`、`pnpm check`、`pnpm test`、`pnpm test:e2e`、`pnpm wiki:sync`、`pnpm screenshot`。

## PR 清单

构建与检查通过；新代码含英文注释；文档与 Wiki 同步；无敏感文件；视觉变更附截图。

## 发版

发版基于 Conventional Commits。`scripts/release.mjs` 读取上个 tag 以来的提交，计算下一个语义化版本（`feat` → minor、`fix` → patch、`BREAKING CHANGE` → major），更新所有 `package.json`、写入 `CHANGELOG.md` 并创建 tag。

`Release` GitHub Actions 工作流会在 `main` 上 CI 通过后自动执行并发布 GitHub Release。本地可用 `pnpm exec create-tanstack-blog run release` 预演。
