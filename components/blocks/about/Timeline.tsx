'use client'

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { timeline } from './data'

/**
 * Vertical timeline — cards on the right, a rail of dots on the left.
 *
 * Geometry (the points Joshua flagged):
 *  - Each row is [rail | card]; the dot is vertically CENTERED on its card.
 *  - The connecting line spans EXACTLY from the first dot to the last dot, so it
 *    never overshoots past the final card. We measure the first and last dot
 *    centers (relative to the rail) and set the line's top/height from them —
 *    robust to cards of different heights.
 *  - The rail column is narrow and the card sits right beside it (closes the odd
 *    left gap).
 *  - A gold progress line is layered over the grey line and scaled on scroll, so
 *    the rail fills as you read down.
 *
 * Never hides content: with reduced-motion the cards are plain-visible and the
 * gold line is fully drawn; the line is decorative (aria-hidden) either way.
 * Each card leads with a metric — the value-first rewrite.
 */
export function Timeline() {
  const prefersReduced = useReducedMotion()
  const animate = !prefersReduced

  const railRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([])
  // Line extent within the rail: [topPx, heightPx], from first dot → last dot.
  const [line, setLine] = useState<{ top: number; height: number } | null>(null)

  useLayoutEffect(() => {
    function measure() {
      const rail = railRef.current
      const first = dotRefs.current[0]
      const last = dotRefs.current[dotRefs.current.length - 1]
      if (!rail || !first || !last) return
      const railTop = rail.getBoundingClientRect().top
      const c = (el: HTMLElement) => {
        const r = el.getBoundingClientRect()
        return r.top - railTop + r.height / 2
      }
      const top = c(first)
      setLine({ top, height: c(last) - top })
    }
    measure()
    window.addEventListener('resize', measure)
    // Re-measure after fonts settle (card heights can shift on font swap).
    const t = setTimeout(measure, 250)
    return () => {
      window.removeEventListener('resize', measure)
      clearTimeout(t)
    }
  }, [])

  // Fill the gold line as the block scrolls through the viewport.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 0.8', 'end 0.65'],
  })
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={railRef} className="relative">
      {/* Grey base line: first dot → last dot only. */}
      {line && (
        <span
          aria-hidden
          className="absolute left-[14px] w-px -translate-x-1/2 bg-[var(--br-line)] sm:left-[20px]"
          style={{ top: line.top, height: line.height }}
        />
      )}
      {/* Gold progress line over it. */}
      {line && (
        <motion.span
          aria-hidden
          className="absolute left-[14px] w-px -translate-x-1/2 origin-top bg-[var(--br-gold)] sm:left-[20px]"
          style={{
            top: line.top,
            height: line.height,
            scaleY: animate ? fill : 1,
          }}
        />
      )}

      {timeline.map((entry, i) => {
        const isLast = i === timeline.length - 1
        return (
          <motion.div
            key={entry.company}
            className="relative grid grid-cols-[28px_1fr] gap-x-4 sm:grid-cols-[40px_1fr] sm:gap-x-6"
            initial={animate ? { opacity: 0, y: 24 } : false}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, amount: 0.4, margin: '0px 0px -50px 0px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Rail cell — just hosts the dot, centered on the card. */}
            <div className="relative">
              <span
                ref={(el) => {
                  dotRefs.current[i] = el
                }}
                aria-hidden
                className="absolute left-1/2 top-1/2 z-10 grid h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[var(--br-gold)] bg-white shadow-[0_0_0_5px_white]"
              >
                <span className="h-[6px] w-[6px] rounded-full bg-[var(--br-gold)]" />
              </span>
            </div>

            {/* Card */}
            <div className={isLast ? '' : 'pb-5 sm:pb-6'}>
              <div className="group rounded-[14px] border border-[var(--br-line)] bg-white p-5 transition-all duration-300 hover:border-[var(--br-divider)] hover:shadow-[0_12px_32px_-14px_rgba(7,14,44,0.14)] sm:p-6 md:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  {/* Role identity */}
                  <div className="min-w-0">
                    <span className="br-data text-[12px] uppercase tracking-[0.14em] text-[var(--br-muted-2)]">
                      {entry.years}
                    </span>
                    <p className="mt-1.5 text-[20px] font-medium leading-tight tracking-[-0.01em] text-[var(--br-ink)] md:text-[23px]">
                      {entry.company}
                    </p>
                    <p className="mt-0.5 text-[14px] text-[var(--br-gold)]">
                      {entry.role}
                    </p>
                    <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-[var(--br-muted)] md:text-[15px]">
                      {entry.note}
                    </p>
                  </div>

                  {/* The metric — the value, emphasized */}
                  <div className="shrink-0 border-t border-[var(--br-line)] pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8 sm:text-right">
                    <p className="br-data text-[26px] font-semibold leading-none tracking-[-0.01em] text-[var(--br-ink)] md:text-[30px]">
                      {entry.metric}
                    </p>
                    <p className="mt-1.5 max-w-[9.5rem] text-[11.5px] leading-snug text-[var(--br-muted-2)] sm:ml-auto">
                      {entry.metricLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
