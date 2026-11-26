---
title: 自定义主题开发
description: 借鉴 dumi 的分层主题体系：令牌、插槽、字典与 CSS。
group: Guides
order: 6
---

# 自定义主题开发

TanStack Blog 借鉴 dumi 的组合模型。dumi 将主题分为三层：`builtins`（Markdown 语法如何渲染）、`layouts`（全局/文档/演示页外壳）与 `slots`（Navbar、SideMenu、HomePageHero 等）。自定义主题按名称覆盖单个组件，未提供的部分回退到内置实现。我们用类型化插槽注册表实现了同样的思路。

## 四层自定义能力

| 层 | 位置 | 影响 |
| --- | --- | --- |
| 令牌 | `@tanstack-blog/themes`、`defineTheme()` | 颜色、字体、圆角、强调色 CSS |
| 插槽 | `theme.config.tsx`、`ThemeSlots` | 站点内所有组件，包括页面布局 |
| 文案 | `registerDictionary()` | UI 字符串，含中英版本 |
| CSS | `PressTheme.css`、`styles.css` | 令牌无法表达的结构样式 |

四者互相独立：可以只发布令牌主题、只发布插槽主题，或完整视觉系统。

## 插槽注册表

`ThemeSlots` 由 `@tanstack-blog/ui` 导出，每个键都有内置默认实现，局部覆盖总是安全。

| 插槽 | 默认值 | 用途 |
| --- | --- | --- |
| `Header` | `SiteHeader` | 品牌、导航、主题/语言控件 |
| `Footer` | `SiteFooter` | 底部链接与文案 |
| `Sidebar` | `Sidebar` | 左侧文档树 |
| `Toc` | `Toc` | 右侧目录 |
| `SearchDialog` | `SearchDialog` | 命令面板 |
| `Article` | `Article` | Markdown「builtins」层——覆盖后可控制代码块、提示块、标签页 |
| `DocPage` / `BlogPost` / `ComponentPage` | 页面组件 | 内容页主体 |
| `BlogIndex` / `ComponentsIndex` / `ThemeGallery` / `ThemePreviewPage` | 列表页 | 列表与画廊布局 |
| `HomeHero` | `HomeHero` | 首页 Hero |
| `WikiPage` | 内置 | 自动生成知识库渲染器 |
| `BrandMark` / `Nav` / `ThemeSwitcher` / `LocaleSwitcher` / `SearchTrigger` / `VersionSwitcher` | 顶部组件 | 可独立替换的 header 元素 |
| `Breadcrumbs` / `PageNav` / `DocShell` / `Feedback` / `BackToTop` | 小组件 | 可复用元素 |
| `ThemeCompare` / `ThemeSample` / `TutorialIndex` / `WikiPage` | 发现页 | 对比、样例、教程中心、生成知识库 |
| `NotFound` | `NotFound` | 404 页面 |

## 注册覆盖

创建 `src/theme.config.tsx`（CLI 已自动生成）：

```tsx
import { SiteHeader, type ThemeSlots } from '@tanstack-blog/ui'

export const themeSlots: Partial<ThemeSlots> = {
  Header: (props) => <SiteHeader {...props} />,
}
```

根文档通过 `SlotsProvider` 包裹应用，所有页面通过 `useSlots()` 解析组件，无需 patch，也无需 fork。

## 编写主题包

```ts
import { defineTheme, type PressTheme } from '@tanstack-blog/core'
import { registerDictionary } from '@tanstack-blog/core'

export const acmeTheme = defineTheme({
  id: 'acme',
  name: 'Acme Docs',
  school: 'modern-tool',
  description: '企业文档主题。',
  modes: ['light', 'dark'],
  light: { /* 九个令牌 */ },
  dark: { /* 九个令牌 */ },
  css: '.tb-header { border-bottom-width: 2px; }',
})

registerDictionary('en', { 'nav.docs': 'Guides' })
```

再从同一个包导出 `themeSlots`，应用中引入即可。主题插件使用 `{ name, theme }` 结构，插槽覆盖是普通 React 组件——分开导出，令牌消费者不会加载 React。

## 覆盖 builtins

`Article` 即 builtins 层。替换它即可控制代码块、提示块与注释组件的呈现：

```tsx
import { type ThemeSlots } from '@tanstack-blog/ui'

export const themeSlots: Partial<ThemeSlots> = {
  Article: ({ entry }) => <MyRenderer html={entry.html} />,
}
```

## 回退规则

- 提供的插槽完全替换默认实现，不会合并 JSX。
- 未提供的插槽保持内置实现。
- 插槽在每次渲染树中解析一次，切换明暗模式不会重挂载。
- Props 类型来自默认组件，覆盖实现不会偏离框架契约。

## 自定义主题检查清单

- [ ] 明暗两套令牌均已定义
- [ ] 提供 `favicon.ico` / `favicon.svg` 与品牌资源
- [ ] 新文案包含中英字典条目
- [ ] 每个覆盖插槽都在桌面与移动宽度下验证
- [ ] 有意视觉变更后更新 `pnpm test:visual` 基线
- [ ] 主题 README 附截图
