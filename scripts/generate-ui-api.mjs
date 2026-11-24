#!/usr/bin/env node
/**
 * Generate dumi-style props tables from TSDoc comments on exported `*Props`
 * interfaces in the ui package.
 *
 * TSDoc convention (multiline tags):
 *   /**
 *    * @description Accessible custom select.
 *    * @description.zh 无障碍自定义下拉菜单
 *    *\/
 *   export interface DropdownProps {
 *     /**
 *      * @description Currently selected value.
 *      * @description.zh 当前选中的值
 *      * @default undefined
 *      *\/
 *     value: string
 *   }
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const SRC = path.resolve('packages/ui/src')
const OUT = path.resolve('packages/ui/api.json')

/** Parse `@description`, `@description.zh`, `@default` (plus legacy `@zh`) tags. */
function splitDoc(text) {
  const clean = text
    .replace(/^\/\*\*/, '')
    .replace(/\*\/$/, '')
    // Allow inline tags: `/** @description en @description.zh 中文 */`.
    .replace(/@description\.zh/g, '\n@description.zh')
    .replace(/@default\b/g, '\n@default')
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
  const tags = {}
  let current = null
  for (const line of clean) {
    const match = line.match(/^@(description(?:\.zh)?|default|zh)\s*(.*)$/)
    if (match) {
      current = match[1] === 'zh' ? 'description.zh' : match[1]
      tags[current] = match[2] ? [match[2].trim()] : []
    } else if (line && current) {
      tags[current].push(line)
    }
  }
  const join = (key) => tags[key]?.filter(Boolean).join(' ') || undefined
  if (join('description') || join('description.zh')) {
    return {
      description: join('description') ?? '',
      zh: join('description.zh'),
      defaultValue: join('default'),
    }
  }
  // Legacy single-line prose doc without tags.
  const prose = clean.filter(Boolean).join(' ').trim()
  return { description: prose, zh: undefined, defaultValue: undefined }
}

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? files(full) : full.endsWith('.tsx') ? [full] : []
  })
}

const api = {}
for (const file of files(SRC)) {
  const source = readFileSync(file, 'utf8')
  const pattern = /(\/\*\*(?:[^*]|\*(?!\/))*\*\/)\s*export interface (\w+)\s*\{([\s\S]*?)\n\}/g
  for (const match of source.matchAll(pattern)) {
    const info = splitDoc(match[1])
    const props = []
    const propPattern = /(\/\*\*(?:[^*]|\*(?!\/))*\*\/)?\s*(\w+)(\?)?:\s*([^\n]+)/g
    for (const prop of match[3].matchAll(propPattern)) {
      const doc = prop[1] ? splitDoc(prop[1]) : { description: '', zh: undefined }
      props.push({
        name: prop[2],
        type: prop[4].trim().replace(/,$/, ''),
        required: !prop[3],
        description: doc.description,
        zh: doc.zh,
        default: doc.defaultValue,
      })
    }
    api[match[2]] = {
      name: match[2],
      file: path.relative(path.dirname(path.dirname(SRC)), file),
      ...info,
      props,
    }
  }
}

writeFileSync(OUT, `${JSON.stringify(api, null, 2)}\n`, 'utf8')
console.log(`generated ${OUT} with ${Object.keys(api).length} component APIs`)
