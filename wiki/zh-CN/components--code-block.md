<!-- Mirrored from apps/docs/content/zh-CN/components/code-block.md. Edit the source, not this file. -->

---
title: 代码块
description: 支持复制、命令切换与在线平台跳转的代码块。
order: 2
updated: 2026-02-01
---

# 代码块

围栏由 TanStack Markdown 拥有，语法高亮由 TanStack Highlight 在构建期生成。

````md
```tsx file="example.tsx" {2}
const answer: number = 42
console.log(answer)
```
````

代码块提供：语言标签、复制按钮、包管理器切换（npm / pnpm / yarn / bun）、查看源码与在线平台预览入口。带 `// @ts-expect-error` 等标记的行会显示类型提示。
