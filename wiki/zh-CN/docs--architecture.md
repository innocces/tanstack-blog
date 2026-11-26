<!-- Mirrored from apps/docs/content/zh-CN/docs/architecture.md. Edit the source, not this file. -->

---
title: 架构
description: Vite 插件、内容管线与 UI 层。
group: Reference
order: 1
updated: 2026-02-01
---

# 架构

## 构建期

1. `collectContent()` 遍历内容目录
2. `gray-matter` 分离 frontmatter 与正文
3. `parseMarkdown()` + 文档预设生成 AST 与标题
4. `renderHtml()` + TanStack Highlight 生成 HTML
5. 写入虚拟模块，开发期监听变更并热更新

## 运行期

- TanStack Store 管理主题、模式、语言与面板状态
- `ThemeProvider` 写 CSS 变量并持久化
- `SearchDialog` 使用注入的搜索适配器
- 单一 catch-all 路由把路径映射到内容条目

## 包边界

`search` 与 `orama-search` 是独立包；`ui` 使用官方 TanStack 徽标与 Phosphor 风格实心图标。

## 可替换性

Markdown 管线、搜索后端、布局组件与状态存储均可替换。
