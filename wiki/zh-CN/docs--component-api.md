<!-- Mirrored from apps/docs/content/zh-CN/docs/component-api.md. Edit the source, not this file. -->

---
title: 组件 API 表格
description: 从 ui 子包的 TSDoc 注释生成类似 dumi 的属性表格。
group: Guides
order: 4
---

# 组件 API 表格

组件页面可以展示由 `@tanstack-blog/ui` 构建的实时示例，以及从 TSDoc 注释生成的属性表——与 dumi 思路相同，但浏览器无需 TypeScript 编译器。

## 编写组件

用 TSDoc 为导出的 `*Props` 接口写注释，使用 `@zh` 提供中文翻译，`@default` 标注默认值：

```ts
/**
 * Accessible custom select. @zh 无障碍自定义下拉菜单
 */
export interface DropdownProps {
  /** Currently selected value. @zh 当前选中的值 */
  value: string
  /** Optional icon. @zh 可选图标 @default undefined */
  icon?: ReactNode
}
```

## 生成表格

```sh
pnpm api:generate
```

生成 `packages/ui/api.json`，以接口名为键。组件 frontmatter 关联它：

```md
---
title: Dropdown
api: DropdownProps
example: dropdown
---
```

`ComponentPage` 渲染表格，并根据当前语言选择英文或中文描述。

## 实时示例

示例位于 `apps/docs/src/components/examples.tsx`，注册到 `componentExamples`。它们直接导入真实的 `ui` 包，因此演示与文档不会脱节。
