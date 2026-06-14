'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import Link from 'next/link'
import { useRef } from 'react'
import type { ReactNode } from 'react'

/**
 * Magnetic — wraps a control so it pulls toward the cursor when hovered and
 * springs back on leave. Signals craft on primary CTAs. No-op on touch /
 * reduced-motion. Strength is the px pull at the edge of the hit area.
 */
export function Magnetic({ children, strength = 0.4, className }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ''}`}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  )
}

/**
 * MagneticCTA — an oversized closing "let's talk" band: giant headline, a
 * magnetic primary button, and supporting links. The strong send-off pattern
 * top portfolios end on. Dark by default so it reads as a deliberate finale on
 * the white page.
 */
export function MagneticCTA({
  eyebrow = 'Next',
  headline,
  ctaLabel,
  ctaHref,
  links,
  className,
  tone = 'ink',
}: {
  eyebrow?: string
  headline: string
  ctaLabel: string
  ctaHref: string
  links?: { label: string; href: string }[]
  className?: string
  tone?: 'ink' | 'light'
}) {
  const ink = tone === 'ink'
  return (
    <section
      className={`overflow-hidden ${ink ? 'bg-[var(--br-ink)] text-white' : 'bg-white text-[var(--br-ink)]'} ${className ?? ''}`}
    >
      <div className="br-container py-20 md:py-32">
        <p className="br-data text-[12px] font-semibold uppercase tracking-[0.2em]" style={{ color: ink ? 'var(--br-gold-soft)' : 'var(--br-gold)' }}>
          {eyebrow}
        </p>
        <h2
          className="mt-5 max-w-[18ch] text-[40px] font-medium leading-[0.98] tracking-[-0.02em] md:text-[88px]"
          style={{ color: ink ? '#ffffff' : 'var(--br-ink)' }}
        >
          {headline}
        </h2>
        <div className="mt-10 flex flex-col items-start gap-8 md:mt-14 md:flex-row md:items-center md:gap-12">
          <Magnetic strength={0.5}>
            <Link
              href={ctaHref}
              className={`br-data inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.06em] transition-colors ${
                ink ? 'bg-white text-[var(--br-ink)] hover:bg-[var(--br-gold-soft)]' : 'bg-[var(--br-ink)] text-white hover:opacity-90'
              }`}
            >
              {ctaLabel}
              <span aria-hidden className="text-lg">→</span>
            </Link>
          </Magnetic>
          {links?.length ? (
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`br-data text-sm uppercase tracking-[0.08em] underline-offset-4 hover:underline ${ink ? 'text-white/75 hover:text-white' : 'text-[var(--br-muted)] hover:text-[var(--br-ink)]'}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
