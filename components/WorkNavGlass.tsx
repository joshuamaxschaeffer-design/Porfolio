'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'

export interface WorkPill {
  label: string
  href: string
}

/**
 * Glass "Work" navigation — hovering (or tapping, on touch) the Work label
 * makes a row of liquid-glass pills appear to STRETCH out of the nav capsule.
 *
 * Glass recipe is lifted 1:1 from the Baserate left SectionNav (Figma node
 * 234:53845): fill rgba(242,242,245,0.24) + backdrop-blur 10px, hairline border
 * rgba(7,14,44,0.05), shadow biased downward.
 *
 * The "liquid" merge is a gooey SVG filter (feGaussianBlur + feColorMatrix alpha
 * threshold) applied to a goo layer behind the pills: as each pill scales/slides
 * out from the Work trigger, its blurred silhouette overlaps the capsule's and
 * the threshold fuses them into one fluid mass before they separate — so the
 * pills read as liquid glass pulling away from the nav. A crisp glass layer
 * rides on top so text/edges stay sharp.
 */
export function WorkNavGlass({ items }: { items: WorkPill[] }) {
  const [open, setOpen] = useState(false)
  const gooId = useId().replace(/:/g, '')
  const wrapRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)

  // hover intent: small close delay so moving cursor across the gap is forgiving
  const show = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hide = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 120)
  }

  // touch / outside-click + Escape handling for the tap-to-expand path
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
      {/* Gooey filter def — scoped id so multiple instances don't collide. */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          <filter id={`goo-${gooId}`} colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={show}
        className="relative z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        Work
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* The pill flyout, anchored just under the Work trigger. */}
      <div
        className={`absolute left-1/2 top-[calc(100%-6px)] z-10 -translate-x-1/2 pt-2 ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* GOO LAYER — blurred capsules that fuse via the gooey filter so the
            pills look like they liquify out of the nav. Purely visual. */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center gap-2"
          style={{ filter: `url(#goo-${gooId})` }}
        >
          {/* seed blob sitting under the trigger so pills merge UP into the nav */}
          <span className="absolute left-1/2 top-0 h-7 w-16 -translate-x-1/2 -translate-y-4 rounded-full bg-[rgba(242,242,245,0.9)]" />
          {items.map((it, i) => (
            <span
              key={it.label}
              className="h-9 rounded-full bg-[rgba(242,242,245,0.9)] transition-[transform,opacity] duration-500"
              style={{
                width: `${Math.max(72, it.label.length * 9 + 28)}px`,
                transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
                transitionDelay: `${open ? i * 45 : 0}ms`,
                transform: open ? 'translateY(0) scale(1)' : 'translateY(-18px) scale(0.4)',
                opacity: open ? 1 : 0,
              }}
            />
          ))}
        </div>

        {/* CRISP LAYER — the real, interactive glass pills with sharp text. */}
        <div className="relative flex items-center justify-center gap-2">
          {items.map((it, i) => (
            <Link
              key={it.label}
              href={it.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="group/pill flex h-9 items-center whitespace-nowrap rounded-full border border-[rgba(7,14,44,0.05)] bg-[rgba(242,242,245,0.24)] px-4 text-sm text-neutral-700 backdrop-blur-[10px] transition-[transform,opacity,background-color] duration-500 hover:bg-[rgba(242,242,245,0.55)] hover:text-neutral-900 dark:text-neutral-200 [box-shadow:0_8px_22px_rgba(7,14,44,0.09),0_2px_6px_rgba(7,14,44,0.05)]"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
                transitionDelay: `${open ? 60 + i * 45 : 0}ms`,
                transform: open ? 'translateY(0) scale(1)' : 'translateY(-14px) scale(0.6)',
                opacity: open ? 1 : 0,
              }}
            >
              {it.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
