---
title: Callout
description: A highlighted note parsed by the TanStack Markdown docs preset.
order: 1
---

# Callout

Callouts are written as blockquotes with a GitHub-style marker. No custom component registration is needed.

```md
> [!TIP] A useful tip
> Body text can contain **Markdown**.
```

> [!TIP] A useful tip
> Body text can contain **Markdown**.

The renderer emits `markdown-alert`, `markdown-alert-title` and `markdown-alert-content` classes, which each theme styles from its tokens.
