/** Live token editor with preview, CSS export and one-click apply. */

import { type PressTheme, type ThemeTokens, tokensToCssVariables } from '@tanstack-blog/core'
import { useState } from 'react'
import { Dropdown } from './Dropdown.js'
import { IconCheck } from './icons.js'
import { ThemeSample } from './pages.js'

const TOKEN_KEYS: Array<keyof ThemeTokens> = [
  'background',
  'surface',
  'surfaceMuted',
  'text',
  'textMuted',
  'border',
  'accent',
  'accentText',
  'codeText',
]

export interface ThemeEditorProps {
  /** Theme to start from. */
  base: PressTheme
  /** All presets, offered as starting points. */
  themes: PressTheme[]
  t: (key: string) => string
  /** Register the edited theme and activate it. */
  onApply: (theme: PressTheme) => void
}

export function ThemeEditor({ base, themes, t, onApply }: ThemeEditorProps) {
  const [sourceId, setSourceId] = useState(base.id)
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const [tokens, setTokens] = useState<{ light: ThemeTokens; dark: ThemeTokens }>({
    light: { ...base.light },
    dark: { ...base.dark },
  })
  const [copied, setCopied] = useState(false)

  const source = themes.find((theme) => theme.id === sourceId) ?? base
  const preview: PressTheme = {
    ...source,
    id: 'custom-preview',
    name: 'Custom',
    light: tokens.light,
    dark: tokens.dark,
  }
  const css = `:root{${Object.entries(tokensToCssVariables(tokens[mode]))
    .map(([key, value]) => `${key}:${value};`)
    .join('')}}`

  const changeSource = (id: string) => {
    const next = themes.find((theme) => theme.id === id)
    if (!next) return
    setSourceId(id)
    setTokens({ light: { ...next.light }, dark: { ...next.dark } })
  }

  const update = (key: keyof ThemeTokens, value: string) =>
    setTokens((current) => ({
      ...current,
      [mode]: { ...current[mode], [key]: value },
    }))

  const apply = () =>
    onApply({
      ...source,
      id: 'custom',
      name: 'Custom',
      description: 'A theme created in the editor.',
      light: tokens.light,
      dark: tokens.dark,
    })

  return (
    <div className="tb-entry tb-standalone tb-theme-editor">
      <p className="tb-eyebrow">{t('theme.editor')}</p>
      <h1 className="tb-entry-title">{t('theme.editor.title')}</h1>
      <p className="tb-entry-description">{t('theme.editor.intro')}</p>

      <div className="tb-editor-toolbar">
        <Dropdown
          label={t('theme.allSchools')}
          value={sourceId}
          onChange={changeSource}
          options={themes.map((theme) => ({ value: theme.id, label: theme.name }))}
        />
        <div className="tb-mode-switch">
          {(['light', 'dark'] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={mode === value ? 'is-active' : ''}
              onClick={() => setMode(value)}
            >
              {t(`theme.${value}`)}
            </button>
          ))}
        </div>
        <button type="button" className="tb-button is-primary" onClick={apply}>
          {t('theme.apply')}
        </button>
      </div>

      <div className="tb-editor-grid">
        <div className="tb-editor-controls">
          <h2>{t('theme.tokens')}</h2>
          {TOKEN_KEYS.map((key) => (
            <label key={key} className="tb-token-field">
              <span>{key}</span>
              <input
                type="color"
                value={tokens[mode][key]}
                onChange={(event) => update(key, event.target.value)}
                aria-label={key}
              />
              <code>{tokens[mode][key]}</code>
            </label>
          ))}
          <button
            type="button"
            className="tb-button"
            onClick={() => {
              void navigator.clipboard.writeText(css)
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1400)
            }}
          >
            {copied ? <IconCheck /> : null} {t('theme.exportCss')}
          </button>
          <pre className="tb-editor-css">
            <code>{css}</code>
          </pre>
        </div>
        <div className="tb-editor-preview">
          <h2>{t('theme.sample')}</h2>
          <ThemeSample theme={preview} mode={mode} t={t} />
        </div>
      </div>
    </div>
  )
}
