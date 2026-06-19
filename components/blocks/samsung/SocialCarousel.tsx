'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { socialItems, type SocialItem } from './data'

/**
 * SocialCarousel — a draggable, bento-style horizontal gallery of the Samsung
 * social mockups (per Joshua, 2026-06-19: hundreds shipped; this is a curated
 * sample). Inspired by the original Behance scroll layout but built for the
 * web: a varied mosaic of square + wide tiles in a fixed-height, horizontally
 * scrolling track the visitor can drag/swipe through with pointer-drag +
 * inertial momentum (or wheel / trackpad / arrow keys).
 *
 * The track is the native scroll container (so trackpad + keyboard + a11y
 * "just work"); a pointer handler layers click-drag with a velocity flywheel
 * on release. Only scrollLeft changes during a drag (no layout thrash); images
 * are pre-optimized WebP with width/height set to reserve space. Reduced-motion
 * disables the glide (drag still works).
 */

const P = '/samsung/social'

type Cell =
  | { kind: 'stack'; top: string; bottom: string }
  | { kind: 'feature'; item: string }

function bySlug(slug: string): SocialItem {
  const it = socialItems.find((s) => s.slug === slug)
  if (!it) throw new Error(`SocialCarousel: unknown slug "${slug}"`)
  return it
}

/** Column layout — left → right reading order of the mosaic. 10 square tiles
 *  (the wide Gear banner was removed per Joshua, 2026-06-19 — uniform tiles). */
const COLUMNS: Cell[] = [
  { kind: 'feature', item: 'gold3' }, // hero: S5 carrier lineup
  { kind: 'stack', top: 'gold', bottom: 'gold2' }, // S5 finishes + macro
  { kind: 'stack', top: 'gear-s-front', bottom: 'gear-s-angle' }, // Gear S pair
  { kind: 'feature', item: 'men-fashion' }, // Note lifestyle in-hand
  { kind: 'stack', top: 'att-note3', bottom: 'bestbuy-holiday' }, // retail co-ops
  { kind: 'feature', item: 'galaxy-tab-s' }, // Tab S
  { kind: 'feature', item: 's5-white-camera' }, // S5 camera macro
]

export function SocialCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [dragging, setDragging] = useState(false)

  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    moved: false,
    pointerId: -1,
  })
  const momentum = useRef<number | null>(null)
  const reduceMotion = useRef(false)

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const updateArrows = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    updateArrows()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows])

  const stopMomentum = () => {
    if (momentum.current != null) {
      cancelAnimationFrame(momentum.current)
      momentum.current = null
    }
  }

  const startMomentum = () => {
    if (reduceMotion.current) return
    const el = trackRef.current
    if (!el) return
    let v = drag.current.velocity // px per ms
    if (Math.abs(v) < 0.02) return
    const step = () => {
      v *= 0.95 // friction
      el.scrollLeft -= v * 16
      const max = el.scrollWidth - el.clientWidth
      if (Math.abs(v) > 0.02 && el.scrollLeft > 0 && el.scrollLeft < max) {
        momentum.current = requestAnimationFrame(step)
      } else {
        momentum.current = null
      }
    }
    momentum.current = requestAnimationFrame(step)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    const el = trackRef.current
    if (!el) return
    stopMomentum()
    const d = drag.current
    d.active = true
    d.moved = false
    d.startX = e.clientX
    d.startScroll = el.scrollLeft
    d.lastX = e.clientX
    d.lastT = performance.now()
    d.velocity = 0
    d.pointerId = e.pointerId
    el.setPointerCapture?.(e.pointerId)
    setDragging(true)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d.active) return
    const el = trackRef.current
    if (!el) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 3) d.moved = true
    el.scrollLeft = d.startScroll - dx
    const now = performance.now()
    const dt = now - d.lastT
    if (dt > 0) {
      const instV = (e.clientX - d.lastX) / dt
      d.velocity = 0.8 * instV + 0.2 * d.velocity
    }
    d.lastX = e.clientX
    d.lastT = now
  }

  const endDrag = () => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    trackRef.current?.releasePointerCapture?.(d.pointerId)
    setDragging(false)
    startMomentum()
  }

  // Mouse-wheel → horizontal scroll (trackpads already send deltaX).
  const onWheel = (e: React.WheelEvent) => {
    const el = trackRef.current
    if (!el) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const max = el.scrollWidth - el.clientWidth
      if ((e.deltaY < 0 && el.scrollLeft > 0) || (e.deltaY > 0 && el.scrollLeft < max)) {
        el.scrollLeft += e.deltaY
        e.preventDefault()
      }
    }
  }

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    stopMomentum()
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <div className="select-none">
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        className="sg-social-track no-scrollbar overflow-x-auto overflow-y-hidden"
        style={{
          cursor: dragging ? 'grabbing' : 'grab',
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.stopPropagation()
            e.preventDefault()
          }
        }}
        role="region"
        aria-label="Samsung social media mockups — drag to explore"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            nudge(1)
            e.preventDefault()
          } else if (e.key === 'ArrowLeft') {
            nudge(-1)
            e.preventDefault()
          }
        }}
      >
        <div className="sg-social-grid">
          {COLUMNS.map((col, i) => (
            <Column key={i} col={col} />
          ))}
        </div>
      </div>

      <div
        className="mt-5 flex items-center justify-between"
        style={{
          paddingLeft: 'max(24px, calc((100vw - 1443px) / 2 + 80px))',
          paddingRight: 'max(24px, calc((100vw - 1443px) / 2 + 80px))',
        }}
      >
        <p className="br-data text-[11px] uppercase tracking-[0.14em] text-[var(--br-muted-2)]">
          Drag, swipe, or scroll → · a sample of the social mockups
        </p>
        <div className="hidden gap-2 sm:flex">
          <CarouselButton dir={-1} disabled={!canLeft} onClick={() => nudge(-1)} />
          <CarouselButton dir={1} disabled={!canRight} onClick={() => nudge(1)} />
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        /* Fixed-height bento track. --sg-h is the full track height (a feature
           tile); --sg-sq is one square in a stacked pair (half height minus the
           gap). Heights are explicit so aspect-ratio derives WIDTH (no circular
           h-full ↔ aspect-ratio feedback). */
        .sg-social-track {
          --sg-h: 690px;
          --sg-gap: 20px;
          --sg-sq: calc((var(--sg-h) - var(--sg-gap)) / 2);
          padding-bottom: 2px;
        }
        @media (max-width: 1023px) { .sg-social-track { --sg-h: 540px; } }
        @media (max-width: 639px)  { .sg-social-track { --sg-h: 420px; --sg-gap: 14px; } }
        .sg-social-grid {
          display: flex;
          flex-direction: row;
          gap: var(--sg-gap);
          width: max-content;
          height: var(--sg-h);
          /* left gutter aligns the first tile with the page container; right
             pad lets the last tile breathe past the edge (full-bleed rail).
             Matches br-container: max-w 1443 + 80px gutter on wide screens. */
          padding-left: max(24px, calc((100vw - 1443px) / 2 + 80px));
          padding-right: max(24px, calc((100vw - 1443px) / 2 + 80px));
        }
        .sg-social-col { display: flex; flex-direction: column; align-items: flex-start; gap: var(--sg-gap); height: var(--sg-h); }
        /* Explicit height AND width (both derived from --sg-h) so layout never
           depends on aspect-ratio resolving inside a flex column — that proved
           flaky (width computed as auto). Squares: w = h. Wide banner keeps the
           1327:370 ratio. */
        .sg-tile-feature { height: var(--sg-h); width: var(--sg-h); }
        /* wide banner sits at HALF height as a strip (true 1327:370 ratio,
           uncropped) so it doesn't dominate the mosaic; stacked alone. */
        .sg-tile-wide    { height: var(--sg-sq); width: calc(var(--sg-sq) * 1327 / 370); }
        .sg-tile-square  { height: var(--sg-sq); width: var(--sg-sq); }
        .sg-social-grid img { -webkit-user-drag: none; }
      `}</style>
    </div>
  )
}

/** One mosaic column. */
function Column({ col }: { col: Cell }) {
  if (col.kind === 'stack') {
    return (
      <div className="sg-social-col">
        <Tile item={bySlug(col.top)} aspect="square" />
        <Tile item={bySlug(col.bottom)} aspect="square" />
      </div>
    )
  }
  return (
    <div className="sg-social-col">
      <Tile item={bySlug(col.item)} aspect="feature" />
    </div>
  )
}

/** A single image tile. Height comes from the grid row; width follows the
 *  intrinsic aspect so squares stay square and the banner stays wide. */
function Tile({ item, aspect }: { item: SocialItem; aspect: 'square' | 'feature' | 'wide' }) {
  const cls =
    aspect === 'wide' ? 'sg-tile-wide' : aspect === 'feature' ? 'sg-tile-feature' : 'sg-tile-square'
  return (
    <figure
      className={`group relative ${cls} shrink-0 overflow-hidden bg-[#0c0e13] [box-shadow:0_1px_2px_rgba(0,0,0,0.12),0_18px_40px_-22px_rgba(8,12,24,0.45)]`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${P}/${item.file}`}
        alt={item.alt}
        width={item.w}
        height={item.h}
        draggable={false}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-3.5 pb-3 pt-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="br-data text-[11px] uppercase tracking-[0.1em] text-white/90">
          {item.caption}
        </span>
      </figcaption>
    </figure>
  )
}

function CarouselButton({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? 'Next' : 'Previous'}
      className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/[0.04] text-white/80 transition-[opacity,background,border-color] duration-200 hover:border-[var(--sg-blue)] hover:text-[var(--sg-blue)] disabled:cursor-default disabled:opacity-25 disabled:hover:border-white/20 disabled:hover:text-white/80"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d={dir === 1 ? 'M6 3l5 5-5 5' : 'M10 3L5 8l5 5'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
