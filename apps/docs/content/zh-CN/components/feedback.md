---
title: 页面反馈
description: 存储在 localStorage 中的轻量是/否反馈组件。
order: 4
api: FeedbackProps
example: feedback
updated: 2026-02-01
---

# 页面反馈

文档页底部的反馈组件，投票保存在本地，无需后端。

## 使用

```tsx
import { Feedback } from '@tanstack-blog/ui'

<Feedback entryId="getting-started" t={t} />
```

## 行为

- 投票保存在 `tb:feedback:<entryId>`。
- 选中后高亮并显示感谢信息。
- 继承所有 `--tb-*` 主题令牌。
