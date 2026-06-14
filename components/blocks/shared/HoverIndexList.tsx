'use client'

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import Link from 'next/link'
import { useRef, useState } from 'react'

export interface IndexRow {
  title: string
  meta?: string
  href?: string
  /** preview image shown on hover (optional). A tinted swatch is used if absent. */
  image?: string
  /** accent for the swatch fallback + index number */
  accent?: string
}

/**
 * HoverIndexList — a minimal text index of projects where hovering a row floats
 * a preview that follows the cursor and dims the other rows. The signature
 * editorial-studio move (Obys/Unseen): looks expensive, stays type-first.
 *
 * Desktop only for the floating image (pointer: fine); on touch it's a clean
 * tappable list. Reduced-motion → no float, no dim.
 */
export function HoverIndexList({ rows, className }: { rows: IndexRow[]; className?: string }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 })

  const onMove = (e: React.MouseEvent) => {
    const r = wrapRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  const activeRow = active != null ? rows[active] : null

  return (
    <div ref={wrapRef} className={`relative ${className ?? ''}`} onMouseMove={onMove}>
      <ul className="border-t border-[var(--br-line)]">
        {rows.map((row, i) => {
          const dim = !reduce && active != null && active !== i
          const accent = row.accent ?? 'var(--br-gold)'
          const inner = (
            <div
              className="flex items-baseline justify-between gap-6 py-6 transition-all duration-300 md:py-8"
              style={{ opacity: dim ? 0.35 : 1 }}
              onMouseEnter={() => setActive(i)}
            >
              <div className="flex items-baseline gap-4 md:gap-7">
                <span className="br-data text-[12px] font-semibold tabular-nums" style={{ color: accent }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="text-[26px] font-medium leading-none tracking-[-0.01em] text-[var(--br-ink)] transition-transform duration-300 md:text-[44px]"
                  style={{ transform: !reduce && active === i ? 'translateX(10px)' : 'none' }}
                >
                  {row.title}
                </span>
              </div>
              {row.meta ? (
                <span className="br-data shrink-0 text-[12px] uppercase tracking-[0.1em] text-[var(--br-muted)] md:text-[13px]">
                  {row.meta}
                </span>
              ) : null}
            </div>
          )
          return (
            <li key={i} className="border-b border-[var(--br-line)]">
              {row.href ? (
                <Link href={row.href} className="block">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          )
        })}
      </ul>

      {/* floating cursor preview (desktop / fine-pointer only) */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
          style={{ x: sx, y: sy }}
        >
          <AnimatePresence>
            {activeRow ? (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden rounded-xl shadow-[0_24px_60px_-24px_rgba(7,14,44,0.5)]"
                style={{ width: 280, height: 184, marginLeft: 24, marginTop: -92 }}
              >
                {activeRow.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={activeRow.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div
                    className="flex h-full w-full items-end p-4"
                    style={{ background: `linear-gradient(135deg, ${activeRow.accent ?? 'var(--br-gold)'} 0%, var(--br-ink) 120%)` }}
                  >
                    <span className="br-data text-[12px] uppercase tracking-[0.14em] text-white/90">
                      {activeRow.title}
                    </span>
                  </div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </div>
  )
}
