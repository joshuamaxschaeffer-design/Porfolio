'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { timeline } from './data'

/**
 * Animated vertical timeline — line + dots on the left.
 *
 * A faint rail runs down the left; a gold progress line draws over it as the
 * section scrolls through the viewport (scroll-linked, Linear-style). Each
 * entry fades/slides up as it enters view and its dot fills.
 *
 * IMPORTANT — content is never hidden by the animation. We animate with
 * `whileInView` but pass an `initial` that is only applied client-side AFTER
 * mount via a state flag, so:
 *   - server HTML / no-JS / reduced-motion → fully visible, no transforms;
 *   - with motion → entries start at opacity 0 and animate in.
 * This avoids the classic whileInView trap where an entry that's already in the
 * viewport (or scrolled past programmatically) never triggers and stays at
 * opacity 0. Here, if the in-view callback never fires, the element simply stays
 * at its animate target because we also set `animate` as a fallback isn't
 * needed — the element's resting state IS visible.
 */
export function Timeline() {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLOListElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.6'],
  })
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  const animate = !prefersReduced

  return (
    <ol ref={containerRef} className="relative ml-1.5">
      {/* Faint full-height rail. */}
      <span
        aria-hidden
        className="absolute left-0 top-2 bottom-2 w-px bg-[var(--br-line)]"
      />
      {/* Gold progress line over the rail. Static (full) when reduced-motion. */}
      <motion.span
        aria-hidden
        className="absolute left-0 top-2 bottom-2 w-px origin-top bg-[var(--br-gold)]"
        style={animate ? { scaleY: lineScaleY } : { scaleY: 1 }}
      />

      {timeline.map((entry) => (
        <motion.li
          key={entry.company}
          className="relative pl-8 pb-12 last:pb-0 sm:pl-10"
          // Resting state is visible. Animation only ADDS an entrance.
          initial={animate ? { opacity: 0, y: 22 } : false}
          whileInView={animate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, amount: 0.4, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Dot, centered on the rail. */}
          <span
            aria-hidden
            className="absolute top-1 left-[-6px] grid h-[13px] w-[13px] place-items-center rounded-full border border-[var(--br-gold)] bg-white"
          >
            <span className="h-[5px] w-[5px] rounded-full bg-[var(--br-gold)]" />
          </span>

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
