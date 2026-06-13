'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
    // Near-solid fill for the gooey BLOB layer (the liquid).
    blob: practice ? 'rgba(236,236,240,0.85)' : 'rgba(255,255,255,0.92)',
  }
}

const SHADOW_REST =
  '0 8px 22px rgba(7,14,44,0.12), 0 2px 6px rgba(7,14,44,0.06), inset 0 1px 0 rgba(255,255,255,0.55)'
const SHADOW_HOVER =
  '0 12px 30px rgba(7,14,44,0.18), 0 3px 8px rgba(7,14,44,0.08), inset 0 1px 0 rgba(255,255,255,0.6)'

// Liquid emergence timing + geometry.
const PILL_H = 36 // glass pill height (h-9)
const GAP = 6 // resting gap between pills
const STEP = PILL_H + GAP // resting vertical stride
const CLUSTER = 7 // tiny stride while "merged" at the bar (blobs overlap -> one mass)
const GOO_MAX = 9 // stdDeviation while merged (heavy merge)
const GOO_MIN = 0.5 // stdDeviation at rest (crisp, fully separate)
const DURATION = 460 // ms, open
const DURATION_OUT = 200 // ms, close (snaps back up faster)
const PILL_W = 200 // blob + glass pill width
const TOP_OFFSET = 10 // gap below the bar before the first (Baserate) pill
const PAD_X = 16 // left/right inset inside the portal so pill SHADOWS aren't clipped
const SHADOW_BLEED = 50 // canvas below the last pill for its shadow

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * "Work" nav item with a LIQUID GLASS flyout. On hover/open the pills emerge
 * from the bar's bottom edge like liquid: fused into one gooey blob, then they
 * pinch off into separate frosted pills as they spread down.
 *
 * PERFORMANCE (why this is ref-driven, not React state):
 *  The animation is driven by a single rAF loop that writes styles DIRECTLY to
 *  DOM nodes (stdDeviation on the filter, the blob mask + opacity, each pill's
 *  top + opacity). It does NOT call setState per frame — re-rendering React +
 *  re-deriving the tree 60x/sec while an SVG gooey filter re-rasterizes the
 *  backdrop was what made the menu feel slow and delayed clicks. Now React only
 *  renders on open/close (twice), and the per-frame work is plain style writes
 *  the compositor can handle. The gooey blob layer is also `contain:strict` +
 *  `isolation:isolate` so its filter repaint stays inside the flyout instead of
 *  invalidating the whole page.
 *
 * NEVER CLIP THE GLASS: a clip-path / overflow:hidden on an ancestor silently
 *  disables backdrop-filter on descendants (pills went transparent). The reveal
 *  is a MASK on the blob layer only (masks don't break backdrop-filter; the
 *  blob has none anyway). Glass pills are never clipped.
 *
 * HOVER STABILITY: flyout portaled to <body>; closing decided by a geometric
 *  pointermove check (cursor inside trigger rect ∪ portal rect ±6px → stay
 *  open), never pointerleave pairing (mis-pairs at the portal seam).
 */
export function WorkNavGlass({ items, brand }: { items: WorkPill[]; brand: Brand }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [reduce, setReduce] = useState(false)
  // `active` = the flyout DOM should exist (open, or still animating closed).
  // When false the entire flyout (incl. its backdrop-filter pills + the gooey
  // SVG filter) is UNMOUNTED — so a closed menu costs nothing and can't leave a
  // blurred blob artifact under the bar.
  const [active, setActive] = useState(false)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const triggerLabelRef = useRef<HTMLSpanElement>(null)
  const triggerIconRef = useRef<HTMLSpanElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)
  const blobLayerRef = useRef<HTMLDivElement>(null)
  const blobRefs = useRef<(HTMLDivElement | null)[]>([])
  const pillRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const gooRef = useRef<SVGFEGaussianBlurElement>(null)

  const closeTimer = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const progressRef = useRef(0)
  const hoveredRef = useRef<number | null>(null) // which pill is hover-grown

  const rawFilterId = useId()
  const filterId = `goo-${rawFilterId.replace(/:/g, '')}`
  const g = glassVars(brand)
  const restHeight = TOP_OFFSET + (items.length - 1) * STEP + PILL_H

  useEffect(() => setMounted(true), [])

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

  /** Write all animated styles for a given progress (0..1) straight to the DOM.
   *  No React state — this runs every rAF frame cheaply. */
  const paint = (p: number) => {
    const stride = lerp(CLUSTER, STEP, p)
    const topOffset = TOP_OFFSET * p
    const lastTop = topOffset + (items.length - 1) * stride
    const fullHeight = lastTop + PILL_H
    const revealHeight = Math.round((fullHeight + SHADOW_BLEED) * Math.min(1, p * 1.15))
    // Blob is invisible at rest-closed (p≈0), full while merged, fades out as
    // pills separate. The `p < 0.04` guard kills the 1px mask sliver that
    // otherwise shows as a blurred lump under the bar when closed.
    const blobOpacity = p < 0.04 ? 0 : p < 0.55 ? 1 : Math.max(0, 1 - (p - 0.55) / 0.45)
    const glassBase = Math.max(0, (p - 0.35) / 0.65)
    const pillTop = (i: number) => Math.round(topOffset + i * stride)

    // gooey blur strength
    if (gooRef.current) gooRef.current.setAttribute('stdDeviation', String(lerp(GOO_MAX, GOO_MIN, p)))

    // blob layer: opacity + reveal mask
    const bl = blobLayerRef.current
    if (bl) {
      bl.style.opacity = String(blobOpacity)
      const mask = `linear-gradient(to bottom, #000 0, #000 ${revealHeight}px, transparent ${revealHeight + 14}px)`
      bl.style.maskImage = mask
      bl.style.webkitMaskImage = mask
    }
    // blob shapes: vertical position
    blobRefs.current.forEach((el, i) => {
      if (el) el.style.top = `${pillTop(i)}px`
    })
    // glass pills: position + fade-in (skip transform — that's hover-owned)
    pillRefs.current.forEach((el, i) => {
      if (!el) return
      el.style.top = `${pillTop(i)}px`
      const appear = Math.max(0, Math.min(1, (glassBase - i * 0.06) / 0.5))
      el.style.opacity = String(appear)
      el.style.pointerEvents = p > 0.5 ? 'auto' : 'none'
    })

    // portal hit-region interactivity
    if (portalRef.current) {
      portalRef.current.style.pointerEvents = p > 0.01 ? 'auto' : 'none'
    }
  }

  // rAF driver: animate progress toward target, painting DOM each frame.
  const animateTo = (target: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (reduce) {
      progressRef.current = target
      paint(target)
      return
    }
    const from = progressRef.current
    const dur = target > from ? DURATION : DURATION_OUT
    let start: number | null = null
    const tick = (ts: number) => {
      if (start === null) start = ts
      const raw = Math.min(1, (ts - start) / dur)
      const eased = easeOut(raw)
      progressRef.current = from + (target - from) * eased
      paint(progressRef.current)
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else if (target === 0) {
        // Close finished → unmount the flyout entirely (no idle backdrop-filter
        // / SVG filter cost, no artifact).
        setActive(false)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  // Opening must MOUNT the flyout first (so refs exist), then animate.
  useEffect(() => {
    if (open) {
      place()
      setActive(true)
    }
    // closing is handled by animateTo → setActive(false) at the end
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Run the animation once the flyout is mounted (active) or on close.
  useEffect(() => {
    if (!mounted) return
    if (active || !open) animateTo(open ? 1 : 0)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active, mounted, reduce])

  // Crossfade the trigger glyph (icon <-> "Work") via refs, no re-render needed.
  useEffect(() => {
    const icon = triggerIconRef.current
    const label = triggerLabelRef.current
    if (icon) {
      icon.style.opacity = open ? '0' : '1'
      icon.style.transition = open ? 'opacity 100ms' : 'opacity 600ms 75ms'
    }
    if (label) {
      label.style.opacity = open ? '1' : '0'
      label.style.transition = open ? 'opacity 600ms 75ms' : 'opacity 100ms'
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    place()
    const onMove = () => place()
    window.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('resize', onMove)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)

    // GEOMETRIC containment (not pointerleave pairing — mis-pairs at the seam).
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

  // Click a pill: navigate IMMEDIATELY (don't wait on the close animation), then
  // let the menu close in the background. router.push + default Link prefetch
  // make this feel instant.
  const goTo = (href: string) => (e: React.MouseEvent) => {
    // allow modifier-clicks / middle-click to use the browser's native behavior
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e as any).button === 1) return
    e.preventDefault()
    router.push(href)
    setOpen(false)
  }

  return (
    <div className="flex h-full items-center" onPointerEnter={(e) => notTouch(e) && show()}>
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
          className="grid h-9 w-full place-items-center"
          style={{
            color: open ? g.fgHover : g.fg,
            transition: 'color 250ms',
          }}
        >
          <span
            ref={triggerIconRef}
            className="col-start-1 row-start-1 grid place-items-center [&>svg]:block"
            style={{ opacity: 1 }}
          >
            <WorkIcon />
          </span>
          <span
            ref={triggerLabelRef}
            className="col-start-1 row-start-1 whitespace-nowrap text-[13px] uppercase tracking-[0.08em]"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, opacity: 0 }}
          >
            Work
          </span>
        </span>
      </button>

      {mounted &&
        active &&
        createPortal(
          <div
            ref={portalRef}
            onPointerEnter={(e) => notTouch(e) && show()}
            style={{
              position: 'fixed',
              left: (pos?.left ?? -9999) - PAD_X,
              top: pos?.top ?? -9999,
              zIndex: 60,
              width: PILL_W + PAD_X * 2,
              height: restHeight,
              pointerEvents: 'none',
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
                  <feGaussianBlur ref={gooRef} in="SourceGraphic" stdDeviation={GOO_MIN} result="blur" />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
                  />
                </filter>
              </defs>
            </svg>

            {/* Positioning wrapper. NO clip-path / overflow (would kill the
                pills' backdrop-filter). */}
            <div
              style={{
                position: 'absolute',
                left: PAD_X,
                top: 0,
                width: PILL_W,
                height: restHeight + SHADOW_BLEED,
                pointerEvents: 'none',
              }}
            >
              {/* BLOB layer - the liquid. contain+isolate so the gooey filter's
                  repaint stays local (perf). Masked reveal grows downward. */}
              {!reduce && (
                <div
                  ref={blobLayerRef}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    filter: `url(#${filterId})`,
                    opacity: 0,
                    pointerEvents: 'none',
                    isolation: 'isolate',
                    // layout+paint containment isolates the gooey filter's
                    // repaint to this box WITHOUT size containment (size would
                    // collapse the inset:0 box to 0x0).
                    contain: 'layout paint',
                  }}
                  aria-hidden
                >
                  {items.map((it, i) => (
                    <div
                      key={it.label}
                      ref={(el) => {
                        blobRefs.current[i] = el
                      }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: PILL_W,
                        height: PILL_H,
                        borderRadius: PILL_H / 2,
                        background: g.blob,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* GLASS layer - real frosted pills, never clipped/masked. */}
              {items.map((it, i) => (
                <Link
                  key={it.label}
                  href={it.href}
                  prefetch
                  tabIndex={open ? 0 : -1}
                  onClick={goTo(it.href)}
                  ref={(el) => {
                    pillRefs.current[i] = el
                  }}
                  className="absolute flex h-9 items-center whitespace-nowrap rounded-full px-4 text-[14px] uppercase tracking-[0.06em] backdrop-blur-[14px] backdrop-saturate-150"
                  style={{
                    left: 0,
                    top: 0,
                    width: PILL_W,
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 500,
                    color: g.fg,
                    backgroundColor: g.fill,
                    border: `1px solid ${g.border}`,
                    boxShadow: SHADOW_REST,
                    opacity: 0,
                    pointerEvents: 'none',
                    transform: 'scale(1)',
                    transformOrigin: 'center',
                    transition:
                      'background-color 200ms, color 200ms, transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = g.fillHover
                    e.currentTarget.style.color = g.fgHover
                    e.currentTarget.style.transform = 'scale(1.045)'
                    e.currentTarget.style.boxShadow = SHADOW_HOVER
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = g.fill
                    e.currentTarget.style.color = g.fg
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = SHADOW_REST
                  }}
                >
                  {it.label}
                </Link>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
