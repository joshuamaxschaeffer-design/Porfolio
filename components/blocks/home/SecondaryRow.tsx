'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { secondary as defaultItems, type SecondaryItem } from './data'

export interface SecondaryRowProps {
  heading?: string
  items?: { title?: string; blurb?: string; meta?: string; href?: string }[]
}

/**
 * The lower three — Wingstop · Samsung · Capabilities. Tall (9:16) vertical
 * cards, each a grey visual slot with a white label card inset at the bottom
 * (title · role · blurb).
 *
 * - Desktop (lg+): all three fit side by side in a static row.
 * - Below lg: a horizontal rail you can drag/fling with inertia (~1.2 cards
 *   visible so the next one peeks), falling back to a plain snap-scroll rail
 *   under prefers-reduced-motion.
 *
 * Cards stay real <Link>s; dragging suppresses the click so a fling never
 * navigates by accident.
 */
export function SecondaryRow({ heading, items }: SecondaryRowProps) {
  const cards: SecondaryItem[] =
    items?.length
      ? items.map((it, i) => ({ ...defaultItems[i], ...stripEmpty(it) }))
      : defaultItems

  return (
    <section className="br-container my-20 md:my-28">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
        {heading ?? 'More work'}
      </p>

      {/* Desktop: all three fit. */}
      <div className="mt-8 hidden gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
        {cards.map((c) => (
          <Card key={c.title} card={c} />
        ))}
      </div>

      {/* Mobile / tablet: draggable inertia rail. */}
      <SwipeRail cards={cards} className="mt-8 lg:hidden" />
    </section>
  )
}

/* --- one tall card ------------------------------------------------------- */

function Card({ card }: { card: SecondaryItem }) {
  return (
    <Link href={card.href} className="group block">
      <div className="relative h-[clamp(420px,60vh,560px)] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
        {/* Visual slot watermark (placeholder until real media drops in). */}
        <span className="pointer-events-none absolute left-5 top-5 select-none font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-400">
          {card.title} — visual slot
        </span>

        {/* White label card inset at the bottom. */}
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 dark:border-neutral-700 dark:bg-neutral-950">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-xl">
              {card.title}
            </h3>
            <span className="shrink-0 text-xs text-neutral-500">{card.meta}</span>
          </div>
          <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">
            {card.blurb}
          </p>
        </div>
      </div>
    </Link>
  )
}

/* --- draggable rail (below lg) ------------------------------------------- */

function SwipeRail({ cards, className }: { cards: SecondaryItem[]; className?: string }) {
  const reduce = useReducedMotion()
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [constraint, setConstraint] = useState(0)

  useEffect(() => {
    const measure = () => {
      const vp = viewport.current?.offsetWidth ?? 0
      const tw = track.current?.scrollWidth ?? 0
      setConstraint(Math.max(0, tw - vp))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [cards.length])

  // ~1.2 cards visible so the next one peeks; capped so tablet cards stay
  // portrait-sized rather than stretching to 60vw.
  const cardW = 'w-[74vw] max-w-[300px] sm:w-[46vw]'

  if (reduce) {
    return (
      <div
        className={`-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 br-noscrollbar ${className ?? ''}`}
      >
        {cards.map((c) => (
          <div key={c.title} className={`${cardW} shrink-0 snap-start`}>
            <Card card={c} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={viewport} className={`-mx-6 overflow-hidden px-6 ${className ?? ''}`}>
      <motion.div
        ref={track}
        className="flex w-max cursor-grab gap-4 pb-2 active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -constraint, right: 0 }}
        dragElastic={0.12}
        dragTransition={{ power: 0.3, timeConstant: 350, bounceStiffness: 300, bounceDamping: 40 }}
      >
        {cards.map((c) => (
          <DragCard key={c.title} card={c} cardW={cardW} />
        ))}
      </motion.div>
    </div>
  )
}

/**
 * A rail card that distinguishes a tap from a drag: if the pointer moved more
 * than a few px between down and up, the click is suppressed so flinging the
 * rail never navigates.
 */
function DragCard({ card, cardW }: { card: SecondaryItem; cardW: string }) {
  const start = useRef<{ x: number; y: number } | null>(null)
  const moved = useRef(false)

  return (
    <div
      className={`${cardW} shrink-0`}
      onPointerDownCapture={(e) => {
        start.current = { x: e.clientX, y: e.clientY }
        moved.current = false
      }}
      onPointerMoveCapture={(e) => {
        if (!start.current) return
        if (Math.abs(e.clientX - start.current.x) > 6) moved.current = true
      }}
      onClickCapture={(e) => {
        if (moved.current) {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
    >
      <Card card={card} />
    </div>
  )
}

/* --- helpers ------------------------------------------------------------- */

// Strip undefined / null / '' so blank CMS fields fall back to defaults
// (Payload returns null for unset optional fields; a null href would crash
// Next's <Link> url formatter at render).
function stripEmpty<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as Partial<T>
}
