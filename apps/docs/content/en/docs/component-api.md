---
title: Component API Tables
description: Generate dumi-style props tables from TSDoc comments in the ui package.
group: Guides
order: 4
---

# Component API Tables

Component pages can render a live example built from `@tanstack-blog/ui` and a props table generated from TSDoc comments — the same idea as dumi, without a TypeScript compiler in the browser.

## Authoring a component

Document exported `*Props` interfaces with TSDoc. Add `@zh` for the Chinese translation and `@default` for default values:

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

## Generating the table

```sh
pnpm api:generate
```

This writes `packages/ui/api.json`, keyed by interface name. Component frontmatter links to it:

```md
---
title: Dropdown
api: DropdownProps
example: dropdown
---
```

`ComponentPage` renders the table and selects the English or Chinese description from the active locale.

## Live examples

Examples are React components in `apps/docs/src/components/examples.tsx`, registered in `componentExamples`. They import the real `ui` package, so the demo and the documentation can never drift apart.
