<!-- Mirrored from apps/docs/content/zh-CN/docs/content-and-markdown.md. Edit the source, not this file. -->

---
title: 内容与 Markdown
description: Frontmatter、文件约定与文档预设。
group: Fundamentals
order: 1
updated: 2026-02-01
---

# 内容与 Markdown

解析与高亮在构建期完成，浏览器只接收 HTML 字符串与目录，不下载解析器。

## Frontmatter

```md
---
title: 快速开始
description: 一句话描述
date: 2026-01-15
tags: [guide, tanstack]
order: 1
group: Getting Started
draft: false
type: docs
---
```

`group` 决定侧边栏二级菜单；额外字段保存在 `entry.meta`。

## 标题与锚点

标题获得稳定去重的 ID，二级/三级标题进入右侧目录。

## 提示块

```md
> [!TIP] 缓存解析结果
> 渲染 AST 可以避免重复解析。
```

支持 `NOTE`、`TIP`、`IMPORTANT`、`WARNING`、`CAUTION`。

## 代码块

Fence 元数据（`file`、`framework`、行号）即使没有高亮器也会被记录。高亮由 TanStack Highlight 生成安全标记。

## 注释组件

```md
<!-- ::start:tabs -->
## React
内容
## Solid
内容
<!-- ::end:tabs -->
```

## 安全

默认转义原始 HTML，移除 `javascript:` 等可执行协议。
