#!/usr/bin/env node
/** Generate discoverable metadata for third-party theme marketplaces. */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { allThemes } from '../packages/themes/dist/index.js'

const registry = {
  schema: 'tanstack-blog/theme-registry@1',
  count: allThemes.length,
  themes: allThemes.map((theme) => ({
    id: theme.id,
    name: theme.name,
    school: theme.school,
    description: theme.description,
    accent: theme.light.accent,
    package: `@tanstack-blog/theme-${theme.id}`,
    modes: theme.modes,
  })),
}

writeFileSync(
  path.resolve('packages/themes/registry.json'),
  `${JSON.stringify(registry, null, 2)}\n`,
  'utf8',
)
console.log(`generated theme registry with ${registry.count} entries`)
