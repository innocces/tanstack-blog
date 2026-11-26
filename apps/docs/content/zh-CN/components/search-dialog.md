---
title: 搜索面板
description: 通过适配器注入的命令面板搜索。
order: 10
api: SearchDialogProps
example: search-trigger
---

# 搜索面板

通过适配器注入的命令面板搜索。

## Usage

```tsx
import { createOramaSearchAdapter } from '@tanstack-blog/orama-search'
const adapter = createOramaSearchAdapter(searchData)
<SearchDialog store={store} adapter={adapter} config={config} t={t} />
```

## 说明

- 由真实的 `@tanstack-blog/ui` 包渲染。
- 可通过类型化 `ThemeSlots` 注册表覆盖。
