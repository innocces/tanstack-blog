<!-- Mirrored from apps/docs/content/zh-CN/docs/auto-kb.md. Edit the source, not this file. -->

---
title: 自动嗅探与知识库
description: 自动识别项目并生成无需 LLM 的 DeepWiki 式知识库。
group: Guides
order: 5
---

# 自动嗅探与知识库

两个工具可以把任意仓库变成文档，无需 LLM，也无需托管服务。

## 嗅探项目

```sh
pnpm exec create-tanstack-blog sniff /path/to/repo
```

嗅探器读取 `package.json`、工作区布局与文件树，输出检测到的技术栈、脚本、包数量和推荐的 `app.config.ts`。无网络调用、无模型参与。

## 生成知识库

```sh
pnpm exec create-tanstack-blog kb /path/to/repo ./wiki-generated
```

`@tanstack-blog/kb` 静态提取：

- 工作区包、源文件数量与导出符号
- 运行时/开发依赖及精确版本范围
- 脚本、检测到的框架、README 标题与 Git remote

生成五个 Markdown 页面：**概览、架构、API、依赖、术语表**。结果确定、可 diff、可直接提交。

## 在本站

Vite 插件在构建期执行同样的分析并暴露 `virtual:tanstack-blog/wiki`。页面位于 `/wiki/*`，会加入 sitemap，并与手写文档一起进入搜索索引。可通过 `config.wiki = false` 关闭。

## 适用场景

- 用始终最新的架构图为贡献者提供入门指引
- 将开源仓库发布为可读的知识库
- 不依赖推理服务也能生成 Wiki 镜像
