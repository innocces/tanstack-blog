---
title: 主题切换器
description: 明暗模式与主题选择器。
order: 10
example: theme-switcher
updated: 2026-02-01
---

# 主题切换器

明暗模式与主题选择器。

## Usage

```tsx
<ThemeSwitcher store={store} themes={allThemes} t={t} allowSwitch />
```

## 说明

- 由真实的 `@tanstack-blog/ui` 包渲染。
- 可通过类型化 `ThemeSlots` 注册表覆盖。
