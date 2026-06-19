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

/* Official-style store badge: brand glyph + "Download on the / App Store" or
 * "Get it on / Google Play". Dark pill (matches Apple/Google badge convention),
 * opens the live listing in a new tab. */
function StoreBadge({
  store,
  label,
  href,
}: {
  store: string
  label: string
  href: string
}) {
  const isApple = store === 'App Store'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} ${store} — opens the Panda Express listing in a new tab`}
      className="group inline-flex items-center gap-3 rounded-[12px] bg-[var(--br-ink)] px-5 py-3 text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--px-red)]"
    >
      <span aria-hidden className="shrink-0">
        {isApple ? (
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden>
            <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 2.98-.78.88-2.06 1.56-3.1 1.48-.13-1.1.42-2.27 1.06-3 .73-.83 2.02-1.45 3.16-1.46zM20.7 17.1c-.57 1.31-.85 1.9-1.58 3.06-1.02 1.62-2.46 3.63-4.24 3.65-1.58.01-1.99-1.03-4.13-1.02-2.14.01-2.59 1.04-4.17 1.02-1.78-.02-3.14-1.84-4.16-3.45C-.5 17.8-.85 12.5 1.27 9.68c1.2-1.59 2.96-2.52 4.62-2.52 1.69 0 2.75 1.04 4.15 1.04 1.36 0 2.19-1.04 4.15-1.04 1.48 0 3.05.81 4.17 2.2-3.66 2.01-3.07 7.24.34 8.74z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
            <path d="M3.6 1.84a1.7 1.7 0 0 0-.45 1.18v17.96c0 .47.17.88.45 1.18l.09.08L13.8 12.1v-.2L3.69 1.76l-.09.08z" fill="#00D2FF" />
            <path d="M17.17 15.47 13.8 12.1v-.2l3.38-3.38.08.05 4 2.27c1.14.65 1.14 1.71 0 2.36l-4 2.27-.09.06z" fill="#FFCE00" />
            <path d="m17.25 15.41-3.45-3.41-10.2 10.2c.38.4 1 .45 1.7.06l11.95-6.85z" fill="#FF3A44" />
            <path d="M3.6 1.84 13.8 12.05l3.45-3.45L5.3 1.78c-.7-.4-1.32-.34-1.7.06z" fill="#00F076" />
          </svg>
        )}
      </span>
      <span className="flex flex-col leading-none">
        <span className="br-data text-[10px] uppercase tracking-[0.12em] text-white/70">{label}</span>
        <span className="mt-1 text-[17px] font-semibold leading-tight">{store}</span>
      </span>
    </a>
  )
}

/** A lightweight white phone frame around a bare 750×1624 app screen. */
function AppPhone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[750/1624] w-full overflow-hidden rounded-[14%/6.5%] bg-white shadow-[0_18px_44px_-14px_rgba(0,0,0,0.32)] ring-1 ring-black/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="block h-full w-full object-cover" />
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
          {data.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{lead}</p>

        {/* Stat grid — big count-up numbers, 3×2 on desktop */}
        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:mt-16 md:grid-cols-3 md:gap-y-14">
          {data.stats.map((stat, i) => (
            <StatCell key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Platform availability — still live on both stores, with the real
            listings linked. Sits below the stat grid as the closing note.
            Left: copy + store badges. Right: two app screens + the app icon. */}
        <div className="mt-14 border-t border-[var(--br-line)] pt-10 md:mt-20 md:pt-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            {/* left — copy, then the store badges directly beneath it */}
            <div className="max-w-2xl">
              <p className="br-data text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--px-red)]">
                {data.platforms.eyebrow}
              </p>
              <h3
                className="mt-3 text-[24px] font-medium leading-tight tracking-[-0.01em] text-[var(--br-ink)] md:text-[28px]"
                style={{ fontFamily: 'var(--br-font-heading)' }}
              >
                {data.platforms.title}
              </h3>
              <p className="mt-3 text-[15px] leading-snug text-[var(--br-muted)] md:text-base">
                {data.platforms.body}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {data.platforms.links.map((l) => (
                  <StoreBadge key={l.store} store={l.store} label={l.label} href={l.href} />
                ))}
              </div>
            </div>

            {/* right — two unused app screens + the Panda Express app icon */}
            <div className="flex items-center justify-center gap-5 sm:gap-7 lg:shrink-0">
              {data.platforms.screens.map((s, i) => (
                <div key={s.src} className={i === 1 ? 'mt-8 w-[34%] max-w-[150px] sm:w-[150px]' : 'w-[34%] max-w-[150px] sm:w-[150px]'}>
                  <AppPhone src={s.src} alt={s.alt} />
                </div>
              ))}
              <div className="w-[22%] max-w-[104px] sm:w-[104px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.platforms.appIcon}
                  alt="Panda Express app icon"
                  loading="lazy"
                  className="block w-full drop-shadow-[0_14px_28px_rgba(0,0,0,0.16)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Source footnote — public figures, quietly cited */}
        <p className="br-data mt-12 max-w-4xl text-[12px] leading-relaxed text-[var(--br-muted-2)] md:mt-16">
          {data.sources}
        </p>
      </div>
    </section>
  )
}
