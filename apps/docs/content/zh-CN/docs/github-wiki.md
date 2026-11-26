---
title: GitHub Wiki
description: 文档同步到仓库 Wiki。
group: Guides
order: 2
updated: 2026-02-01
---

# GitHub Wiki

所有页面都是纯 Markdown，可原样发布到仓库 Wiki。

## 同步脚本

```sh
pnpm wiki:sync
```

将 `apps/docs/content/**/*.md` 复制到 `wiki/`，保留语言目录并跳过草稿。

## 写作约定

不使用原始 HTML；资源用相对路径；只用标准标题与表格；frontmatter 在 Wiki 中无害。

## 自动化

在文档变更的工作流中执行同步并推送到 `*.wiki.git`。脚本幂等，不删除非生成文件。
