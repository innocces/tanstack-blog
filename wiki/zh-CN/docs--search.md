<!-- Mirrored from apps/docs/content/zh-CN/docs/search.md. Edit the source, not this file. -->

---
title: 搜索
description: 独立搜索包、Orama 全文索引与本地回退。
group: Fundamentals
order: 3
---

# 搜索

搜索是独立包，核心框架不含搜索实现。

## 包结构

- `@tanstack-blog/search`：共享契约与默认本地适配器
- `@tanstack-blog/orama-search`：Orama 全文适配器，按需安装

## 配置

```ts
search: { provider: 'orama', placeholder: '搜索文档…', includeContent: true }
```

## 适配器接口

```ts
interface SearchAdapter {
  id: string
  search(term: string, options?: SearchOptions): Promise<SearchHit[]> | SearchHit[]
}
```

```tsx
const adapter = createOramaSearchAdapter(searchData)
<SearchDialog store={store} adapter={adapter} config={config} t={t} />
```

Orama 适配器在首次查询时延迟建索引，字段权重为 title ×3、description ×2、content ×1。

## 快捷键

`⌘K` 打开，`↑↓` 选择，`Enter` 打开，`Esc` 关闭；支持 `?search=1&q=...` 深链。
