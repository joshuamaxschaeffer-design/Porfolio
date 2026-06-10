'use client'

import { useEffect, useRef, useState } from 'react'
import { outcomes as defaults, type PandaStat } from './data'

/**
 * Outcomes — fully built closing section. Count-up stat grid mirrors the
 * Baserate OutcomesSection mechanics (per-cell IntersectionObserver, rAF
 * ease-out-expo 1.6s, 110ms row stagger, reduced-motion snap) with two
 * differences: Panda-red accents and decimal support (4.8★).
 * All figures are public reporting — sources cited in data.ts + footnote.
 */

/** One-shot in-view detector (fires once, then disconnects). */
function useInViewOnce<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

function formatValue(v: number, decimals: number) {
  return decimals > 0
    ? v.toFixed(decimals)
    : Math.round(v).toLocaleString('en-US')
}

/** Count-up cell driven by rAF with an ease-out-expo curve. */
function StatCell({ stat, index }: { stat: PandaStat; index: number }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const decimals = stat.decimals ?? 0
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  // Stagger siblings within a desktop row so the row ripples left → right.
  const delay = (index % 3) * 110
  const duration = 1600

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(stat.value)
      return
    }
    let raf = 0
    const t0 = performance.now() + delay
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / duration))
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setDisplay(stat.value * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, stat.value, delay])

  return (
    <div
      ref={ref}
      className="border-t border-[var(--br-line)] pt-5 transition-[opacity,transform] duration-700 ease-out md:pt-6"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(12px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <p
        className="whitespace-nowrap text-[56px] font-medium leading-none tracking-[-0.01em] text-[var(--br-ink)] md:text-[72px] lg:text-[80px]"
        style={{ fontFamily: 'var(--br-font-heading)' }}
      >
        {stat.prefix}
        {formatValue(display, decimals)}
        {stat.suffix ? <span className="text-[var(--px-red)]">{stat.suffix}</span> : null}
      </p>
      <p className="br-data mt-3 text-[14px] uppercase tracking-[0.12em] text-[var(--px-red)]">
        {stat.label}
      </p>
      <p className="mt-2 max-w-[34ch] text-[15px] leading-snug text-[var(--br-muted)] md:text-base">
        {stat.description}
      </p>
    </div>
  )
}

export function OutcomesSection({ intro }: { intro?: string } = {}) {
  const data = defaults
  const lead = intro ?? data.lead

  return (
    <section id="outcomes" className="bg-white">
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[140px]">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          4. {data.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{lead}</p>

        {/* Stat grid — big count-up numbers, 3×2 on desktop */}
        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:mt-16 md:grid-cols-3 md:gap-y-14">
          {data.stats.map((stat, i) => (
            <StatCell key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Source footnote — public figures, quietly cited */}
        <p className="br-data mt-12 max-w-4xl text-[12px] leading-relaxed text-[var(--br-muted-2)] md:mt-16">
          {data.sources}
        </p>
      </div>
    </section>
  )
}
