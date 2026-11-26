/**
 * Live component examples built from the project's own `@tanstack-blog/ui`
 * package. These double as documentation for the UI subpackage.
 */

import { allThemes } from '@tanstack-blog/themes'
import {
  Breadcrumbs,
  createUiStore,
  Dropdown,
  Feedback,
  IconThemes,
  LocaleSwitcher,
  PageNav,
  SearchTrigger,
  ThemeSwitcher,
  Toc,
} from '@tanstack-blog/ui'
import { type ReactNode, useState } from 'react'

function DemoFrame({ children }: { children: ReactNode }) {
  return (
    <div className="tb-demo-frame">
      <span className="tb-demo-dot" />
      <span className="tb-demo-dot" />
      <span className="tb-demo-dot" />
      <div className="tb-demo-body">{children}</div>
    </div>
  )
}

/** Dropdown example: fully controlled, keyboard and outside-click aware. */
export function DropdownDemo() {
  const [value, setValue] = useState('linear')
  return (
    <DemoFrame>
      <Dropdown
        label="Theme"
        icon={<IconThemes />}
        value={value}
        onChange={setValue}
        options={[
          { value: 'linear', label: 'Linear', hint: 'dark' },
          { value: 'muji', label: 'MUJI', hint: 'paper' },
          { value: 'stripe-press', label: 'Stripe Press', hint: 'editorial' },
        ]}
      />
      <p>
        Selected: <code>{value}</code>
      </p>
    </DemoFrame>
  )
}

/** Feedback example: the same widget used at the bottom of every doc page. */
export function FeedbackDemo({ t }: { t: (key: string) => string }) {
  return (
    <DemoFrame>
      <Feedback entryId="component-demo" t={t} />
    </DemoFrame>
  )
}

function DemoStore({
  children,
}: {
  children: (store: ReturnType<typeof createUiStore>) => ReactNode
}) {
  const [store] = useState(() => createUiStore({ themeId: 'linear' }))
  return <>{children(store)}</>
}

export const componentExamples: Record<
  string,
  (props: { t: (key: string) => string }) => ReactNode
> = {
  dropdown: () => <DropdownDemo />,
  feedback: ({ t }) => <FeedbackDemo t={t} />,
  'search-trigger': () => (
    <DemoStore>
      {(store) => (
        <SearchTrigger
          store={store}
          config={{ search: { placeholder: 'Search docs…', hotkey: '⌘K' } } as never}
          t={(key) => key}
        />
      )}
    </DemoStore>
  ),
  'theme-switcher': () => (
    <DemoStore>
      {(store) => <ThemeSwitcher store={store} themes={allThemes} t={(key) => key} allowSwitch />}
    </DemoStore>
  ),
  'locale-switcher': () => (
    <DemoStore>
      {(store) => (
        <LocaleSwitcher
          store={store}
          locales={[
            { code: 'en', label: 'English', dir: 'ltr' },
            { code: 'zh-CN', label: '简体中文', dir: 'ltr' },
          ]}
          t={() => 'Language'}
          onLocaleChange={() => {}}
        />
      )}
    </DemoStore>
  ),
  breadcrumbs: () => (
    <DemoFrame>
      <Breadcrumbs
        items={[{ label: 'Docs', to: '/docs' }, { label: 'Components' }, { label: 'Dropdown' }]}
      />
    </DemoFrame>
  ),
  'page-nav': () => (
    <DemoFrame>
      <PageNav
        prev={{ id: 'a', title: 'Previous page' } as never}
        next={{ id: 'b', title: 'Next page' } as never}
        t={() => ''}
      />
    </DemoFrame>
  ),
  toc: ({ t }) => (
    <DemoFrame>
      <Toc
        headings={[
          { id: 'usage', text: 'Usage', level: 2 },
          { id: 'behaviour', text: 'Behaviour', level: 2 },
        ]}
        t={t}
      />
    </DemoFrame>
  ),
}
