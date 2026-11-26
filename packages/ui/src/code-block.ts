/**
 * Client-side enhancements for the pre-rendered code blocks: copy button,
 * npm2yarn-style package-manager tabs, online playground links and TS issue hints.
 */
import lzString from 'lz-string'

const { compressToEncodedURIComponent } = lzString

type Manager = 'pnpm' | 'npm' | 'yarn' | 'bun'
const MANAGERS: Manager[] = ['pnpm', 'npm', 'yarn', 'bun']

const EXTENSIONS: Record<string, string> = {
  ts: 'ts',
  tsx: 'tsx',
  js: 'js',
  jsx: 'jsx',
  json: 'json',
  css: 'style.css',
  html: 'index.html',
  sh: 'terminal.sh',
  bash: 'terminal.sh',
  md: 'README.md',
}

function convertCommand(line: string, to: Manager): string {
  const match = line.match(/^(pnpm|npm|yarn|npx|bunx|bun)\s+(.+)$/)
  if (!match) return line
  const [, , rest] = match
  if (/^(add|install|i)\b/.test(rest!)) {
    const packages = rest!.replace(/^(add|install|i)\s+/, '')
    return to === 'npm' ? `npm install ${packages}` : `${to} add ${packages}`
  }
  if (/^(dlx|npx|bunx)\b/.test(rest!)) {
    const command = rest!.replace(/^(dlx|npx|bunx)\s+/, '')
    if (to === 'npm') return `npx ${command}`
    if (to === 'bun') return `bunx ${command}`
    return `${to} dlx ${command}`
  }
  if (/^(run|exec)\b/.test(rest!)) {
    const script = rest!.replace(/^(run|exec)\s+/, '')
    return to === 'bun' ? `bun run ${script}` : `${to} run ${script}`
  }
  return `${to} ${rest}`
}

function detectManager(line: string): Manager | null {
  if (/^pnpm\b/.test(line)) return 'pnpm'
  if (/^npm\b|^npx\b/.test(line)) return 'npm'
  if (/^yarn\b/.test(line)) return 'yarn'
  if (/^bun\b|^bunx\b/.test(line)) return 'bun'
  return null
}

function postForm(action: string, fields: Record<string, string>) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = action
  form.target = '_blank'
  form.style.display = 'none'
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
  form.remove()
}

export interface CodeBlockOptions {
  /** Base URL for "View source" links (config.editUrlBase). */
  sourceBase?: string
  /** Current content file, appended to sourceBase. */
  file?: string
}

/** Enhance every code block in a rendered article. Returns a cleanup function. */
export function enhanceCodeBlocks(root: HTMLElement, options: CodeBlockOptions): () => void {
  const cleanups: Array<() => void> = []

  root.querySelectorAll('pre').forEach((block) => {
    const code = block.querySelector('code')
    if (!code) return
    const original = code.textContent ?? ''
    const lang = block.getAttribute('data-lang') ?? 'text'
    const meta = block.getAttribute('data-meta') ?? ''
    const fileMatch = meta.match(/file=["']?([^"'\s]+)/)
    const fileName = fileMatch?.[1] ?? `example.${EXTENSIONS[lang] ?? 'txt'}`

    const toolbar = document.createElement('div')
    toolbar.className = 'tb-code-toolbar'
    block.dataset.tbEnhanced = 'true'

    const label = document.createElement('span')
    label.className = 'tb-code-lang'
    label.textContent = lang
    toolbar.appendChild(label)

    // npm2yarn-style manager tabs.
    const lines = original.split('\n')
    const detected = lines.map(detectManager).find((value): value is Manager => value !== null)
    if (detected) {
      const tabs = document.createElement('div')
      tabs.className = 'tb-code-tabs'
      let active: Manager = detected
      const render = (manager: Manager) => {
        active = manager
        tabs.querySelectorAll('button').forEach((button) => {
          button.classList.toggle('is-active', button.dataset.manager === manager)
        })
        code.textContent = lines
          .map((line) => (detectManager(line) ? convertCommand(line, manager) : line))
          .join('\n')
      }
      MANAGERS.forEach((manager) => {
        const button = document.createElement('button')
        button.type = 'button'
        button.dataset.manager = manager
        button.textContent = manager
        button.addEventListener('click', () => render(manager))
        tabs.appendChild(button)
      })
      toolbar.appendChild(tabs)
      render(detected)
    }

    // Type-issue hints for annotated TypeScript lines.
    const issues = lines
      .map((line, index) =>
        /@ts-expect-error|@ts-ignore|\/\/\s*error:|\/\/\s*@error/i.test(line) ? index + 1 : 0,
      )
      .filter(Boolean)
    if (issues.length) {
      const badge = document.createElement('span')
      badge.className = 'tb-code-issue'
      badge.textContent = `${issues.length} type hint${issues.length > 1 ? 's' : ''}`
      badge.title = `Annotated lines: ${issues.join(', ')}`
      toolbar.appendChild(badge)
    }

    const actions = document.createElement('div')
    actions.className = 'tb-code-actions'

    if (options.sourceBase && options.file) {
      const source = document.createElement('a')
      source.href = `${options.sourceBase.replace(/\/$/, '')}/${options.file}`
      source.target = '_blank'
      source.rel = 'noreferrer'
      source.textContent = 'View source'
      actions.appendChild(source)
    }

    const playgrounds: Array<[string, () => void]> = [
      [
        'StackBlitz',
        () =>
          postForm('https://stackblitz.com/run', {
            project: JSON.stringify({
              title: configTitle(),
              template: 'node',
              files: { [fileName]: code.textContent ?? '' },
            }),
          }),
      ],
      [
        'CodePen',
        () =>
          postForm('https://codepen.io/pen/define/', {
            data: JSON.stringify({
              title: configTitle(),
              html: '',
              css: '',
              js: code.textContent ?? '',
            }),
          }),
      ],
      [
        'CodeSandbox',
        () =>
          postForm('https://codesandbox.io/api/v1/sandboxes/define', {
            parameters: compressToEncodedURIComponent(
              JSON.stringify({ files: { [fileName]: { content: code.textContent ?? '' } } }),
            ),
          }),
      ],
    ]
    playgrounds.forEach(([name, handler]) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = name
      button.title = `Open in ${name}`
      button.addEventListener('click', handler)
      actions.appendChild(button)
    })

    const copy = document.createElement('button')
    copy.type = 'button'
    copy.className = 'tb-copy-code'
    copy.textContent = 'Copy'
    const onCopy = async () => {
      try {
        await navigator.clipboard.writeText(code.textContent ?? '')
        copy.textContent = 'Copied'
      } catch {
        copy.textContent = 'Select code'
      }
      window.setTimeout(() => {
        copy.textContent = 'Copy'
      }, 1400)
    }
    copy.addEventListener('click', onCopy)
    actions.appendChild(copy)
    toolbar.appendChild(actions)

    const parent = block.parentNode
    if (!parent) return
    const wrapper = document.createElement('div')
    wrapper.className = 'tb-code-block'
    parent.insertBefore(wrapper, block)
    wrapper.append(toolbar, block)
    cleanups.push(() => {
      wrapper.remove()
    })
  })

  return () => {
    cleanups.forEach((cleanup) => {
      cleanup()
    })
  }
}

function configTitle(): string {
  return document.title.split('—')[0]?.trim() || 'TanStack Blog snippet'
}
