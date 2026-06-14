'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

export interface StackCard {
  eyebrow?: string
  title: string
  body?: string
  /** optional accent for the card's left rule + eyebrow */
  accent?: string
}

/**
 * StickyStackCards — full-width cards that each pin to the viewport, then scale
 * down and recede as the next card slides up over the top, leaving a tidy
 * stacked "deck" at the end. One of the most-used premium scroll patterns of
 * 2025–26. Great for a 3–5 item values / services / phases list.
 *
 * Each card is `position: sticky` with an incrementing top offset; a scroll-
 * linked scale shrinks the outgoing card. Reduced-motion → a plain stacked list.
 */
export function StickyStackCards({
  cards,
  className,
  topBase = 96,
  topStep = 16,
}: {
  cards: StackCard[]
  className?: string
  /** sticky top offset (px) for the first card; clears the glass nav */
  topBase?: number
  /** extra px each subsequent card is offset, so their tops fan out */
  topStep?: number
}) {
  return (
    <div className={className}>
      {cards.map((card, i) => (
        <StackItem
          key={i}
          card={card}
          index={i}
          total={cards.length}
          top={topBase + i * topStep}
        />
      ))}
    </div>
  )
}

function StackItem({ card, index, total, top }: { card: StackCard; index: number; total: number; top: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // outgoing cards shrink toward the end of their pass; the last card stays full.
  const targetScale = index === total - 1 ? 1 : 1 - (total - index) * 0.035
  const scale = useTransform(scrollYProgress, [0.5, 1], [1, targetScale])
  const accent = card.accent ?? 'var(--br-gold)'

  return (
    <div ref={ref} className="sticky" style={{ top: reduce ? undefined : top, marginBottom: index === total - 1 ? 0 : 24 }}>
      <motion.div
        style={{ scale: reduce ? 1 : scale, transformOrigin: 'top center' }}
        className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-white p-7 shadow-[var(--br-card-shadow)] md:p-12"
      >
        <div className="border-l-[3px] pl-5 md:pl-7" style={{ borderColor: accent }}>
          {card.eyebrow ? (
            <p className="br-data text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
              {card.eyebrow}
            </p>
          ) : null}
          <h3 className="mt-2 text-[26px] font-medium leading-tight tracking-[-0.01em] text-[var(--br-ink)] md:text-[40px]">
            {card.title}
          </h3>
          {card.body ? (
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--br-muted)] md:text-lg">
              {card.body}
            </p>
          ) : null}
        </div>
      </motion.div>
    </div>
  )
}
