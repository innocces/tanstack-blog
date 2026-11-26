<!-- Mirrored from apps/docs/content/zh-CN/components/dropdown.md. Edit the source, not this file. -->

---
title: 下拉菜单
description: 用于替代原生 select 的无障碍自定义下拉菜单。
order: 3
api: DropdownProps
example: dropdown
updated: 2026-02-01
---

# 下拉菜单

带键盘支持、外部点击关闭与选中勾选标记的自定义弹层选择器。框架顶部的所有原生 `<select>` 都由它替代。

## 使用

```tsx
import { Dropdown } from '@tanstack-blog/ui'

<Dropdown label="主题" value={themeId} onChange={setThemeId} options={[{ value: 'linear', label: 'Linear' }]} />
```

## 行为

- 按 `Escape` 或点击外部关闭。
- 使用 `role="listbox"` / `role="option"` 保证无障碍语义。
- 选中项显示勾选图标。
