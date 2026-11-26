<!-- Mirrored from apps/docs/content/zh-CN/components/theme-provider.md. Edit the source, not this file. -->

---
title: 主题 Provider
description: 水合前应用令牌并持久化选择。
order: 10
api: ThemeProviderProps
updated: 2026-02-01
---

# 主题 Provider

水合前应用令牌并持久化选择。

## Usage

```tsx
<ThemeProvider store={store} themes={allThemes} storageKey={config.theme.storeKey}>{children}</ThemeProvider>
```

## 说明

- 由真实的 `@tanstack-blog/ui` 包渲染。
- 可通过类型化 `ThemeSlots` 注册表覆盖。
