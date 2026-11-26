<!-- Mirrored from apps/docs/content/zh-CN/tutorials/02-content-and-markdown.md. Edit the source, not this file. -->

---
title: 内容与 Markdown
description: 掌握 frontmatter、提示块、代码块与组件插槽。
order: 2
updated: 2026-02-01
---

# 内容与 Markdown

**目标：** 使用完整的文档语法编写内容。

## Frontmatter

```md
---
title: 快速开始
description: 用于卡片和搜索的一句话。
date: 2026-01-15
tags: [guide, tanstack]
order: 1
group: Fundamentals
updated: 2026-02-01
draft: false
---
```

`group` 创建可折叠侧栏分组；`updated` 显示最后更新时间；`draft` 从列表和搜索中移除页面。

## 目录约定

| 路径 | 路由 |
| --- | --- |
| `content/en/index.md` | `/` |
| `content/en/docs/a.md` | `/docs/a` |
| `content/en/blog/a.md` | `/blog/a` |
| `content/zh-CN/docs/a.md` | `/zh-CN/docs/a` |

## 提示块

```md
> [!TIP] 缓存 AST
> 解析一次，渲染多次。
```

## 代码块

````md
```tsx file="demo.tsx" {2}
const value = 1
console.log(value)
```
````

工具栏提供复制、npm/pnpm/yarn/bun 切换、查看源码与 StackBlitz / CodePen / CodeSandbox。带 `// @ts-expect-error` 的行会显示类型提示徽标。

## 注释组件

```md
<!-- ::separator tone="subtle" -->
<!-- ::start:tabs -->
## React
React 内容
## Solid
Solid 内容
<!-- ::end:tabs -->
```

无需 MDX 求值即可得到交互式标签页。

## 验证

- 开发服务器运行时修改文件会触发虚拟模块热更新。
- 构建产物包含 `sitemap.xml`、`rss.xml` 与 `llms.txt`。
