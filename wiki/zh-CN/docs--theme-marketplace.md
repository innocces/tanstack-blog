<!-- Mirrored from apps/docs/content/zh-CN/docs/theme-marketplace.md. Edit the source, not this file. -->

---
title: 主题市场
description: 搜索、筛选、对比、预览、安装与导出 25 套主题预设。
group: Fundamentals
order: 5
updated: 2026-02-01
---

# 主题市场

`/themes` 是可操作的市场，而非静态列表。它背后使用的令牌目录与运行时切换完全一致。

## 查找主题

- 搜索框匹配名称、id 与描述。
- 流派筛选按设计家族收窄：现代工具、极简编辑、信息架构、动效实验、粗野原始、温暖人文。
- 计数器显示 `可见 / 总数`。

## 对比两套主题

在任意两张卡片上点击 `+`，然后选择 **对比所选**。对比页会在同一视口、同一颜色模式下并排渲染，间距、圆角与强调色的差异一目了然。

## 查看单个主题

每张卡片链接到 `/themes/<id>`，包含：

- 明暗可切换的实时令牌文档预览
- 九种令牌在两种模式下的完整数值表
- 可复制的 `pnpm add @tanstack-blog/theme-<id>` 命令
- **导出 CSS** 按钮，复制当前模式的 CSS 变量
- 其他预设链接与已提交的斜对角截图

## 运行时应用

卡片或预览页的 **应用** 按钮会把主题写入 TanStack Store 与 localStorage。启动脚本在水合前应用令牌，刷新时不会出现颜色闪烁。

## 机器可读目录

`/theme-registry.json` 暴露全部 25 套主题的 id、名称、流派、强调色、包名与模式，第三方市场无需解析源码即可消费。

```sh
pnpm exec create-tanstack-blog run registry   # 重新生成 packages/themes/registry.json
```

## 主题编辑器

打开 `/themes/editor`，从任意预设出发，用取色器调整九个令牌，预览两种模式并导出 CSS。点击 **应用** 会把编辑结果注册为「Custom」并立即启用。

## 编写新主题

```sh
pnpm exec create-tanstack-blog create-theme acme
```

命令会生成独立插件包。填写两套令牌后，用 `pnpm screenshot` 添加预览截图。
