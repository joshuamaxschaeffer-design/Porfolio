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
 * Geometry:
 *  - The rail lives in a fixed-width left gutter. Each dot is absolutely
 *    centered to ITS CARD (top-1/2 of the card's row box), so cards and dots
 *    line up perfectly at every breakpoint regardless of card height — the dot
 *    references the card box, not a separate column whose height includes the
 *    row gap (the gap is margin BELOW each row, outside the positioned box).
 *  - The connecting line spans EXACTLY from the first dot's center to the last
 *    dot's center (measured), so it never overshoots past the final card.
 *  - Each card has a small left-pointing caret aimed at its dot — same tail
 *    style as the case-study SectionNav tooltip (10px rotated square, hairline
 *    border on the two outer edges, white fill).
 *
 * Cards always carry a soft shadow (no hover state). Reduced-motion → cards
 * plain-visible and the gold line fully drawn; the rail is decorative.
 */

const RAIL = 40 // px width of the left rail gutter (dot centered within it)

export function Timeline() {
  const prefersReduced = useReducedMotion()
  const animate = !prefersReduced

  const wrapRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [line, setLine] = useState<{ top: number; height: number } | null>(null)

  useLayoutEffect(() => {
    function measure() {
      const wrap = wrapRef.current
      const first = dotRefs.current[0]
      const last = dotRefs.current[dotRefs.current.length - 1]
      if (!wrap || !first || !last) return
      const wrapTop = wrap.getBoundingClientRect().top
      const center = (el: HTMLElement) => {
        const r = el.getBoundingClientRect()
        return r.top - wrapTop + r.height / 2
      }
      const top = center(first)
      setLine({ top, height: center(last) - top })
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
    target: wrapRef,
    offset: ['start 0.8', 'end 0.65'],
  })
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={wrapRef} className="relative">
      {/* Grey base line: first dot center → last dot center only. */}
      {line && (
        <span
          aria-hidden
          className="absolute w-px -translate-x-1/2 bg-[var(--br-line)]"
          style={{ left: RAIL / 2, top: line.top, height: line.height }}
        />
      )}
      {/* Gold progress line over it. */}
      {line && (
        <motion.span
          aria-hidden
          className="absolute w-px -translate-x-1/2 origin-top bg-[var(--br-gold)]"
          style={{
            left: RAIL / 2,
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
            className={isLast ? '' : 'mb-5 sm:mb-6'}
            initial={animate ? { opacity: 0, y: 24 } : false}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, amount: 0.4, margin: '0px 0px -50px 0px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Row box: relative, with a fixed left gutter for the rail. The dot
                + caret center to THIS box, whose height == the card (gap is
                margin below, outside the box) → perfect centering at any size. */}
            <div className="relative" style={{ paddingLeft: RAIL }}>
              {/* Dot — vertically centered to the card, in the rail gutter. */}
              <span
                ref={(el) => {
                  dotRefs.current[i] = el
                }}
                aria-hidden
                className="absolute z-10 grid h-[15px] w-[15px] place-items-center rounded-full border border-[var(--br-gold)] bg-white shadow-[0_0_0_5px_white]"
                style={{ left: RAIL / 2, top: '50%', transform: 'translate(-50%, -50%)' }}
              >
                <span className="h-[6px] w-[6px] rounded-full bg-[var(--br-gold)]" />
              </span>

              {/* Card — always shadowed, no hover. */}
              <div className="relative rounded-[14px] border border-[var(--br-line)] bg-white p-5 [box-shadow:0_10px_30px_-14px_rgba(7,14,44,0.16),0_2px_6px_rgba(7,14,44,0.05)] sm:p-6 md:p-7">
                {/* Caret aimed left at the dot (SectionNav tooltip tail style). */}
                <span
                  aria-hidden
                  className="absolute -left-[5.5px] top-1/2 h-[10px] w-[10px] -translate-y-1/2 rotate-45 rounded-[1px] border-b border-l border-[var(--br-line)] bg-white"
                />

                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[20px] font-medium leading-tight tracking-[-0.01em] text-[var(--br-ink)] md:text-[23px]">
                    {entry.company}
                  </p>
                  <span className="br-data shrink-0 text-[12px] uppercase tracking-[0.14em] text-[var(--br-muted-2)]">
                    {entry.years}
                  </span>
                </div>
                <p className="mt-1 text-[14px] text-[var(--br-gold)]">{entry.role}</p>
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
