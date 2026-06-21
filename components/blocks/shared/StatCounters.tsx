'use client'

import { useReducedMotion } from 'motion/react'
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
  const [inView, setInView] = useState(false)
  // Initialize to the FINAL value so the real number is ALWAYS shown (SSR + if
  // the count-up never starts). The animation, when it runs, briefly resets to
  // 0 and counts up — pure enhancement that can never leave a 0 on screen.
  const [val, setVal] = useState(stat.value)
  const accent = stat.accent ?? 'var(--br-gold)'

  // Single source of truth: a self-contained rAF count-up that is STARTED by a
  // native IntersectionObserver — with a safety timer that starts it anyway if
  // the observer never fires (already in view on load / Lenis / backgrounded
  // tab). No dependency on Motion's useInView (unreliable under Lenis) or on
  // Motion's animate. Reduced-motion → jump straight to the final value.
  useEffect(() => {
    const target = stat.value
    if (reduce) {
      setVal(target)
      setInView(true)
      return
    }
    let raf = 0
    let started = false
    let cancelled = false
    const run = () => {
      if (started || cancelled) return
      started = true
      setInView(true)
      setVal(0) // reset to 0 only when the count-up actually begins
      const dur = 1400
      const t0 = performance.now() + index * 80
      const ease = (t: number) => 1 - Math.pow(1 - t, 3)
      const tick = (now: number) => {
        if (cancelled) return
        const p = Math.max(0, Math.min(1, (now - t0) / dur))
        setVal(target * ease(p))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    const el = ref.current
    let io: IntersectionObserver | null = null
    if (el) {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            run()
            io?.disconnect()
          }
        },
        { threshold: 0.3 },
      )
      io.observe(el)
    }
    const safety = setTimeout(run, 1000) // never let it stay at 0
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      io?.disconnect()
      clearTimeout(safety)
    }
  }, [reduce, stat.value, index])

  const shown = stat.decimals ? val.toFixed(stat.decimals) : Math.round(val).toLocaleString()

  return (
    <div ref={ref}>
      <p className={`text-[40px] font-medium leading-none tracking-[-0.02em] md:text-[56px] ${dark ? 'text-white' : 'text-[var(--br-ink)]'}`}>
        {stat.prefix}
        {shown}
        {stat.suffix ? <span style={{ color: accent }}>{stat.suffix}</span> : null}
      </p>
      <p className={`br-data mt-4 text-[12px] uppercase leading-snug tracking-[0.1em] md:text-[13px] ${dark ? 'text-white/60' : 'text-[var(--br-muted)]'}`}>
        {stat.label}
      </p>
    </div>
  )
}
