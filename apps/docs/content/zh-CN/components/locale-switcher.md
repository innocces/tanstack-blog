---
title: 语言切换器
description: 保留当前路由的语言下拉。
order: 10
example: locale-switcher
---

# 语言切换器

保留当前路由的语言下拉。

## Usage

```tsx
<LocaleSwitcher store={store} locales={config.i18n.locales} t={t} onLocaleChange={navigate} />
```

## 说明

- 由真实的 `@tanstack-blog/ui` 包渲染。
- 可通过类型化 `ThemeSlots` 注册表覆盖。
