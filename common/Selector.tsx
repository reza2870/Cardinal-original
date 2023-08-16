import { ChevronDown } from 'assets/ChevronDown'
import { GlyphSelectClear } from 'assets/GlyphSelectClear'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { inputClassNames } from '@/components/UI/inputs/TextInput'

export type SelectorPositions = 'from-top' | 'from-bottom'

type Option<T> = { label: string; value: T }
type Props<T> = {
  placeholder?: string
  options: Option<T>[]
  className?: string
  disabled?: boolean
  error?: boolean
  defaultOption?: Option<T>
  isClearable?: boolean
  onChange?: (arg?: Option<T>) => void
  colorized?: boolean
  highlight?: boolean
  position?: SelectorPositions
  value?: Option<T>
}

export const Selector = <T,>({
  placeholder = 'Select',
  defaultOption,
  disabled,
  error,
  className,
  onChange,
  isClearable,
  value,
  options = [],
  position = 'from-top',
}: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<Option<T> | undefined>(
    defaultOption
  )

  useEffect(() => {
    value?.label &&
      value?.label !== internalValue?.label &&
      setInternalValue(value)
  }, [value?.label])

  const ref = useRef(null)
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      // @ts-ignore
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [ref])

  return (
    <div className="z-100 relative cursor-pointer text-base" ref={ref}>
      <div
        className={twMerge([
          inputClassNames({ disabled, error }),
          'relative z-0 flex items-center justify-between',
          isOpen && 'bg-dark-4',
          className,
        ])}
        onClick={() => !disabled && setIsOpen((v) => !v)}
      >
        {internalValue ? (
          <div className="text-light-0">{internalValue.label}</div>
        ) : (
          <div className="text-medium-3">{placeholder}</div>
        )}
        <div className="flex items-center gap-1">
          {isClearable && internalValue ? (
            <div
              className="opacity-80 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                setInternalValue(undefined)
                onChange && onChange(undefined)
              }}
            >
              <GlyphSelectClear />
            </div>
          ) : (
            <ChevronDown />
          )}
        </div>
      </div>
      <div
        className={classNames([
          'absolute z-50 -mb-1 w-full rounded-md border-2 border-gray-700 bg-gray-800 transition-all',
          isOpen ? 'h-auto opacity-100' : 'h-0 overflow-hidden opacity-0',
          position === 'from-top' ? 'top-0' : 'bottom-1',
        ])}
      >
        {options.map((o) => (
          <div
            key={o.label}
            className="flex cursor-pointer items-center justify-between p-3 text-light-0 transition-colors hover:text-primary"
            onClick={() => {
              setInternalValue(o)
              setIsOpen((v) => !v)
              onChange && onChange(o)
            }}
          >
            <div>{o.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
