<!-- Mirrored from apps/docs/content/en/components/dropdown.md. Edit the source, not this file. -->

---
title: Dropdown
description: An accessible custom select used by the header instead of a native select.
order: 3
api: DropdownProps
example: dropdown
---

# Dropdown

A custom popover select with keyboard support, outside-click closing and a selected checkmark. It replaces every native `<select>` in the framework header.

## Usage

```tsx
import { Dropdown } from '@tanstack-blog/ui'

<Dropdown
  label="Theme"
  value={themeId}
  onChange={setThemeId}
  options={[{ value: 'linear', label: 'Linear', hint: 'dark' }]}
/>
```

## Behaviour

- `Escape` closes the menu; clicking outside closes it.
- `role="listbox"` / `role="option"` provide accessible semantics.
- The selected option shows a check icon.
