'use client'

import Link from 'next/link'
import type { Brand } from '@/lib/brand'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { WorkIcon } from './nav-icons'

export interface WorkPill {
  label: string
  href: string
}

/** Per-brand glass values. Mirrors the --glass-* vars on the header, but
 *  declared here too because the flyout is PORTALED to <body> and CSS vars
 *  set on the header don't reach a portal (it's not a DOM descendant). */
function glassVars(brand: Brand) {
  const practice = brand === 'practice'
  return {
    fg: practice ? '#e7e7ea' : '#070E2C',
    fgHover: practice ? '#ffffff' : '#000000',
    fill: practice ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.55)',
    fillHover: practice ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.80)',
    border: practice ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.70)',
  }
}

/**
 * "Work" nav item — a vertically stacked, left-aligned list of glass pills
 * drops beneath the label on hover (desktop) or tap (touch).
 *
 * IMPORTANT: the flyout is PORTALED to document.body, NOT nested in the header.
 * The header has its own backdrop-blur, which creates a backdrop root; a
 * descendant's backdrop-filter would then only sample the header's (already
 * blurred, near-transparent) layer, making the pills look transparent. Rendering
 * outside the header lets each pill blur the real page content → true glass.
 *
 * Positioning: the portal is `fixed`, placed under the trigger via its measured
 * rect (re-measured on scroll/resize). Hover stays alive across the gap because
 * pointer enter/leave is tracked on BOTH the trigger and the portal, and only a
 * leave from both (after a short delay) closes it.
 */
export function WorkNavGlass({ items, brand }: { items: WorkPill[]; brand: Brand }) {
  const [open, setOpen] = useState(false)
  const [rect, setRect] = useState<{ left: number; top: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const closeTimer = useRef<number | null>(null)
  const [labelWidth, setLabelWidth] = useState(0)
  const g = glassVars(brand)

  useEffect(() => {
    if (measureRef.current) setLabelWidth(measureRef.current.scrollWidth)
  }, [])

  useEffect(() => setMounted(true), [])

  // Pill horizontal text inset (px-4 = 16px on the pill <Link>).
  const PILL_TEXT_INSET = 16

  // Align the pills' TEXT with the "Work" TEXT. Rather than assume the trigger's
  // box model, MEASURE where the "Work" glyphs actually start (measureRef is the
  // label's inner span; its content starts after its own pl-2). Its left edge is
  // stable whether the label is expanded or clipped, so this is timing-safe.
  const measure = useCallback(() => {
    const trigger = triggerRef.current
    const label = measureRef.current
    if (!trigger || !label) return
    const tr = trigger.getBoundingClientRect()
    const lr = label.getBoundingClientRect()
    const labelPadLeft = parseFloat(getComputedStyle(label).paddingLeft) || 0
    const workGlyphLeft = lr.left + labelPadLeft
    // pill box left so its text (after PILL_TEXT_INSET) lands on the Work glyphs
    setRect({ left: Math.round(workGlyphLeft - PILL_TEXT_INSET), top: Math.round(tr.bottom) })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    measure()
    // Re-measure after paint in case fonts/layout settle the trigger width.
    const raf = requestAnimationFrame(measure)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [open, measure])

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
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const notTouch = (e: React.PointerEvent) => e.pointerType !== 'touch'

  return (
    <div
      className="group/work relative grid h-9 w-9 place-items-center"
      onPointerEnter={(e) => notTouch(e) && show()}
      onPointerLeave={(e) => notTouch(e) && scheduleHide()}
    >
      {/* Trigger sits in a fixed-width slot and is absolutely centered, so the
          "Work" label expands the pill OUTWARD FROM CENTER (both directions),
          floating above neighbors — they don't move. */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Work"
        onClick={() => setOpen((v) => !v)}
        className="absolute left-1/2 top-1/2 z-10 flex h-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-transparent px-2.5 transition-[background-color,border-color,color] duration-300"
        style={{
          color: open ? g.fgHover : g.fg,
          backgroundColor: open ? g.fill : 'transparent',
          borderColor: open ? g.border : 'transparent',
          zIndex: open ? 20 : 10,
        }}
      >
        {/* Icon shows ONLY when closed; the moment the menu opens it's gone and
            the "Work" text takes its place (instant swap, no icon animation).
            No chevron (per request). */}
        {!open && (
          <span className="grid place-items-center [&>svg]:block">
            <WorkIcon />
          </span>
        )}
        <span
          className="overflow-hidden whitespace-nowrap transition-[max-width] duration-300 ease-out"
          style={{ maxWidth: open ? labelWidth : 0 }}
        >
          <span ref={measureRef} className="inline-block px-0.5 text-[13px] uppercase tracking-[0.08em]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
            Work
          </span>
        </span>
      </button>

      {/* Portaled flyout — lives on <body>, fixed under the trigger, so its
          backdrop-filter blurs the page (not the header's blurred layer). */}
      {mounted &&
        createPortal(
          <div
            // The portal is the hover target's other half; keep the menu alive
            // while the cursor is over it, and close shortly after leaving.
            onPointerEnter={(e) => notTouch(e) && show()}
            onPointerLeave={(e) => notTouch(e) && scheduleHide()}
            style={{
              position: 'fixed',
              left: rect?.left ?? -9999,
              top: rect?.top ?? -9999,
              zIndex: 60,
              // An invisible bridge (paddingTop) covers the gap between the bar
              // and the first pill so the pointer never crosses a dead zone.
              paddingTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 6,
              pointerEvents: open ? 'auto' : 'none',
            }}
          >
            {items.map((it, i) => (
              <Link
                key={it.label}
                href={it.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="flex h-9 items-center whitespace-nowrap rounded-full px-4 text-[14px] uppercase tracking-[0.06em] backdrop-blur-[14px] backdrop-saturate-150 transition-[transform,opacity,background-color,color]"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 500,
                  color: g.fg,
                  backgroundColor: g.fill,
                  border: `1px solid ${g.border}`,
                  boxShadow:
                    '0 8px 22px rgba(7,14,44,0.12), 0 2px 6px rgba(7,14,44,0.06), inset 0 1px 0 rgba(255,255,255,0.55)',
                  transitionDuration: '420ms',
                  transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
                  transitionDelay: `${open ? i * 45 : 0}ms`,
                  transform: open ? 'translateY(0)' : 'translateY(-8px)',
                  opacity: open ? 1 : 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = g.fillHover
                  e.currentTarget.style.color = g.fgHover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = g.fill
                  e.currentTarget.style.color = g.fg
                }}
              >
                {it.label}
              </Link>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}
