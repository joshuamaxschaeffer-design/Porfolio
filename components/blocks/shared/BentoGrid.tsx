'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export interface BentoCell {
  /** column span on desktop (out of 4). default 1 */
  col?: 1 | 2 | 3 | 4
  /** row span on desktop (out of N). default 1 */
  row?: 1 | 2
  eyebrow?: string
  title?: string
  body?: string
  /** big display value (e.g. a stat) rendered large */
  big?: string
  /** optional accent */
  accent?: string
  /** tone: 'light' (white card) or 'ink' (dark card) */
  tone?: 'light' | 'ink'
  /** custom content overrides the title/body rendering */
  children?: ReactNode
}

/**
 * BentoGrid — an asymmetric modular grid of mixed-size cards on one clean
 * baseline (Apple-popularized, now everywhere). Cards stagger-reveal on scroll.
 * Mobile collapses to a single column; tablet to two; desktop to the 4-col
 * bento with per-cell spans.
 */
export function BentoGrid({ cells, className }: { cells: BentoCell[]; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className ?? ''}`}>
      {cells.map((cell, i) => {
        const colClass = cell.col === 4 ? 'lg:col-span-4' : cell.col === 3 ? 'lg:col-span-3' : cell.col === 2 ? 'lg:col-span-2 sm:col-span-2' : ''
        const rowClass = cell.row === 2 ? 'lg:row-span-2' : ''
        const ink = cell.tone === 'ink'
        const accent = cell.accent ?? 'var(--br-gold)'
        return (
          <motion.div
            key={i}
            className={`relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-[var(--br-card-radius)] border p-6 md:min-h-[200px] md:p-7 ${colClass} ${rowClass} ${
              ink ? 'border-transparent bg-[var(--br-ink)] text-white' : 'border-[var(--br-line)] bg-white'
            }`}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: Math.min(i * 0.06, 0.4), ease: [0.16, 1, 0.3, 1] }}
          >
            {/* faint accent glow in a corner for depth */}
            {!ink ? (
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.10] blur-2xl"
                style={{ background: accent }}
              />
            ) : null}
            {cell.children ? (
              cell.children
            ) : (
              <>
                <div>
                  {cell.eyebrow ? (
                    <p className="br-data text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: ink ? 'rgba(255,255,255,0.7)' : accent }}>
                      {cell.eyebrow}
                    </p>
                  ) : null}
                  {cell.big ? (
                    <p className={`mt-2 text-[44px] font-medium leading-none tracking-[-0.02em] md:text-[64px] ${ink ? 'text-white' : 'text-[var(--br-ink)]'}`}>
                      {cell.big}
                    </p>
                  ) : null}
                </div>
                <div className={cell.big ? 'mt-6' : ''}>
                  {cell.title ? (
                    <h3 className={`text-[19px] font-medium leading-snug tracking-[-0.01em] md:text-[22px] ${ink ? 'text-white' : 'text-[var(--br-ink)]'}`}>
                      {cell.title}
                    </h3>
                  ) : null}
                  {cell.body ? (
                    <p className={`mt-2 text-[14px] leading-relaxed md:text-[15px] ${ink ? 'text-white/70' : 'text-[var(--br-muted)]'}`}>
                      {cell.body}
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
