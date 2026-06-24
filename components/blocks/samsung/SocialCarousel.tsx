'use client'

import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { socialItems, type SocialItem } from './data'

/**
 * SocialCarousel — a draggable, bento-style horizontal gallery of the Samsung
 * social mockups. DRAG / SWIPE ONLY with inertial momentum (per Joshua,
 * 2026-06-19 round 4 — it must NOT move on page scroll). Built on Motion's
 * `drag="x"` + dragTransition inertia, matching the physics of the other case
 * studies' carousels (shared DragGallery). Elastic ends, fling-to-coast.
 *
 * Full-bleed: the rail's first tile aligns with the page container on the left
 * (via padding) but the track runs edge-to-edge so it bleeds off-screen and is
 * dragged into view — it can never clip awkwardly on the right. Arrow buttons
 * animate the x motion value. No rounded corners.
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

/** Column layout — left → right reading order of the mosaic. 10 square tiles. */
const COLUMNS: Cell[] = [
  { kind: 'feature', item: 'gold3' },
  { kind: 'stack', top: 'gold', bottom: 'gold2' },
  { kind: 'stack', top: 'gear-s-front', bottom: 'gear-s-angle' },
  { kind: 'feature', item: 'men-fashion' },
  { kind: 'stack', top: 'att-note3', bottom: 'bestbuy-holiday' },
  { kind: 'feature', item: 'galaxy-tab-s' },
  { kind: 'feature', item: 's5-white-camera' },
]

export function SocialCarousel() {
  const reduce = useReducedMotion()
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  // Drag bounds come from Motion measuring the viewport ref live (robust
  // against the Lenis/reveal layout-timing that made a measured-once constraint
  // read 0). Arrow nudges also measure live on click.
  const nudge = (dir: 1 | -1) => {
    // measure live so a stale/0 constraint can never freeze the controls
    const vp = viewport.current?.offsetWidth ?? 0
    const tw = track.current?.scrollWidth ?? 0
    const max = Math.max(0, tw - vp)
    const next = Math.max(-max, Math.min(0, x.get() - dir * vp * 0.7))
    animate(x, next, { type: 'spring', stiffness: 200, damping: 36 })
  }

  // Reduced motion → a plain horizontal scroller (no drag physics).
  if (reduce) {
    return (
      <div className="select-none">
        <div className="sg-social-track no-scrollbar overflow-x-auto overflow-y-hidden">
          <div className="sg-social-grid">
            {COLUMNS.map((col, i) => (
              <Column key={i} col={col} />
            ))}
          </div>
        </div>
        <ControlsRow canLeft={false} canRight={false} onLeft={() => {}} onRight={() => {}} />
        <CarouselStyles />
      </div>
    )
  }

  return (
    <div className="select-none">
      <div ref={viewport} className="sg-social-track overflow-hidden">
        <motion.div
          ref={track}
          className="sg-social-grid cursor-grab active:cursor-grabbing"
          // touchAction: pan-y set explicitly (not just relying on Motion's
          // auto-injection for drag="x") so a finger's horizontal pan is always
          // handed to Motion's drag and never claimed by the browser/page —
          // robust against CSS-layer ordering overriding Motion's inline style.
          style={{ x, touchAction: 'pan-y' }}
          drag="x"
          dragConstraints={viewport}
          dragElastic={0.12}
          dragTransition={{ power: 0.32, timeConstant: 360, bounceStiffness: 300, bounceDamping: 40 }}
        >
          {COLUMNS.map((col, i) => (
            <Column key={i} col={col} />
          ))}
        </motion.div>
      </div>
      <ControlsRow
        canLeft
        canRight
        onLeft={() => nudge(-1)}
        onRight={() => nudge(1)}
      />
      <CarouselStyles />
    </div>
  )
}

function ControlsRow({
  canLeft,
  canRight,
  onLeft,
  onRight,
}: {
  canLeft: boolean
  canRight: boolean
  onLeft: () => void
  onRight: () => void
}) {
  return (
    <div
      className="mt-5 flex items-center justify-between"
      style={{
        paddingLeft: 'max(24px, calc((100vw - 1443px) / 2 + 80px))',
        paddingRight: 'max(24px, calc((100vw - 1443px) / 2 + 80px))',
      }}
    >
      <div />
      <div className="hidden gap-2 sm:flex">
        <CarouselButton dir={-1} disabled={!canLeft} onClick={onLeft} />
        <CarouselButton dir={1} disabled={!canRight} onClick={onRight} />
      </div>
    </div>
  )
}

function CarouselStyles() {
  return (
    <style>{`
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      .sg-social-track {
        --sg-h: 690px;
        --sg-gap: 28px;
        --sg-sq: calc((var(--sg-h) - var(--sg-gap)) / 2);
        padding-bottom: 2px;
      }
      @media (max-width: 1023px) { .sg-social-track { --sg-h: 540px; } }
      @media (max-width: 639px)  { .sg-social-track { --sg-h: 420px; --sg-gap: 18px; } }
      .sg-social-grid {
        display: flex;
        flex-direction: row;
        gap: var(--sg-gap);
        width: max-content;
        height: var(--sg-h);
        padding-left: max(24px, calc((100vw - 1443px) / 2 + 80px));
        padding-right: max(24px, calc((100vw - 1443px) / 2 + 80px));
      }
      .sg-social-col { display: flex; flex-direction: column; align-items: flex-start; gap: var(--sg-gap); height: var(--sg-h); }
      .sg-tile-feature { height: var(--sg-h); width: var(--sg-h); }
      .sg-tile-square  { height: var(--sg-sq); width: var(--sg-sq); }
      .sg-social-grid img { -webkit-user-drag: none; }
    `}</style>
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

/** A single image tile. Sharp corners. */
function Tile({ item, aspect }: { item: SocialItem; aspect: 'square' | 'feature' }) {
  const cls = aspect === 'feature' ? 'sg-tile-feature' : 'sg-tile-square'
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
        className="pointer-events-none h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
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
      className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/[0.04] text-white/80 transition-[opacity,background,border-color] duration-200 hover:border-[var(--sg-blue)] hover:text-[var(--sg-blue)] disabled:cursor-default disabled:opacity-25"
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
