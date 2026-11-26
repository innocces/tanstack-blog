/**
 * Hydrate the custom elements emitted by the TanStack Markdown docs preset:
 * comment components (separator, tabs) and framework panels. The parser owns
 * the contract; this module only supplies the interactive presentation.
 */

interface TabMeta {
  slug: string
  name: string
}

function attributes(node: Element): Record<string, unknown> {
  try {
    return JSON.parse(node.getAttribute('data-attributes') ?? '{}') as Record<string, unknown>
  } catch {
    return {}
  }
}

/** Upgrade preset custom elements into accessible widgets. Returns cleanup. */
export function enhanceMarkdownComponents(root: HTMLElement): () => void {
  if (root.dataset.tbComponents === 'enhanced') return () => {}
  root.dataset.tbComponents = 'enhanced'
  const added: HTMLElement[] = []

  root.querySelectorAll('md-comment-component[data-component="separator"]').forEach((node) => {
    const attrs = attributes(node)
    const hr = document.createElement('hr')
    hr.className = 'tb-separator'
    hr.dataset.tone = String(attrs.tone ?? 'subtle')
    node.replaceWith(hr)
  })

  root.querySelectorAll('md-comment-component[data-component="tabs"]').forEach((node) => {
    const meta = attributes(node)
    const tabs = Array.isArray(meta.tabs) ? (meta.tabs as TabMeta[]) : []
    const panels = [...node.querySelectorAll('md-tab-panel')]
    if (!panels.length) return

    const wrapper = document.createElement('div')
    wrapper.className = 'tb-tabs'
    const bar = document.createElement('div')
    bar.className = 'tb-tab-bar'
    bar.setAttribute('role', 'tablist')

    const names = tabs.length
      ? tabs.map((tab) => ({ slug: tab.slug, name: tab.name }))
      : panels.map((panel) => ({
          slug: panel.getAttribute('data-tab-slug') ?? 'tab',
          name: panel.getAttribute('data-tab-slug') ?? 'Tab',
        }))

    names.forEach((item, index) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.role = 'tab'
      button.textContent = item.name
      button.setAttribute('aria-selected', String(index === 0))
      button.addEventListener('click', () => {
        bar.querySelectorAll('button').forEach((other) => {
          other.setAttribute('aria-selected', 'false')
          other.classList.remove('is-active')
        })
        button.setAttribute('aria-selected', 'true')
        button.classList.add('is-active')
        panels.forEach((panel) => {
          const target = panel as HTMLElement
          target.hidden = target.getAttribute('data-tab-slug') !== item.slug
        })
      })
      if (index === 0) button.classList.add('is-active')
      bar.appendChild(button)
    })

    const body = document.createElement('div')
    body.className = 'tb-tab-body'
    panels.forEach((panel, index) => {
      const element = panel as HTMLElement
      element.hidden = index !== 0
      body.appendChild(element)
    })
    wrapper.append(bar, body)
    node.replaceWith(wrapper)
    added.push(wrapper)
  })

  root.querySelectorAll('md-framework-panel').forEach((panel) => {
    const label = panel.getAttribute('data-framework')
    if (!label) return
    const badge = document.createElement('span')
    badge.className = 'tb-framework-badge'
    badge.textContent = label
    panel.prepend(badge)
    added.push(badge as HTMLElement)
  })

  return () => {
    added.forEach((node) => {
      node.remove()
    })
  }
}
