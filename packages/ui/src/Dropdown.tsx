/** Accessible custom select used by the header instead of native <select>. */
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { IconCheck, IconChevronDown } from './icons.js'

/**
 * @description One option in a Dropdown menu.
 * @description.zh 下拉菜单中的单个选项
 */
export interface DropdownOption {
  /** @description Option value. @description.zh 选项值 */
  value: string
  /** @description Visible label. @description.zh 显示的文案 */
  label: string
  /** @description Small secondary hint. @description.zh 次要提示文字 */
  hint?: string
}

/**
 * @description Accessible custom select used instead of a native select.
 * @description.zh 用于替代原生 select 的无障碍自定义下拉菜单
 */
export interface DropdownProps {
  /**
   * @description Currently selected value.
   * @description.zh 当前选中的值
   */
  value: string
  /**
   * @description Options shown in the popover.
   * @description.zh 弹窗中展示的选项列表
   */
  options: DropdownOption[]
  /**
   * @description Called when an option is chosen.
   * @description.zh 选中某个选项时触发
   */
  onChange: (value: string) => void
  /**
   * @description Accessible label for the trigger.
   * @description.zh 触发按钮的无障碍标签
   */
  label: string
  /**
   * @description Optional leading icon.
   * @description.zh 可选的前置图标
   */
  icon?: ReactNode
  /**
   * @description Extra class on the root element.
   * @description.zh 根节点的附加类名
   * @default undefined
   */
  className?: string
}

export function Dropdown({ value, options, onChange, label, icon, className = '' }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    const onDown = (event: MouseEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`tb-dropdown ${className}`} ref={root}>
      <button
        type="button"
        className="tb-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((state) => !state)}
      >
        {icon}
        <span>{selected?.label ?? value}</span>
        <IconChevronDown className="tb-dropdown-chevron" />
      </button>
      {open ? (
        <div className="tb-dropdown-menu" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={option.value === value ? 'is-selected' : ''}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
            >
              <span className="tb-dropdown-option-label">{option.label}</span>
              {option.hint ? <small>{option.hint}</small> : null}
              {option.value === value ? <IconCheck className="tb-dropdown-check" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
