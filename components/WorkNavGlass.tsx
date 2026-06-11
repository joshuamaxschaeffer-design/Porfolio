'use client'

import Link from 'next/link'
import type { Brand } from '@/lib/brand'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NAV_BOX } from './NavIconLink'
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
 * "Work" nav item. Like the other items it's the icon by default; on
 * hover/open the icon CROSSFADES to the "Work" text (250ms opacity, stacked
 * grid cell — same recipe as NavIconLink). A vertical stack of glass pills
 * drops beneath it. The trigger is a full-bar-height hover target; the portal
 * starts EXACTLY at the bar's bottom edge (no overlap, no bridge), and the
 * pills animate with OPACITY ONLY — anything that puts flyout geometry inside
 * the trigger's hover area (static padding OR a transform mid-animation)
 * makes the browser retarget hover to the portal, fire pointerleave on the
 * trigger, and instantly close it (the "activates then deactivates" flicker).
 *
 * The flyout is PORTALED to <body> (not nested in the header) so each pill's
 * backdrop-filter blurs the real page, not the header's already-blurred layer.
 * Its position is measured from the trigger when it opens — the trigger is a
 * fixed-width box (NAV_BOX, same as every nav item) that never changes size,
 * so the measurement is stable. The pill stack is left-aligned to the trigger
 * box's left edge and expands downward.
 */
export function WorkNavGlass({ items, brand }: { items: WorkPill[]; brand: Brand }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)
  const g = glassVars(brand)

  useEffect(() => setMounted(true), [])

  // Position the flyout from the trigger (stable: the trigger doesn't animate).
  const place = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({ left: Math.round(r.left), top: Math.round(r.bottom) })
  }

  useEffect(() => {
    if (!open) return
    place()
    const onMove = () => place()
    window.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('resize', onMove)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)

    // GEOMETRIC containment instead of pointerleave pairing. Entering
    // diagonally from below skims the seam where the portal materializes;
    // if the pointer is sampled there during the frame before the portal is
    // interactive, a leave fires with no matching enter and the close timer
    // wins (the diagonal flicker). So while open we track pointermove and
    // decide by POSITION: inside trigger rect or portal rect (±6px) → stay
    // open; outside both → arm the 200ms close once (not reset per move).
    const PAD = 6
    const within = (r: DOMRect, x: number, y: number) =>
      x >= r.left - PAD && x <= r.right + PAD && y >= r.top - PAD && y <= r.bottom + PAD
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const t = triggerRef.current?.getBoundingClientRect()
      const p = portalRef.current?.getBoundingClientRect()
      const inside =
        (t ? within(t, e.clientX, e.clientY) : false) ||
        (p ? within(p, e.clientX, e.clientY) : false)
      if (inside) clearClose()
      else if (closeTimer.current === null) scheduleHide()
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    const onDocLeave = () => scheduleHide()
    document.documentElement.addEventListener('mouseleave', onDocLeave)
    return () => {
      window.removeEventListener('scroll', onMove)
      window.removeEventListener('resize', onMove)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', onDocLeave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null
      setOpen(false)
    }, 200)
  }
  const notTouch = (e: React.PointerEvent) => e.pointerType !== 'touch'

  return (
    <div
      className="flex h-full items-center"
      onPointerEnter={(e) => notTouch(e) && show()}
      // No onPointerLeave: closing is decided by the geometric pointermove
      // check while open (leave events mis-pair at the portal seam).
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Work"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-full ${NAV_BOX} items-center justify-center`}
      >
        <span
          className="grid h-9 w-full place-items-center rounded-full border"
          style={{
            color: open ? g.fgHover : g.fg,
            backgroundColor: open ? g.fill : 'transparent',
            borderColor: open ? g.border : 'transparent',
            transition: 'background-color 250ms, border-color 250ms, color 250ms',
          }}
        >
          {/* icon ⇄ text asymmetric crossfade, stacked in one grid cell:
              outgoing glyph 100ms, incoming glyph 600ms after a 75ms delay
              (mirrors NavIconLink) */}
          <span
            className="col-start-1 row-start-1 grid place-items-center [&>svg]:block"
            style={{
              opacity: open ? 0 : 1,
              transition: open ? 'opacity 100ms' : 'opacity 600ms 75ms',
            }}
          >
            <WorkIcon />
          </span>
          <span
            className="col-start-1 row-start-1 whitespace-nowrap text-[13px] uppercase tracking-[0.08em]"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              opacity: open ? 1 : 0,
              transition: open ? 'opacity 600ms 75ms' : 'opacity 100ms',
            }}
          >
            Work
          </span>
        </span>
      </button>

      {mounted &&
        createPortal(
          <div
            ref={portalRef}
            onPointerEnter={(e) => notTouch(e) && show()}
            style={{
              position: 'fixed',
              left: pos?.left ?? -9999,
              top: pos?.top ?? -9999,
              zIndex: 60,
              // No bridge padding: the full-height trigger's bottom IS the
              // bar's bottom, so the portal starts flush at the seam. Any
              // overlap with the trigger re-triggers the hover-retarget bug.
              paddingTop: 0,
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
                // NO transform on entrance! Hit-testing follows transforms:
                // the old translateY(-6px) start poked the first pill ABOVE
                // the container into the trigger's hover strip mid-animation,
                // stealing hover and closing the menu (the flicker). The
                // top-to-bottom stagger alone reads as "expanding downward".
                className="flex h-9 items-center whitespace-nowrap rounded-full px-4 text-[14px] uppercase tracking-[0.06em] backdrop-blur-[14px] backdrop-saturate-150 transition-[opacity,background-color,color]"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 500,
                  color: g.fg,
                  backgroundColor: g.fill,
                  border: `1px solid ${g.border}`,
                  boxShadow:
                    '0 8px 22px rgba(7,14,44,0.12), 0 2px 6px rgba(7,14,44,0.06), inset 0 1px 0 rgba(255,255,255,0.55)',
                  transitionDuration: '250ms',
                  transitionDelay: `${open ? i * 40 : 0}ms`,
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
