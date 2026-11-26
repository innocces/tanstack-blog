<!-- Mirrored from apps/docs/content/zh-CN/docs/component-api.md. Edit the source, not this file. -->

---
title: 组件 API 表格
description: 从 ui 子包的多行 TSDoc 注释生成 dumi 式属性表。
group: Guides
order: 4
---

# 组件 API 表格

组件页面渲染来自 `@tanstack-blog/ui` 的实时示例，以及由 TSDoc 注释生成的属性表——借鉴 dumi，但浏览器无需 TypeScript 编译器。

## 编写组件

解析器读取带多行 TSDoc 标签的导出接口：

```ts
/**
 * @description Accessible custom select used instead of a native select.
 * @description.zh 用于替代原生 select 的无障碍自定义下拉菜单
 */
export interface DropdownProps {
  /**
   * @description Currently selected value.
   * @description.zh 当前选中的值
   */
  value: string
  /**
   * @description Optional leading icon.
   * @description.zh 可选的前置图标
   * @default undefined
   */
  icon?: ReactNode
}
```

支持的标签：`@description`、`@description.zh`、`@default`。三者可写在同一行或多行；不带标签的纯文本视为英文描述。

## 生成表格

```sh
pnpm exec create-tanstack-blog run api
```

生成 `packages/ui/api.json`，以接口名为键：

```json
{
  "DropdownProps": {
    "name": "DropdownProps",
    "description": "Accessible custom select used instead of a native select.",
    "zh": "用于替代原生 select 的无障碍自定义下拉菜单",
    "props": [
      { "name": "value", "type": "string", "required": true, "description": "Currently selected value.", "zh": "当前选中的值" },
      { "name": "icon", "type": "ReactNode", "required": false, "description": "Optional leading icon.", "zh": "可选的前置图标", "default": "undefined" }
    ]
  }
}
```

## 关联组件页面

```md
---
title: Dropdown
description: 无障碍自定义下拉菜单。
api: DropdownProps
example: dropdown
---
```

`ComponentPage` 从目录读取表格，根据当前语言选择中英描述，并展开嵌套类型：`DropdownProps.options: DropdownOption[]` 会在下方自动生成第二张 `DropdownOption` 表格。

## 实时示例

示例位于 `apps/docs/src/components/examples.tsx`，注册到 `componentExamples`。它们导入真实的 `ui` 包，因此演示与文档 API 不会脱节。
