'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { timeline } from './data'

/**
 * Animated vertical timeline — line + dots on the left.
 *
 * A single rail runs down the left; a gold "progress" line draws over it as the
 * section scrolls through the viewport (scroll-linked, Linear-style). Each entry
 * fades/slides in and its dot fills as it enters view. Respects
 * prefers-reduced-motion: with motion off it renders as a clean static list
 * (line fully drawn, dots filled, no transforms).
 *
 * Matches the repo motion convention (components/animation/Reveal.tsx):
 * 'use client', motion/react, useReducedMotion.
 */
export function Timeline() {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLOListElement>(null)

  // Progress of the rail: 0 when the list top hits ~85% down the viewport,
  // 1 once its bottom has risen to ~55%. That window keeps the draw in sync
  // with the entries arriving.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.55'],
  })
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <ol ref={containerRef} className="relative ml-1.5">
      {/* Static rail (the faint full-height track). */}
      <span
        aria-hidden
        className="absolute left-0 top-2 bottom-2 w-px bg-[var(--br-line)]"
      />
      {/* Drawn progress line over the rail (gold). Static when reduced-motion. */}
      <motion.span
        aria-hidden
        className="absolute left-0 top-2 bottom-2 w-px origin-top bg-[var(--br-gold)]"
        style={prefersReduced ? { scaleY: 1 } : { scaleY: lineScaleY }}
      />

      {timeline.map((entry, i) => (
        <motion.li
          key={entry.company}
          className="relative pl-8 pb-12 last:pb-0 sm:pl-10"
          initial={prefersReduced ? false : { opacity: 0, y: 22 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Dot, centered on the rail (rail sits at left:0; dot is 13px → -6px). */}
          <motion.span
            aria-hidden
            className="absolute top-1 left-[-6px] grid h-[13px] w-[13px] place-items-center rounded-full border border-[var(--br-gold)] bg-white"
            initial={prefersReduced ? false : { scale: 0.4, opacity: 0 }}
            whileInView={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="h-[5px] w-[5px] rounded-full bg-[var(--br-gold)]" />
          </motion.span>

          <div className="flex flex-col gap-0.5">
            <span className="br-data text-[13px] tracking-wide text-[var(--br-muted-2)]">
              {entry.years}
            </span>
            <p className="text-[19px] font-medium leading-tight tracking-[-0.01em] text-[var(--br-ink)] md:text-[22px]">
              {entry.company}
            </p>
            <p className="text-[15px] text-[var(--br-gold)]">{entry.role}</p>
            <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-[var(--br-muted)] md:text-base">
              {entry.note}
            </p>
          </div>
        </motion.li>
      ))}
    </ol>
  )
}
