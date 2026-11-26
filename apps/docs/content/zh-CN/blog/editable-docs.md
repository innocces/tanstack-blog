---
title: 在 GitHub 上也能读的文档
description: 让同一份 Markdown 同时服务于站点与仓库 Wiki。
date: 2026-01-28
tags: [docs, workflow]
---

# 在 GitHub 上也能读的文档

渲染后的文档站适合读者，却不适合审阅文档改动——diff 是 Markdown，因此审阅也应该发生在 Markdown 上。

## 同一来源，两种出口

每个页面都位于 `apps/docs/content`。站点在构建期解析它；`pnpm wiki:sync` 把它原样复制到 `wiki/`，保留语言目录并跳过草稿。

## 保持两种环境都健康的约定

- 不使用原始 HTML
- 资源使用相对路径
- 只用标准标题与表格
- frontmatter 在 Wiki 中无害

## 自动化

在文档变更的工作流中执行同步并推送到 `*.wiki.git`。脚本是幂等的，不会删除非生成文件。

## 贡献流程

编辑 Markdown，运行 `pnpm wiki:sync`，提交 PR。审阅者可以在渲染站点看语气，在原始 Markdown 看准确性。
