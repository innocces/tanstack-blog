/**
 * Live component examples built from the project's own `@tanstack-blog/ui`
 * package. These double as documentation for the UI subpackage.
 */

import { Dropdown, Feedback, IconThemes } from '@tanstack-blog/ui'
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

export const componentExamples: Record<
  string,
  (props: { t: (key: string) => string }) => ReactNode
> = {
  dropdown: () => <DropdownDemo />,
  feedback: ({ t }) => <FeedbackDemo t={t} />,
}
