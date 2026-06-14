'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export interface GalleryCard {
  title?: string
  meta?: string
  src?: string
  accent?: string
}

/**
 * DragGallery — a horizontally draggable rail of cards with inertia/momentum
 * and elastic ends (motion drag constraints). Grab and fling; it coasts and
 * settles. The tactile "explore the work" rail on modern portfolios. Falls back
 * to a normal horizontal-scroll rail under reduced-motion.
 */
export function DragGallery({ cards, className }: { cards: GalleryCard[]; className?: string }) {
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
    return () => ro.disconnect()
  }, [cards.length])

  if (reduce) {
    return (
      <div className={`flex snap-x gap-4 overflow-x-auto pb-3 ${className ?? ''}`}>
        {cards.map((c, i) => <Card key={i} card={c} />)}
      </div>
    )
  }

  return (
    <div ref={viewport} className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        ref={track}
        className="flex w-max cursor-grab gap-4 active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -constraint, right: 0 }}
        dragElastic={0.12}
        dragTransition={{ power: 0.3, timeConstant: 350, bounceStiffness: 300, bounceDamping: 40 }}
      >
        {cards.map((c, i) => <Card key={i} card={c} />)}
      </motion.div>
    </div>
  )
}

function Card({ card }: { card: GalleryCard }) {
  return (
    <div className="w-[78vw] shrink-0 select-none sm:w-[420px]">
      <div
        className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)]"
        style={{ aspectRatio: '4 / 3' }}
      >
        {card.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.src} alt={card.title ?? ''} draggable={false} className="pointer-events-none h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-end p-6" style={{ background: `linear-gradient(140deg, ${card.accent ?? 'var(--br-pill)'} 0%, #ffffff 135%)` }}>
            <span className="br-data text-[12px] uppercase tracking-[0.12em] text-[var(--br-muted)]">{card.meta}</span>
          </div>
        )}
      </div>
      {card.title ? (
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-[17px] font-medium text-[var(--br-ink)]">{card.title}</span>
          {card.meta ? <span className="br-data text-[12px] uppercase tracking-[0.1em] text-[var(--br-muted)]">{card.meta}</span> : null}
        </div>
      ) : null}
    </div>
  )
}
