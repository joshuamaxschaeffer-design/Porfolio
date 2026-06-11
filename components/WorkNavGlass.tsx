'use client'

import Link from 'next/link'
import type { Brand } from '@/lib/brand'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { WorkIcon } from './nav-icons'

export interface WorkPill {
  label: string
  href: string
}

/** Per-brand glass values. Mirrors the --glass-* header vars, but declared here
 *  too because the flyout is PORTALED to <body> and CSS vars set on the header
 *  don't reach a portal. */
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
 * "Work" nav item. Like the other items it's just the icon by default; on
 * hover/open the icon is swapped for the "Work" text (simple swap, no
 * animation). A vertical stack of glass pills drops beneath it.
 *
 * The flyout is PORTALED to <body> (not nested in the header) so each pill's
 * backdrop-filter blurs the real page, not the header's already-blurred layer.
 * Its position is measured from the trigger when it opens — and because the
 * trigger doesn't animate, that single measurement is stable. Pills' text is
 * aligned under the "Work" text: trigger has px-3 (12px), pills have px-4
 * (16px), so portal left = triggerLeft + 12 − 16 = triggerLeft − 4.
 */
export function WorkNavGlass({ items, brand }: { items: WorkPill[]; brand: Brand }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<number | null>(null)
  const g = glassVars(brand)

  useEffect(() => setMounted(true), [])

  // Position the flyout from the trigger (stable: the trigger doesn't animate).
  const place = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({ left: Math.round(r.left + 12 - 16), top: Math.round(r.bottom) })
  }

  useEffect(() => {
    if (!open) return
    place()
    // The trigger swaps icon→text on open, which widens it and shifts its left
    // edge; re-measure after that paint so the pills anchor to the final spot.
    const raf = requestAnimationFrame(place)
    const onMove = () => place()
    window.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('resize', onMove)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onMove)
      window.removeEventListener('resize', onMove)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

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
  const notTouch = (e: React.PointerEvent) => e.pointerType !== 'touch'

  return (
    <div
      className="flex h-full items-center"
      onPointerEnter={(e) => notTouch(e) && show()}
      onPointerLeave={(e) => notTouch(e) && scheduleHide()}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Work"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center justify-center rounded-full border px-3 transition-colors duration-150"
        style={{
          color: open ? g.fgHover : g.fg,
          backgroundColor: open ? g.fill : 'transparent',
          borderColor: open ? g.border : 'transparent',
        }}
      >
        {/* icon by default; swapped for the text when open (simple swap) */}
        {open ? (
          <span className="whitespace-nowrap text-[13px] uppercase tracking-[0.08em]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
            Work
          </span>
        ) : (
          <span className="grid place-items-center [&>svg]:block">
            <WorkIcon />
          </span>
        )}
      </button>

      {mounted &&
        createPortal(
          <div
            onPointerEnter={(e) => notTouch(e) && show()}
            onPointerLeave={(e) => notTouch(e) && scheduleHide()}
            style={{
              position: 'fixed',
              left: pos?.left ?? -9999,
              top: pos?.top ?? -9999,
              zIndex: 60,
              paddingTop: 8, // invisible bridge over the bar→pill gap
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
                  transitionDuration: '300ms',
                  transitionDelay: `${open ? i * 40 : 0}ms`,
                  transform: open ? 'translateY(0)' : 'translateY(-6px)',
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
