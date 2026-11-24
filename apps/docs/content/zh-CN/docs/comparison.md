---
title: 功能对比
description: 主流文档平台的能力清单与 TanStack Blog 的覆盖情况。
group: Reference
order: 3
---

# 功能对比

我们调研了五个主流文档平台：**Docusaurus、Nextra、VitePress、GitBook、Mintlify**，并把它们的公共能力作为 checklist。

| 能力 | Docusaurus | Nextra | VitePress | GitBook | Mintlify | TanStack Blog |
| --- | --- | --- | --- | --- | --- | --- |
| 文件路由 Markdown | ✓ | ✓ | ✓ | ✓ | ✓ | ✓（catch-all） |
| 博客模式 | ✓ | 部分 | ✓ | ✓ | ✓ | ✓ |
| 组件画廊 | 部分 | ✓ | 部分 | 部分 | ✓ | ✓ |
| 自动生成侧栏与目录 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 明暗/跟随系统 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 多语言 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓（内置中英、RTL 就绪） |
| 全文搜索 | ✓（Algolia） | ✓ | ✓ | ✓ | ✓ | ✓（Orama + 本地适配器） |
| 主题市场 | 部分 | ✓ | 部分 | 部分 | ✓ | ✓（25 套 + 插件） |
| 文档版本 | ✓ | ✓ | ✓ | ✓ | ✓ | 路线图 |
| Sitemap / RSS / llms.txt | 部分 | 部分 | 部分 | ✓ | ✓ | ✓（构建期） |
| 代码复制按钮 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 页面反馈 | 部分 | 部分 | 部分 | ✓ | ✓ | ✓（本地投票） |
| 标签筛选与分页 | ✓ | ✓ | ✓ | 部分 | 部分 | ✓ |
| 最后更新时间 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓（`updated` frontmatter） |
| 返回顶部 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 编辑链接 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MDX 交互组件 | ✓ | ✓ | ✓ | ✓ | ✓ | 路线图（注释组件） |
| 部署预设 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓（Cloudflare/Vercel/Netlify/Node） |
| 离线优先 | 部分 | 部分 | ✓ | ✗ | ✗ | ✓（无需托管服务） |

## 借鉴点

- **Docusaurus**：文档分组、目录、编辑链接与反馈结构
- **Nextra / Mintlify**：主题切换是样式变化而非重建
- **VitePress**：首屏后 SPA 导航、构建期数据加载、自动生成 sitemap
- **GitBook**：纯 Markdown 在站点之外同样可读（Wiki 镜像）

## 尚未覆盖

见[路线图](./roadmap.md)：文档版本、MDX 交互插槽、全部主题的独立插件包、视觉回归测试。
