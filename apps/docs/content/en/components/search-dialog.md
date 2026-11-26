---
title: Search dialog
description: Command-palette search with adapter injection.
order: 10
api: SearchDialogProps
example: search-trigger
---

# Search dialog

Command-palette search with adapter injection.

## Usage

```tsx
import { createOramaSearchAdapter } from '@tanstack-blog/orama-search'
const adapter = createOramaSearchAdapter(searchData)
<SearchDialog store={store} adapter={adapter} config={config} t={t} />
```

## Notes

- Rendered from the real `@tanstack-blog/ui` package.
- Overridable through the typed `ThemeSlots` registry.
