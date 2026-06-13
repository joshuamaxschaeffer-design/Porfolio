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
 * Vertical timeline — clean cards on the right, a rail of dots on the left.
 *
 * Geometry (the points Joshua flagged):
 *  - Each row is [rail | card]; the dot is vertically CENTERED on its card.
 *  - The connecting line spans EXACTLY from the first dot to the last dot (their
 *    centers are measured), so it never overshoots past the final card.
 *  - Narrow rail column beside the card (no odd left gap).
 *  - A gold progress line is layered over the grey line and scaled on scroll.
 *
 * Cards are intentionally simple — year / company / role / one line. (The
 * earlier set-off metric block on the right read as weak and was removed; the
 * proof now lives in the note copy.)
 *
 * Never hides content: reduced-motion → cards plain-visible, gold line fully
 * drawn; the line is decorative (aria-hidden) either way.
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
    const t = setTimeout(measure, 250) // re-measure after fonts settle
    return () => {
      window.removeEventListener('resize', measure)
      clearTimeout(t)
    }
  }, [])

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
            {/* Rail cell — hosts the dot, centered on the card. */}
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

            {/* Card — clean single column. */}
            <div className={isLast ? '' : 'pb-5 sm:pb-6'}>
              <div className="group rounded-[14px] border border-[var(--br-line)] bg-white p-5 transition-all duration-300 hover:border-[var(--br-divider)] hover:shadow-[0_12px_32px_-14px_rgba(7,14,44,0.14)] sm:p-6 md:p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[20px] font-medium leading-tight tracking-[-0.01em] text-[var(--br-ink)] md:text-[23px]">
                    {entry.company}
                  </p>
                  <span className="br-data shrink-0 text-[12px] uppercase tracking-[0.14em] text-[var(--br-muted-2)]">
                    {entry.years}
                  </span>
                </div>
                <p className="mt-1 text-[14px] text-[var(--br-gold)]">
                  {entry.role}
                </p>
                <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[var(--br-muted)] md:text-[15px]">
                  {entry.note}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
