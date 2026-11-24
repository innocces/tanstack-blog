---
title: 设计系统
description: 令牌、排版与 TanStack 风格图标。
group: Guides
order: 5
---

# 设计系统

## 颜色令牌

`--tb-bg`、`--tb-surface`、`--tb-surface-muted`、`--tb-text`、`--tb-text-muted`、`--tb-border`、`--tb-accent`、`--tb-accent-text`、`--tb-code-text`。派生颜色使用 `oklch()`。

## 排版

默认主题使用 Inter Tight 与 JetBrains Mono；标题紧凑字距；正文 15px / 1.6 行高。

## 间距与圆角

4px 节奏：4 / 8 / 12 / 16 / 24 / 40 / 64 / 96。圆角由主题声明。

## 动效

悬停 150ms，布局移动 350–450ms，尊重 `prefers-reduced-motion`。

## 图标

使用官方 **TanStack 徽标** 与 TanStack 网站同款 **Phosphor 实心字形**：256 视框、`currentColor`、无描边、无 emoji。
