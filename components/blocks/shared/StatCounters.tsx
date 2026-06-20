'use client'

import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export interface StatItem {
  value: number
  /** decimals during/after count-up */
  decimals?: number
  prefix?: string
  suffix?: string
  label: string
  accent?: string
}

/**
 * StatCounters — a row of metrics whose numbers count up (with an underline
 * that draws in) the moment the block scrolls into view. Quick credibility hit
 * for a results/outcomes strip. Reduced-motion → final values shown instantly.
 */
export function StatCounters({
  stats,
  className,
  dark = false,
}: {
  stats: StatItem[]
  className?: string
  /** light text for dark backgrounds (optional; default keeps existing look) */
  dark?: boolean
}) {
  return (
    <div className={`grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 ${className ?? ''}`}>
      {stats.map((s, i) => (
        <Counter key={i} stat={s} index={i} dark={dark} />
      ))}
    </div>
  )
}

function Counter({ stat, index, dark = false }: { stat: StatItem; index: number; dark?: boolean }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [val, setVal] = useState(reduce ? stat.value : 0)
  const accent = stat.accent ?? 'var(--br-gold)'

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, stat.value, {
      duration: 1.4,
      delay: index * 0.08,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, reduce, stat.value, index])

  const shown = stat.decimals ? val.toFixed(stat.decimals) : Math.round(val).toLocaleString()

  return (
    <div ref={ref}>
      <p className={`text-[40px] font-medium leading-none tracking-[-0.02em] md:text-[56px] ${dark ? 'text-white' : 'text-[var(--br-ink)]'}`}>
        {stat.prefix}
        {shown}
        {stat.suffix ? <span style={{ color: accent }}>{stat.suffix}</span> : null}
      </p>
      <motion.span
        aria-hidden
        className="mt-4 block h-[2px] origin-left"
        style={{ background: accent }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={inView || reduce ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.7, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      />
      <p className={`br-data mt-3 text-[12px] uppercase leading-snug tracking-[0.1em] md:text-[13px] ${dark ? 'text-white/60' : 'text-[var(--br-muted)]'}`}>
        {stat.label}
      </p>
    </div>
  )
}
