'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export interface WorkPill {
  label: string
  href: string
}

/**
 * "Work" nav item — hovering (or tapping, on touch) drops a vertically stacked,
 * left-aligned list of glass pills beneath the label.
 *
 * Glass recipe matches the left SectionNav rail (Figma 234:53845):
 * fill rgba(242,242,245,0.24) + backdrop-blur 10px, hairline border
 * rgba(7,14,44,0.05), shadow biased downward.
 * Labels: Lexend Deca, navy — same family as the nav links.
 */
export function WorkNavGlass({ items }: { items: WorkPill[] }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)

  const show = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hide = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={show}
        className="flex items-center gap-1 uppercase tracking-[0.08em] text-[var(--nav-fg)] transition-colors hover:text-[var(--nav-fg-hover)]"
        style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '14px' }}
      >
        Work
        <svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          aria-hidden
          className={`mt-px transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Left-aligned vertical pill stack, anchored to the left edge of "Work". */}
      <div
        className={`absolute left-0 top-[calc(100%+10px)] z-50 flex flex-col items-start gap-1.5 ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {items.map((it, i) => (
          <Link
            key={it.label}
            href={it.href}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="flex h-9 items-center whitespace-nowrap rounded-full border border-[rgba(7,14,44,0.05)] bg-[rgba(242,242,245,0.24)] px-4 text-[14px] uppercase tracking-[0.06em] text-[var(--nav-fg)] backdrop-blur-[10px] transition-[transform,opacity,background-color,color] hover:bg-[rgba(242,242,245,0.55)] hover:text-[var(--nav-fg-hover)] [box-shadow:0_8px_22px_rgba(7,14,44,0.09),0_2px_6px_rgba(7,14,44,0.05)]"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              transitionDuration: '420ms',
              transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
              transitionDelay: `${open ? i * 45 : 0}ms`,
              transform: open ? 'translateY(0)' : 'translateY(-8px)',
              opacity: open ? 1 : 0,
            }}
          >
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
