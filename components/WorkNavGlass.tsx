'use client'

import Link from 'next/link'
import type { Brand } from '@/lib/brand'
import { useEffect, useId, useRef, useState } from 'react'
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
    // Near-solid fill for the gooey BLOB layer (the liquid). The gooey
    // alpha-contrast filter needs mostly-opaque shapes to merge cleanly; the
    // frosted glass pills ride on top. White on both brands - lighter on the
    // dark practice brand so it doesn't glare.
    blob: practice ? 'rgba(236,236,240,0.85)' : 'rgba(255,255,255,0.92)',
  }
}

// Liquid emergence timing + geometry.
const PILL_H = 36 // glass pill height (h-9)
const GAP = 6 // resting gap between pills
const STEP = PILL_H + GAP // resting vertical stride
const CLUSTER = 7 // tiny stride while "merged" at the bar (blobs overlap -> one mass)
const GOO_MAX = 9 // stdDeviation while merged (heavy merge)
const GOO_MIN = 0.5 // stdDeviation at rest (crisp, fully separate)
const DURATION = 540 // ms, open
const DURATION_OUT = 240 // ms, close (snaps back up faster)
const PILL_W = 200 // blob + glass pill width
const TOP_OFFSET = 10 // gap below the bar before the first (Baserate) pill
const PAD_X = 16 // left/right inset inside the portal so pill SHADOWS aren't clipped
const SHADOW_BLEED = 50 // how far the clip-path lets shadows bleed past L/R/bottom

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * "Work" nav item with a LIQUID GLASS flyout. On hover/open the icon
 * crossfades to "Work" (unchanged) and a stack of glass pills emerges from the
 * bar's bottom edge like liquid: they start fused into one blob bulging out of
 * the bar, then necks stretch and pinch off into separate frosted pills as they
 * spread downward.
 *
 * HOW THE LIQUID WORKS (two layers, one clock):
 *  - A rAF-driven `progress` 0->1 (eased) is the single source of truth.
 *  - BLOB layer: near-solid white pills under an SVG gooey filter
 *    (feGaussianBlur -> feColorMatrix alpha-contrast). While progress is low the
 *    blobs sit nearly on top of each other (CLUSTER stride) and the blur is
 *    high (GOO_MAX) so they read as ONE merged mass. As progress -> 1 the stride
 *    grows to STEP and the blur drops to GOO_MIN, so they separate into crisp
 *    shapes. The blob layer fades out near the end so only glass shows at rest.
 *  - GLASS layer: the real frosted pills with text, NOT gooey-filtered, fade in
 *    on top as each blob separates.
 *  - SVG filter <defs> lives INSIDE the portal with a per-instance id (useId),
 *    so the header is never touched -> top-item hover states are unaffected.
 *
 * WHY IT DOESN'T BREAK THE HOVER (the documented flicker):
 *  - The flyout is PORTALED to <body> (its backdrop-filter blurs the real page,
 *    not the header's already-blurred layer).
 *  - Emergence is done by animating a CLIPPED wrapper that grows downward from
 *    the bar's bottom edge; the pills are positioned by `top` inside it. We do
 *    NOT translateY the pills into the trigger's hover strip - hit-testing
 *    follows transforms and the old translate poked the first pill up into the
 *    trigger, stealing hover and closing the menu.
 *  - Closing is decided by a GEOMETRIC pointermove check (inside trigger rect or
 *    portal rect +/-6px -> stay open), not pointerleave pairing, because leave
 *    events mis-pair at the portal seam. portalRef wraps the full-size fixed
 *    container so that hit region matches where the pills end up.
 */
export function WorkNavGlass({ items, brand }: { items: WorkPill[]; brand: Brand }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0) // 0 closed -> 1 fully open
  const [reduce, setReduce] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const progressRef = useRef(0)
  const rawFilterId = useId()
  const filterId = `goo-${rawFilterId.replace(/:/g, '')}` // valid in url(#...)
  const g = glassVars(brand)

  useEffect(() => setMounted(true), [])

  // Respect reduced motion: skip the goo, just fade pills in at rest positions.
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => setReduce(m.matches)
    set()
    m.addEventListener('change', set)
    return () => m.removeEventListener('change', set)
  }, [])

  // Position the flyout from the trigger (stable: the trigger doesn't animate).
  const place = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({ left: Math.round(r.left), top: Math.round(r.bottom) })
  }

  // rAF progress driver toward 0 or 1. One clock for blur + geometry + fades.
  useEffect(() => {
    if (reduce) {
      progressRef.current = open ? 1 : 0
      setProgress(open ? 1 : 0)
      return
    }
    const target = open ? 1 : 0
    const dur = open ? DURATION : DURATION_OUT
    const from = progressRef.current
    let start: number | null = null
    const tick = (ts: number) => {
      if (start === null) start = ts
      const raw = Math.min(1, (ts - start) / dur)
      const eased = easeOut(raw)
      const value = from + (target - from) * eased
      progressRef.current = value
      setProgress(value)
      if (raw < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [open, reduce])

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
    // decide by POSITION: inside trigger rect or portal rect (+/-6px) -> stay
    // open; outside both -> arm the 200ms close once (not reset per move).
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

  // Derived animation values.
  const stride = lerp(CLUSTER, STEP, progress) // px between pill tops
  const goo = lerp(GOO_MAX, GOO_MIN, progress) // current feGaussianBlur stdDev
  // The whole stack sits TOP_OFFSET below the bar; the offset itself eases in
  // (0 -> TOP_OFFSET) so the liquid still appears to start at the bar edge.
  const topOffset = TOP_OFFSET * progress
  const lastTop = topOffset + (items.length - 1) * stride
  const fullHeight = lastTop + PILL_H // visible reveal height grows with progress
  // Blob layer fades OUT as pills finish separating, so only glass shows at rest.
  const blobOpacity = progress < 0.55 ? 1 : Math.max(0, 1 - (progress - 0.55) / 0.45)
  // Glass pills fade IN once the blobs have begun to separate.
  const glassBase = Math.max(0, (progress - 0.35) / 0.65)

  const pillTop = (i: number) => Math.round(topOffset + i * stride)
  const restHeight = TOP_OFFSET + (items.length - 1) * STEP + PILL_H

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
          {/* icon <-> text asymmetric crossfade, stacked in one grid cell:
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
              // Shift left by PAD_X so the inset pills still line up under the
              // trigger; the extra width on both sides gives shadows room.
              left: (pos?.left ?? -9999) - PAD_X,
              top: pos?.top ?? -9999,
              zIndex: 60,
              // Full-size hit region (matches where the pills END UP), so the
              // geometric "stay open" check is correct throughout the anim.
              width: PILL_W + PAD_X * 2,
              height: restHeight,
              pointerEvents: open || progress > 0.01 ? 'auto' : 'none',
            }}
            aria-hidden={!open}
          >
            {/* Per-instance gooey filter - scoped to this portal only. */}
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden focusable="false">
              <defs>
                <filter
                  id={filterId}
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                  colorInterpolationFilters="sRGB"
                >
                  <feGaussianBlur in="SourceGraphic" stdDeviation={goo} result="blur" />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
                  />
                </filter>
              </defs>
            </svg>

            {/* CLIPPED emergence wrapper: grows downward from the bar's bottom
                edge so the liquid appears to bleed out of the bar. We clip ONLY
                the TOP edge (the growing reveal line) via clip-path inset; the
                left/right/bottom insets are NEGATIVE so pill SHADOWS bleed out
                freely instead of being sliced (the old `overflow:hidden` cut
                them off — that was the "weirdly cut off / odd shadows" bug).
                clip-path (not pill transforms) keeps hit-testing out of the
                trigger strip. The reveal line is the BOTTOM of the visible area;
                everything above it (toward the bar) shows as it grows. */}
            <div
              style={{
                position: 'absolute',
                left: PAD_X,
                top: 0,
                width: PILL_W,
                height: restHeight,
                // inset(top right bottom left): clip the bottom to the current
                // reveal height; bleed -SHADOW_BLEED on the other three sides.
                clipPath: reduce
                  ? `inset(${-SHADOW_BLEED}px ${-SHADOW_BLEED}px ${-SHADOW_BLEED}px ${-SHADOW_BLEED}px)`
                  : `inset(${-SHADOW_BLEED}px ${-SHADOW_BLEED}px ${Math.max(
                      0,
                      restHeight - Math.round(fullHeight * Math.min(1, progress * 1.15)),
                    )}px ${-SHADOW_BLEED}px)`,
                pointerEvents: 'none',
              }}
            >
              {/* BLOB layer - the liquid. Gooey-filtered near-solid shapes that
                  merge while clustered and pinch apart as they spread. */}
              {!reduce && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    filter: `url(#${filterId})`,
                    opacity: blobOpacity,
                    pointerEvents: 'none',
                  }}
                  aria-hidden
                >
                  {items.map((it, i) => (
                    <div
                      key={it.label}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: pillTop(i),
                        width: PILL_W,
                        height: PILL_H,
                        borderRadius: PILL_H / 2,
                        background: g.blob,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* GLASS layer - the real frosted pills with text, on top, not
                  gooey-filtered. They fade in as the blobs separate. */}
              {items.map((it, i) => {
                const appear = reduce
                  ? open
                    ? 1
                    : 0
                  : Math.max(0, Math.min(1, (glassBase - i * 0.06) / 0.5))
                return (
                  <Link
                    key={it.label}
                    href={it.href}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className="absolute flex h-9 items-center whitespace-nowrap rounded-full px-4 text-[14px] uppercase tracking-[0.06em] backdrop-blur-[14px] backdrop-saturate-150"
                    style={{
                      left: 0,
                      top: pillTop(i),
                      width: PILL_W,
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 500,
                      color: g.fg,
                      backgroundColor: g.fill,
                      border: `1px solid ${g.border}`,
                      boxShadow:
                        '0 8px 22px rgba(7,14,44,0.12), 0 2px 6px rgba(7,14,44,0.06), inset 0 1px 0 rgba(255,255,255,0.55)',
                      opacity: appear,
                      pointerEvents: open ? 'auto' : 'none',
                      transition: 'background-color 200ms, color 200ms',
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
                )
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
