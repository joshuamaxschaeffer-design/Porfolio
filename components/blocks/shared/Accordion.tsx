'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

export interface AccordionItem {
  q: string
  a: string
  /** optional small label on the left (e.g. number or category) */
  tag?: string
}

/**
 * Accordion — a clean expand/collapse list (FAQ / services / process). Big
 * editorial rows, a rotating +/× marker, and height-animated answers. The
 * dependable "deep content without the scroll cost" pattern.
 *
 * `single` (default) closes others when one opens; set false to allow many.
 */
export function Accordion({
  items,
  className,
  single = true,
  accent = 'var(--br-gold)',
}: {
  items: AccordionItem[]
  className?: string
  single?: boolean
  accent?: string
}) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = single ? new Set<number>() : new Set(prev)
      if (prev.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div className={`border-t border-[var(--br-line)] ${className ?? ''}`}>
      {items.map((it, i) => {
        const isOpen = open.has(i)
        return (
          <div key={i} className="border-b border-[var(--br-line)]">
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
            >
              <span className="flex items-baseline gap-4 md:gap-6">
                {it.tag ? (
                  <span className="br-data text-[12px] font-semibold tabular-nums" style={{ color: accent }}>{it.tag}</span>
                ) : null}
                <span className="text-[20px] font-medium leading-snug tracking-[-0.01em] text-[var(--br-ink)] md:text-[28px]">
                  {it.q}
                </span>
              </span>
              <span
                aria-hidden
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border text-lg transition-transform duration-300"
                style={{ borderColor: 'var(--br-line)', transform: isOpen ? 'rotate(135deg)' : 'none', color: accent }}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-7 text-[15px] leading-relaxed text-[var(--br-muted)] md:pb-9 md:text-lg">
                    {it.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
