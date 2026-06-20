'use client'

import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

/**
 * DragGrid — a draggable, arrow-controlled horizontal mosaic, carrying the same
 * signature as the Samsung SocialCarousel: Motion `drag="x"` with inertial
 * momentum, live-measured bounds, arrow nudge buttons, and a bento-ish row of
 * tiles. Used for the Wingstop CRM-animated grid and the Additional-Web grid so
 * they match "a grid carousel like Samsung" rather than a plain scroll strip.
 *
 * `tone` flips arrow styling for dark vs light sections. Tiles are square by
 * default; pass `aspect` to change.
 */
export function DragGrid({
  items,
  tone = 'light',
  aspect = 'aspect-square',
  tileClass = '',
}: {
  items: { src: string; label?: string }[]
  tone?: 'light' | 'dark'
  aspect?: string
  tileClass?: string
}) {
  const reduce = useReducedMotion()
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  const nudge = (dir: 1 | -1) => {
    const vp = viewport.current?.offsetWidth ?? 0
    const tw = track.current?.scrollWidth ?? 0
    const max = Math.max(0, tw - vp)
    const next = Math.max(-max, Math.min(0, x.get() - dir * vp * 0.7))
    animate(x, next, { type: 'spring', stiffness: 200, damping: 36 })
  }

  const Tile = ({ it }: { it: { src: string; label?: string } }) => (
    <figure className={`w-[260px] shrink-0 sm:w-[300px] ${tileClass}`}>
      <div
        className={`${aspect} overflow-hidden rounded-2xl ${
          tone === 'dark' ? 'border border-white/12 bg-white/[0.04]' : 'border border-[var(--br-line)] bg-[var(--br-bg-2)]'
        } [box-shadow:0_18px_40px_rgba(0,0,0,0.18)]`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={it.src} alt={it.label ?? ''} loading="lazy" className="h-full w-full object-cover" draggable={false} />
      </div>
      {it.label && (
        <figcaption
          className={`br-data mt-3 text-[13px] uppercase tracking-[0.1em] ${tone === 'dark' ? 'text-white/55' : 'text-[var(--br-muted-2)]'}`}
        >
          {it.label}
        </figcaption>
      )}
    </figure>
  )

  if (reduce) {
    return (
      <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-4 md:-mx-20 md:px-20 [scrollbar-width:thin]">
        {items.map((it) => (
          <Tile key={it.src} it={it} />
        ))}
      </div>
    )
  }

  const arrowBase =
    tone === 'dark'
      ? 'border-white/25 text-white/80 hover:border-white/60 hover:text-white'
      : 'border-[var(--br-line)] text-[var(--br-muted)] hover:border-[var(--br-muted-2)] hover:text-[var(--br-ink)]'

  return (
    <div className="relative">
      <div ref={viewport} className="overflow-hidden">
        <motion.div
          ref={track}
          className="flex cursor-grab gap-4 pb-1 active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={viewport}
          dragElastic={0.06}
          dragTransition={{ power: 0.3, timeConstant: 320, bounceStiffness: 240, bounceDamping: 36 }}
        >
          {items.map((it) => (
            <Tile key={it.src} it={it} />
          ))}
        </motion.div>
      </div>
      {/* arrow controls */}
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => nudge(-1)}
          className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${arrowBase}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => nudge(1)}
          className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${arrowBase}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
