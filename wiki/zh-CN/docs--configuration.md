<!-- Mirrored from apps/docs/content/zh-CN/docs/configuration.md. Edit the source, not this file. -->

---
title: 配置
description: app.config.ts 的全部选项与默认值。
group: Getting Started
order: 2
updated: 2026-02-01
---

# 配置

配置用 Zod 在构建期校验。`defineConfig` 提供类型提示，默认值由插件中的 `resolveConfig` 补齐。

## 完整示例

```ts
export default defineConfig({
  title: 'TanStack Blog',
  description: '文档、博客与组件库框架。',
  siteUrl: 'https://example.com',
  contentDir: 'content',
  repoUrl: 'https://github.com/acme/docs',
  editUrlBase: 'https://github.com/acme/docs/edit/main/content',
  nav: [{ label: 'Docs', to: '/docs' }],
  social: [{ label: 'GitHub', href: 'https://github.com/acme' }],
  modes: { blog: true, docs: true, components: false },
  theme: { default: 'linear', allowSwitch: true, storeKey: 'tanstack-blog-theme' },
  search: { provider: 'orama', placeholder: '搜索文档…', hotkey: '⌘K', includeContent: true },
  i18n: { defaultLocale: 'en', locales: [{ code: 'en', label: 'English', dir: 'ltr' }] },
})
```

## 顶层选项

| 选项 | 默认值 | 用途 |
| --- | --- | --- |
| `title` | 必填 | 品牌名与标题 |
| `description` | `''` | meta 描述 |
| `siteUrl` | — | canonical 与 OpenGraph |
| `contentDir` | `'content'` | Markdown 根目录 |
| `nav` / `social` | `[]` | 顶部与底部链接 |

## 文档版本

在配置中声明版本，并把内容放在 `content/<version>/<locale>/`：

```ts
currentVersion: 'current',
versions: [{ code: 'v1.0', label: 'v1.0' }],
```

`content/v1.0/en/docs/api.md` 对应 `/v/v1.0/docs/api`。顶部版本选择器负责切换路由，侧边栏只显示当前版本的条目。

## 内容模式

- `docs`：侧边栏文档树、上一篇/下一篇、目录
- `blog`：按日期倒序、标签、阅读时间
- `components`：组件画廊

## 搜索

`orama` 全文容错、`local` 零依赖子串匹配、`none` 关闭。`includeContent` 决定是否索引正文。

## 自动生成

插件生成 `config`、`content`、`search-data` 三个虚拟模块，无需维护路由表或索引文件。
