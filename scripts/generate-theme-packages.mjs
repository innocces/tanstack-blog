#!/usr/bin/env node
/** Generate one standalone plugin package for every preset in @tanstack-blog/themes. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const source = readFileSync(path.resolve('packages/themes/src/presets.ts'), 'utf8')
const entries = [
  ...source.matchAll(/^\s{4}id: '([^']+)',\s*name: '([^']+)'(?:,\s*description: '([^']*)')?/gm),
]
const ids = entries.map((match) => ({ id: match[1], name: match[2], description: match[3] ?? '' }))

for (const { id, name, description } of ids) {
  const dir = path.resolve(`packages/theme-${id}`)
  mkdirSync(path.join(dir, 'src'), { recursive: true })
  writeFileSync(
    path.join(dir, 'package.json'),
    `${JSON.stringify(
      {
        name: `@tanstack-blog/theme-${id}`,
        version: '0.1.0',
        type: 'module',
        description: description || `${name} theme plugin for TanStack Blog.`,
        license: 'MIT',
        main: './dist/index.js',
        types: './dist/index.d.ts',
        exports: { '.': { types: './dist/index.d.ts', import: './dist/index.js' } },
        files: ['dist'],
        scripts: { build: 'tsc -p tsconfig.json' },
        dependencies: {
          '@tanstack-blog/core': 'workspace:*',
          '@tanstack-blog/themes': 'workspace:*',
        },
        devDependencies: { '@types/node': '^22.10.2', typescript: '^6.0.2' },
      },
      null,
      2,
    )}\n`,
  )
  writeFileSync(
    path.join(dir, 'tsconfig.json'),
    `{ "extends": "../../tsconfig.base.json", "compilerOptions": { "noEmit": false, "outDir": "dist", "rootDir": "src" }, "include": ["src"] }\n`,
  )
  const camel = id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
  writeFileSync(
    path.join(dir, 'src/index.ts'),
    `import { defineTheme, type PressTheme } from '@tanstack-blog/core'\nimport { getTheme } from '@tanstack-blog/themes'\n\n/** ${name} theme, as an installable plugin. */\nexport const ${camel}Theme: PressTheme = defineTheme(getTheme('${id}')!)\n\nexport interface ThemePlugin {\n  name: string\n  theme: PressTheme\n}\n\nexport function ${camel}ThemePlugin(): ThemePlugin {\n  return { name: 'tanstack-blog-theme-${id}', theme: ${camel}Theme }\n}\n\nexport default ${camel}Theme\n`,
  )
}
console.log(`generated ${ids.length} theme plugin packages`)
