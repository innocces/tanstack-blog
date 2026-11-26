---
title: 为什么要在 TanStack 之上构建文档框架？
description: TanStack Markdown 解析得很漂亮，但一个文档站需要的远不止解析器。
date: 2026-02-18
tags: [tanstack, architecture]
updated: 2026-02-01
---

# 为什么要在 TanStack 之上构建文档框架？

TanStack Markdown 擅长一件事：把受约束的 Markdown 变成确定性 AST，并安全地渲染成 HTML 或 React。这份专注是优点。但围绕它搭建的站点仍需要内容发现、导航、搜索、主题与部署。TanStack Blog 填补这一层，而不 fork 解析器。

## 解析一次，渲染多次

管线在构建期解析每个文件并缓存 HTML 字符串与标题列表。浏览器不下载 Markdown 解析器或语法高亮语法，SSR 与静态输出完全一致。

## 路由仍由 TanStack 负责

我们没有为每个内容文件生成一个路由模块。单一 catch-all 路由把路径映射到条目，TanStack Router 继续管理导航、参数、预加载与滚动恢复。新增页面就是新增文件。

## 主题即数据

主题是九个颜色令牌、三套字体栈和一组圆角值。切换主题只写 CSS 变量，因此提供了 25 套锚定预设，且不会重挂载 React。

## 无需服务的搜索

Orama 在浏览器中对构建期内容建立索引，无需 API Key 或外部服务。小站点也可以切换到零依赖的本地匹配器。

## 亲自体验

你正在阅读的站点就是演示。顶部切换主题，按 `⌘K` 搜索，或阅读[架构文档](/docs/architecture)。
