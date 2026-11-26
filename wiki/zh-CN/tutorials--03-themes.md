<!-- Mirrored from apps/docs/content/zh-CN/tutorials/03-themes.md. Edit the source, not this file. -->

---
title: 主题
description: 创建、预览、对比并导出主题。
order: 3
updated: 2026-02-01
---

# 主题

**目标：** 理解四层主题体系并发布自己的预设。

## 四个层次

1. **令牌** — 九个颜色、字体、圆角（`defineTheme`）。
2. **插槽** — 替换任意 React 组件（`theme.config.tsx`）。
3. **字典** — UI 文案，含中文（`registerDictionary`）。
4. **CSS** — 通过 `PressTheme.css` 做结构覆盖。

## 体验主题市场

打开 `/themes`。可按名称搜索、按流派筛选，选择两张卡片后点击 **对比所选**。每套主题都有 `/themes/<id>` 实时预览页，含令牌表、安装命令与 CSS 导出。

## 创建预设

```ts
import { defineTheme } from '@tanstack-blog/core'

export const acmeTheme = defineTheme({
  id: 'acme',
  name: 'Acme',
  school: 'modern-tool',
  description: '企业文档主题。',
  modes: ['light', 'dark'],
  light: { /* 九个令牌 */ },
  dark: { /* 九个令牌 */ },
})
```

生成独立插件包：

```sh
pnpm exec create-tanstack-blog run themes
```

## 覆盖插槽

```tsx
import { SiteHeader, type ThemeSlots } from '@tanstack-blog/ui'

export const themeSlots: Partial<ThemeSlots> = {
  Header: (props) => <SiteHeader {...props} />,
}
```

## 验证

- 明暗两套令牌均已手工调校。
- 用 `pnpm test:visual:update` 更新视觉基线。
- 在 `docs/screenshots/themes/` 添加截图。
