---
title: Code Block
description: Fenced code with file metadata and build-time syntax highlighting.
order: 2
---

# Code Block

Fences are owned by TanStack Markdown. Syntax highlighting is supplied by TanStack Highlight through a synchronous callback that returns escaped inner markup.

````md
```ts file="example.ts" {2}
const answer: number = 42
console.log(answer)
```
````

```ts file="example.ts" {2}
const answer: number = 42
console.log(answer)
```

Metadata is recorded even without a highlighter, so a build pipeline can change highlighters without re-parsing the document. Unknown languages degrade to escaped plain text.
