<!-- Mirrored from apps/docs/content/zh-CN/docs/themes.md. Edit the source, not this file. -->

---
title: 主题
description: 令牌契约、25 套预设与主题插件。
group: Fundamentals
order: 2
updated: 2026-02-01
---

# 主题

主题是数据，不是组件库。它导出设计令牌与可选字体、圆角、CSS。切换主题只写 CSS 变量，React 不重新挂载。

## 令牌契约

九个颜色令牌：`background`、`surface`、`surfaceMuted`、`text`、`textMuted`、`border`、`accent`、`accentText`、`codeText`，另有 `fonts`、`radii`、`css`。

```ts
export const myTheme = defineTheme({
  id: 'my-theme', name: 'My Theme', school: 'modern-tool',
  description: '简短描述', modes: ['light', 'dark'],
  light: { /* 九个令牌 */ }, dark: { /* 九个令牌 */ },
})
```

## 25 套预设

来自 `web-design-engineer` 的 25 个设计配方。六套旗舰主题有手工双模式配色，其余生成互补模式。主题市场支持名称搜索、流派筛选与并排对比（选择两张卡片后点击「对比所选」）。每套主题有 `/themes/<id>` 预览页，含令牌表、安装命令与 CSS 导出；机器可读目录发布在 `/theme-registry.json`。

```ts
import { allThemes, getTheme, themesBySchool } from '@tanstack-blog/themes'
```

## 主题插件

`@tanstack-blog/theme-linear`、`theme-muji`、`theme-stripe` 返回 `{ name, theme }`，可独立安装。

## 运行时切换

`ThemeProvider` 持久化偏好，并在水合前应用，避免闪烁。支持浅色/深色/跟随系统。
