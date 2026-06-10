'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export interface WorkPill {
  label: string
  href: string
}

/**
 * "Work" nav item — a vertically stacked, left-aligned list of glass pills
 * drops beneath the label on hover (desktop) or tap (touch).
 *
 * Open state is React-driven (inline styles) so the reveal is 100% reliable
 * regardless of Tailwind variant quirks. Hover stability comes from structure,
 * not timing:
 *   - the trigger spans the FULL nav height (the whole bar is the hover target)
 *   - the flyout starts flush at the bar's bottom edge (top-full) with its own
 *     top padding as an invisible bridge, so there is NO gap between bar and
 *     pills, and the flyout itself sits inside the hover wrapper
 *   - pointerenter/leave drive open/close, with a short close delay for extra
 *     forgiveness on diagonal cursor moves
 *
 * Glass: whiter translucent fill (--glass-fill / --glass-fill-hover, set on the
 * header so it's more opaque-white on dark brands) + 12px blur + saturate,
 * hairline border, downward shadow + top inner highlight.
 */
export function WorkNavGlass({ items }: { items: WorkPill[] }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)

  const clearClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  const show = () => {
    clearClose()
    setOpen(true)
  }
  const scheduleHide = () => {
    clearClose()
    closeTimer.current = window.setTimeout(() => setOpen(false), 200)
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
      className="relative flex h-full items-center"
      onPointerEnter={(e) => e.pointerType !== 'touch' && show()}
      onPointerLeave={(e) => e.pointerType !== 'touch' && scheduleHide()}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-full items-center gap-1 uppercase tracking-[0.08em] text-[var(--nav-fg)] transition-colors hover:text-[var(--nav-fg-hover)]"
        style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '14px' }}
      >
        Work
        <svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          aria-hidden
          className="mt-px transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        >
          <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Flyout — flush to the bar bottom (top-full); pt-2 is an invisible
          bridge so there's no dead gap. pointer-events follow open state. */}
      <div
        className="absolute left-0 top-full z-50 flex flex-col items-start gap-1.5 pt-2"
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        {items.map((it, i) => (
          <Link
            key={it.label}
            href={it.href}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="flex h-9 items-center whitespace-nowrap rounded-full border border-[var(--glass-border)] bg-[var(--glass-fill)] px-4 text-[14px] uppercase tracking-[0.06em] text-[var(--nav-fg)] backdrop-blur-[12px] backdrop-saturate-150 transition-[transform,opacity,background-color,color] hover:bg-[var(--glass-fill-hover)] hover:text-[var(--nav-fg-hover)] [box-shadow:0_8px_22px_rgba(7,14,44,0.12),0_2px_6px_rgba(7,14,44,0.06),inset_0_1px_0_rgba(255,255,255,0.5)]"
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
