---
title: Feedback
description: A lightweight yes/no page feedback widget persisted in localStorage.
order: 4
api: FeedbackProps
example: feedback
---

# Feedback

The feedback widget shown at the bottom of every documentation page. It stores a local vote, so it works without a backend.

## Usage

```tsx
import { Feedback } from '@tanstack-blog/ui'

<Feedback entryId="getting-started" t={t} />
```

## Behaviour

- Votes are stored under `tb:feedback:<entryId>`.
- Selecting an option highlights it and shows a thank-you message.
- The widget is theme-aware and inherits all `--tb-*` tokens.
