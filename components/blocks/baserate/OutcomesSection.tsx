'use client'

import { useEffect, useRef, useState } from 'react'
import { outcomes as defaults, type OutcomeStat } from './data'

/**
 * Outcomes — the closing section of the Baserate case study (Figma 91:44565).
 * Layout per Figma (testimonial cards + Trusted By logo row); the metrics row
 * is intentionally "snazzier" than the Figma placeholder: a stat grid of big
 * numbers that count up when scrolled into view (per Joshua, 2026-06-10).
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

/** Count-up driven by rAF with an ease-out-expo curve; respects reduced motion. */
function StatCell({ stat, index }: { stat: OutcomeStat; index: number }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
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
      setDisplay(Math.round(stat.value * eased))
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
        className="whitespace-nowrap text-[52px] font-medium leading-none tracking-[-0.01em] text-[var(--br-ink)] sm:text-[56px] lg:text-[80px]"
        style={{ fontFamily: 'var(--br-font-heading)' }}
      >
        {stat.prefix}
        {display.toLocaleString('en-US')}
        {stat.suffix ? <span className="text-[var(--br-gold)]">{stat.suffix}</span> : null}
      </p>
      <p className="br-data mt-3 text-[14px] uppercase tracking-[0.12em] text-[var(--br-gold)]">
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
          7. {data.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{lead}</p>

        {/* Stat grid — big count-up numbers */}
        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-y-14">
          {data.stats.map((stat, i) => (
            <StatCell key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Testimonials — per Figma: grey cards, 3px black left rule */}
        <h3 className="mt-20 text-[20px] font-semibold uppercase leading-none text-[var(--br-ink)] md:mt-28 md:text-[24px]">
          {data.testimonialsHeading}
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-5 md:mt-6 md:grid-cols-2 md:gap-[30px] lg:grid-cols-3">
          {data.testimonials.map((t) => (
            <figure
              key={t.role}
              className="flex h-full flex-col gap-4 rounded-r-[8px] border-l-[3px] border-black bg-[var(--br-bg-2)] p-6"
            >
              <blockquote className="text-lg leading-normal text-[var(--br-ink)] md:text-[22px]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-2 pt-2">
                <span className="flex items-center rounded-[4px] border border-[var(--br-stroke)] bg-white p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/baserate/logos/clients/business-icon.svg" alt="" aria-hidden className="h-6 w-6" />
                </span>
                <span className="text-[15px] leading-tight text-[var(--br-ink)] md:text-[18px]">
                  {t.role},
                  <br />
                  {t.org}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Trusted By — logo cards per Figma */}
        <h3 className="mt-16 text-[18px] font-medium uppercase leading-none text-[var(--br-ink)] md:mt-20 md:text-[22px]">
          {data.trustedByHeading}
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-4 md:mt-5 lg:grid-cols-4">
          {data.logos.map((logo) => (
            <div
              key={logo.alt}
              className="flex items-center justify-center rounded-[8px] bg-[var(--br-bg-2)] px-6 py-8 md:px-8"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-auto max-h-[56px] w-full object-contain md:max-h-[72px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
