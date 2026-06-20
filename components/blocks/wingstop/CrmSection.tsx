'use client'

import { useEffect, useRef, useState } from 'react'
import { crmSection as defaults } from './data'
import { DragGrid } from './DragGrid'

/**
 * SECTION 3 — CRM. WHITE field.
 * Module 1: the scope of all CRM work as a tall scroll-driven sliding row of
 * email mockups (slides left as you scroll through), decorated with top-down
 * Wingstop food — modelled on Panda's seamless-reorder slide. Scroll progress
 * is read manually from getBoundingClientRect (Lenis-safe).
 * Module 2: the modular/animated side as a grid carousel of CRM gifs.
 */
export function CrmSection() {
  return (
    <section id="crm" className="relative w-full overflow-hidden bg-white">
      <div className="br-container pt-16 md:pt-24">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">3. {defaults.eyebrow}</p>
        <h2 className="mt-3 max-w-[24ch] text-[32px] font-medium leading-[1.05] text-[var(--br-ink)] md:text-[40px]">
          {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{defaults.intro}</p>
      </div>

      <CrmScopeSlide />
      <CrmAnimatedGrid />
    </section>
  )
}

/** Tall section; emails slide left as the viewer scrolls through it. */
function CrmScopeSlide() {
  const ref = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [x, setX] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const onScroll = () => {
      raf = 0
      const el = ref.current
      const track = trackRef.current
      if (!el || !track) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // progress 0→1 across the pinned travel (section taller than viewport)
      const total = r.height - vh
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0
      const overflow = Math.max(0, track.scrollWidth - track.clientWidth)
      setX(reduce ? 0 : -overflow * p)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(onScroll)
    }
    onScroll()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    // Height tuned so the horizontal slide finishes right at the section bottom
    // (no trailing empty scroll / white void). ~150vh gives a comfortable pace
    // for the ~7 tall emails without dead space.
    <div ref={ref} className="relative mt-10 h-[150vh] md:mt-14">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="br-container">
          <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
            {defaults.scope.eyebrow}
          </span>
          <h3 className="mt-2 text-[26px] font-semibold text-[var(--br-ink)] sm:text-[32px]">{defaults.scope.title}</h3>
        </div>
        {/* food decoration (top-down, on the flat white field) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
          {defaults.scope.food.map((f, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={f}
              src={f}
              alt=""
              className="absolute hidden opacity-90 lg:block"
              style={{
                // Kept clear of the heading (top-left) and the email rail (center
                // band): tucked into the lower-left, far-right, and bottom edges.
                width: 168 - i * 26,
                left: `${[3, 86, 50][i]}%`,
                top: `${[68, 60, 84][i]}%`,
                transform: `rotate(${[-12, 10, -6][i]}deg)`,
                filter: 'drop-shadow(0 16px 26px rgba(0,0,0,0.18))',
              }}
            />
          ))}
        </div>
        <div ref={trackRef} className="relative z-[1] mt-8 overflow-hidden">
          <div className="flex gap-8 px-6 will-change-transform md:px-20" style={{ transform: `translateX(${x}px)` }}>
            {defaults.scope.emails.map((e) => (
              <div
                key={e}
                className="h-[66vh] w-[280px] shrink-0 overflow-hidden rounded-2xl border border-[var(--br-line)] bg-white [box-shadow:0_24px_54px_rgba(0,0,0,0.18)] sm:w-[320px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e} alt="" loading="lazy" className="block w-full object-cover object-top" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Samsung-style grid carousel of the animated CRM gifs (white). */
function CrmAnimatedGrid() {
  return (
    <div className="br-container pb-20 pt-10 md:pb-[120px] md:pt-16">
      <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
        {defaults.animated.eyebrow}
      </span>
      <h3 className="mt-2 text-2xl font-semibold text-[var(--br-ink)] sm:text-[28px]">{defaults.animated.title}</h3>
      <p className="mt-2 max-w-[60ch] text-[15px] text-[var(--br-muted)] sm:text-base">{defaults.animated.body}</p>
      <div className="mt-7">
        <DragGrid items={defaults.animated.gifs} tone="light" />
      </div>
    </div>
  )
}
