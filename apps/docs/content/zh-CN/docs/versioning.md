---
title: 文档版本
description: 与当前文档并存发布冻结版本，并在顶部切换。
group: Guides
order: 3
updated: 2026-02-01
---

# 文档版本

版本化文档让旧版 API 文档在持续开发期间仍可访问——这是 Docusaurus、VitePress 与 GitBook 的标准能力。

## 配置版本

```ts title="app.config.ts"
export default defineConfig({
  title: 'My Docs',
  currentVersion: 'current',
  versions: [
    { code: 'v1.0', label: 'v1.0' },
    { code: 'v2.0', label: 'v2.0' },
  ],
})
```

`currentVersion` 对应无前缀的实时文档；其他代码会成为 URL 片段。

## 内容布局

```text
content/
  en/docs/api.md                 -> /docs/api
  zh-CN/docs/api.md              -> /zh-CN/docs/api
  v1.0/en/docs/api.md            -> /v/v1.0/docs/api
  v1.0/zh-CN/docs/api.md         -> /zh-CN/v/v1.0/docs/api
```

文件放在 `content/<version>/<locale>/...`。加载器识别版本段，记录 `entry.version` 并自动生成带前缀的路由。

## 切换版本

配置多个版本后，顶部出现 **版本** 下拉。选择后调用 `switchVersionRoute`，保留当前页面与语言：

- `/docs/api` → `/v/v1.0/docs/api`
- `/zh-CN/docs/api` → `/zh-CN/v/v1.0/docs/api`

切回 **当前版本** 会移除版本前缀。

## 侧栏作用域

侧边栏按当前版本过滤条目，v1.0 页面不会混入最新文档树。搜索、sitemap 与 llms.txt 覆盖所有版本。

## 检查清单

- [ ] 每个版本条目都有对应的当前页面
- [ ] 版本标签简短且稳定
- [ ] 翻译时镜像两套语言目录
