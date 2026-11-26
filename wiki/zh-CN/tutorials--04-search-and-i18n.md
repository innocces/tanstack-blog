<!-- Mirrored from apps/docs/content/zh-CN/tutorials/04-search-and-i18n.md. Edit the source, not this file. -->

---
title: 搜索与国际化
description: 配置离线搜索并发布第二种语言。
order: 4
updated: 2026-02-01
---

# 搜索与国际化

**目标：** 全文搜索与本地化路由树。

## 搜索包

| 包 | 作用 |
| --- | --- |
| `@tanstack-blog/search` | 适配器契约 + 本地匹配 |
| `@tanstack-blog/orama-search` | 容错全文适配器 |

```tsx
const adapter = createOramaSearchAdapter(searchData)
<SearchDialog store={store} adapter={adapter} config={config} t={t} />
```

构建会输出 `search-index.json`，客户端可跳过建索引。`⌘K` 打开面板；`?search=1&q=...` 可深链查询。

## 添加语言

```ts
i18n: {
  defaultLocale: 'en',
  locales: [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'zh-CN', label: '简体中文', dir: 'ltr' },
  ],
}
```

在 `content/zh-CN/` 镜像内容。内置字典覆盖 en、zh-CN、fr、ja、de、ar；也可用 `registerDictionary` 扩展。

## 验证

- 切换语言保留当前页面。
- 刷新无前缀 URL 会恢复已保存语言。
- 搜索结果按当前语言过滤。
