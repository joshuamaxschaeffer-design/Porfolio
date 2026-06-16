'use client'

import { useEffect, useRef, useState } from 'react'
import { featureIntro as defaults } from './data'

/**
 * Lead-in header for the feature ecosystem (the auto-scroll carousels + the
 * 70+ feature columns that follow). Sits directly after the "2 Products" stage
 * as the entry into all the feature work.
 *
 * The headline number counts up when scrolled into view (same rAF / ease-out-
 * expo approach as OutcomesSection, reduced-motion safe). Below it, a line about
 * the exploration, weekly reviews and user testing behind every feature, then
 * three proof chips.
 */

type FeatureIntro = typeof defaults

/** One-shot in-view detector (fires once, then disconnects). */
function useInViewOnce<T extends HTMLElement>(threshold = 0.4) {
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

export function FeatureEcosystemIntro({ data = defaults }: { data?: FeatureIntro }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const [display, setDisplay] = useState(0)
  const started = useRef(false)
  const duration = 1700

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(data.count)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / duration))
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setDisplay(Math.round(data.count * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, data.count])

  return (
    <div ref={ref} className="br-container">
      {/* Headline: count-up number + suffix (gold) + unit, sized to match the
          page's section headers (40px uppercase). tabular-nums keeps the number
          from jittering its width as it counts. */}
      <h3 className="flex flex-wrap items-baseline gap-x-3 text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
        <span className="tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {display}
          <span className="text-[var(--br-gold)]">{data.countSuffix}</span>
        </span>
        <span>{data.unit}</span>
      </h3>

      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--br-muted)] md:text-[22px]">
        {data.body}
      </p>

      {/* Proof chips — the former pills, reframed with their real numbers. The
          value reads bold/inked, the label muted, inside the gold-outlined tag. */}
      <ul
        className="br-noscrollbar mt-6 flex gap-3 overflow-x-auto pb-1 md:flex-wrap"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        {data.stats.map((s) => (
          <li
            key={s.label}
            className="br-data flex shrink-0 items-baseline gap-1.5 rounded-[var(--br-tag-radius)] border border-[var(--br-gold)] px-3.5 py-2 text-[14px] uppercase"
          >
            <span className="font-semibold text-[var(--br-ink)]">{s.value}</span>
            <span className="text-[var(--br-gold)]">{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
