'use client'

import { useEffect, useRef, useState } from 'react'
import { uiux as defaults } from './data'
import { WsUxFlow } from './WsUxFlow'

/**
 * SECTION 7 — UI/UX UPDATES. Three modules:
 *  1. Four UX flows (Panda Loyalty-QR style): nodes connected by arrows, each
 *     screen revealed on hover.
 *  2. Dark mode as a receding 3D stack (Baserate Scalability style, black).
 *  3. "UI improvement": a side-scroll carousel of 3 screens + an autoplay video.
 */
export function UiUxSection() {
  return (
    <section id="ui-ux" className="bg-white">
      <div className="br-container pt-16 md:pt-24">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">7. {defaults.eyebrow}</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] text-[var(--br-ink)] md:text-[40px]">{defaults.heading}</h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{defaults.intro}</p>
      </div>

      {/* Module 1 — four UX flows as a hub-and-spoke DAG (Panda Loyalty-QR style) */}
      <div className="br-container pt-12 md:pt-16">
        <WsUxFlow />
      </div>

      {/* Module 2 — dark mode receding stack (black band) */}
      <DarkModeStack />

      {/* Module 3 — UI improvement carousel + video */}
      <Improvement />
    </section>
  )
}

/** Dark-mode screens receding into depth (Baserate Scalability technique). */
function DarkModeStack() {
  const ref = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const onScroll = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // center-relative progress 0→1 as the section travels up through the
      // viewport (no pin): 0 when its top hits the bottom of the screen, 1 when
      // its bottom leaves the top. Drives only a SUBTLE spread.
      const prog = (vh - r.top) / (vh + r.height)
      setP(reduce ? 0.4 : Math.min(1, Math.max(0, prog)))
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

  const F = 1500
  // Subtle spread: the stack opens just a little as it scrolls through view —
  // NO scroll pin (the section is a normal height and scrolls past naturally),
  // and the spread growth is gentle (base gap + a small scroll-linked delta).
  const GAP = 300 + p * 120

  return (
    <div ref={ref} className="relative mt-16 bg-[#0a0a0b]">
      <div
        className="ws-dark relative h-[88vh] overflow-hidden text-white md:h-[92vh]"
        style={{ '--ws-green': '#23c265' } as React.CSSProperties}
      >
        <div className="br-container pt-14">
          <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
            {defaults.darkMode.eyebrow}
          </span>
          <h3 className="mt-2 text-2xl font-semibold text-white sm:text-[28px]">{defaults.darkMode.title}</h3>
          <p className="mt-2 max-w-[56ch] text-[15px] text-white/75 sm:text-base">{defaults.darkMode.body}</p>
        </div>
        <div className="absolute inset-0 -z-0">
          {defaults.darkMode.screens.map((src, i) => {
            const z = i * GAP
            const s = F / (F + z)
            // anchor front card lower-left, recede cleanly up-and-to-the-right
            const frontX = 26,
              frontY = 58,
              vpX = 90,
              vpY = 22
            const x = frontX + (vpX - frontX) * (1 - s)
            const y = frontY + (vpY - frontY) * (1 - s)
            // normalized depth across the whole stack (0 = hero front, 1 = back card)
            const count = defaults.darkMode.screens.length
            const d = count > 1 ? i / (count - 1) : 0
            return (
              <div
                key={src}
                className="absolute overflow-hidden rounded-[14%/6.5%] border border-white/10 bg-black"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: '22%',
                  maxWidth: 250,
                  transform: `translate(-50%,-50%) scale(${s})`,
                  zIndex: defaults.darkMode.screens.length - i,
                  filter: `brightness(${1 - 0.5 * d}) blur(${(6 * d * d).toFixed(2)}px)`,
                  boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="block aspect-[750/1624] w-full object-cover object-top" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** UI improvement — side-scroll carousel of 3 screens + autoplay video. */
function Improvement() {
  return (
    <div className="br-container pb-20 pt-16 md:pb-[120px] md:pt-24">
      <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
        {defaults.improvement.eyebrow}
      </span>
      <h3 className="mt-2 text-2xl font-semibold text-[var(--br-ink)] sm:text-[28px]">{defaults.improvement.title}</h3>
      <p className="mt-2 max-w-[60ch] text-[15px] text-[var(--br-muted)] sm:text-base">{defaults.improvement.body}</p>

      {/* Video FIRST and large (matched to the screenshot scale), screens below
          as a supporting row. */}
      <div className="mt-8">
        <ImprovementVideo src={defaults.improvement.video} poster={defaults.improvement.poster} />

        {/* 3 supporting screens, side-scroll on small screens */}
        <div className="-mx-6 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 [scrollbar-width:thin]">
          {defaults.improvement.screens.map((s) => (
            <div
              key={s}
              className="w-[200px] shrink-0 snap-start overflow-hidden rounded-[14%/6.5%] border border-[var(--br-line)] bg-white [box-shadow:var(--br-card-shadow)] md:w-auto"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s} alt="" loading="lazy" className="block aspect-[750/1624] w-full object-cover object-top" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ImprovementVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) el.play().catch(() => {})
          else el.pause()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div className="mx-auto w-[72%] max-w-[340px] overflow-hidden rounded-[14%/6.5%] bg-black shadow-[0_30px_70px_-12px_rgba(0,0,0,0.5)] ring-1 ring-black/10 sm:max-w-[380px]">
      <video ref={ref} className="block aspect-[886/1920] w-full object-cover" src={src} poster={poster} muted loop playsInline controls={false} preload="metadata" />
    </div>
  )
}
