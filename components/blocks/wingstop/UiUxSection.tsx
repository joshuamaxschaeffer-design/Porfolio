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
  // Per-card depth gap; a small scroll-linked delta opens the stack slightly.
  const GAP = 150 + p * 70
  const count = defaults.darkMode.screens.length

  return (
    <div className="br-container mt-16">
      {/* ONE big rounded dark CARD (not a full-width band): text on the LEFT,
          the receding device stack on the RIGHT. */}
      <div
        ref={ref}
        className="ws-dark relative grid grid-cols-1 gap-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0b] p-8 text-white [box-shadow:0_30px_80px_-20px_rgba(0,0,0,0.6)] md:p-12 lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)] lg:items-center lg:gap-6"
        style={{ '--ws-green': '#23c265' } as React.CSSProperties}
      >
        {/* LEFT — copy */}
        <div className="lg:py-6">
          <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
            {defaults.darkMode.eyebrow}
          </span>
          <h3 className="mt-2 text-2xl font-semibold text-white sm:text-[28px]">{defaults.darkMode.title}</h3>
          <p className="mt-3 max-w-[44ch] text-[15px] text-white/75 sm:text-base">{defaults.darkMode.body}</p>
        </div>

        {/* RIGHT — receding device stack, confined to this column */}
        <div className="relative h-[58vh] min-h-[420px] w-full lg:h-[62vh]">
          {defaults.darkMode.screens.map((src, i) => {
            const z = i * GAP
            const s = F / (F + z)
            // anchor front card lower-left of THIS column; recede up-and-right.
            const frontX = 30,
              frontY = 60,
              vpX = 78,
              vpY = 34
            const x = frontX + (vpX - frontX) * (1 - s)
            const y = frontY + (vpY - frontY) * (1 - s)
            const d = count > 1 ? i / (count - 1) : 0
            return (
              <div
                key={src}
                className="absolute overflow-hidden rounded-[14%/6.5%] border border-white/10 bg-black"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: '42%',
                  maxWidth: 320,
                  transform: `translate(-50%,-50%) scale(${s})`,
                  zIndex: count - i,
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

/** UI improvement — one horizontal row of FOUR phones: the autoplay video on
 *  the far LEFT, then the three usability screens. They share a height and read
 *  as a single before/after-style sequence. On small screens the row scrolls
 *  horizontally instead of squashing. */
function Improvement() {
  return (
    <div className="br-container pb-20 pt-16 md:pb-[120px] md:pt-24">
      <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
        {defaults.improvement.eyebrow}
      </span>
      <h3 className="mt-2 text-2xl font-semibold text-[var(--br-ink)] sm:text-[28px]">{defaults.improvement.title}</h3>
      <p className="mt-2 max-w-[60ch] text-[15px] text-[var(--br-muted)] sm:text-base">{defaults.improvement.body}</p>

      {/* All four in one row, video first. Each phone is a flex item with a
          shared basis so they line up; the row scrolls on small screens. */}
      <div className="-mx-6 mt-8 flex items-end gap-5 overflow-x-auto px-6 pb-10 md:mx-0 md:gap-6 md:px-0 lg:overflow-visible lg:pb-3 [scrollbar-width:thin]">
        <div className="w-[200px] shrink-0 sm:w-[230px] md:w-auto md:flex-1">
          <ImprovementVideo src={defaults.improvement.video} poster={defaults.improvement.poster} />
        </div>
        {defaults.improvement.screens.map((s) => (
          <div key={s} className="w-[200px] shrink-0 sm:w-[230px] md:w-auto md:flex-1">
            <div className="overflow-hidden rounded-[14%/6.5%] border border-[var(--br-line)] bg-white [box-shadow:var(--br-card-shadow)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s} alt="" loading="lazy" className="block aspect-[750/1624] w-full object-cover object-top" />
            </div>
          </div>
        ))}
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
    <div className="overflow-hidden rounded-[14%/6.5%] bg-black shadow-[0_30px_70px_-12px_rgba(0,0,0,0.5)] ring-1 ring-black/10">
      <video ref={ref} className="block aspect-[750/1624] w-full object-cover" src={src} poster={poster} muted loop playsInline controls={false} preload="metadata" />
    </div>
  )
}
