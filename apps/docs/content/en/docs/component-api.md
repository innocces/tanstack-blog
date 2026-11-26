---
title: Component API Tables
description: Generate dumi-style props tables from multiline TSDoc comments in the ui package.
group: Guides
order: 4
updated: 2026-02-01
---

# Component API Tables

Component pages render a live example from `@tanstack-blog/ui` and a props table generated from TSDoc comments — dumi's idea, without a TypeScript compiler in the browser.

## Authoring a component

The parser reads exported interfaces with multiline TSDoc tags:

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

Supported tags: `@description`, `@description.zh`, `@default`. All three may appear on one line or across lines; prose without tags is treated as the English description.

## Generating the table

```sh
pnpm exec create-tanstack-blog run api
```

This writes `packages/ui/api.json`, keyed by interface name:

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

## Linking a component page

```md
---
title: Dropdown
description: An accessible custom select.
api: DropdownProps
example: dropdown
---
```

`ComponentPage` reads the table from the catalog, selects English or Chinese text from the active locale, and expands nested types: `DropdownProps.options: DropdownOption[]` automatically renders a second `DropdownOption` table below the first.

## Live examples

Examples live in `apps/docs/src/components/examples.tsx` and are registered in `componentExamples`. They import the real `ui` package, so the demo cannot drift from the documented API.
