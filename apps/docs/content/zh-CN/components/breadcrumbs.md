---
title: 面包屑
description: 层级导航路径。
order: 10
example: breadcrumbs
---

# 面包屑

层级导航路径。

## Usage

```tsx
<Breadcrumbs items={[{ label: '文档', to: '/docs' }, { label: '当前页' }]} />
```

## 说明

- 由真实的 `@tanstack-blog/ui` 包渲染。
- 可通过类型化 `ThemeSlots` 注册表覆盖。
