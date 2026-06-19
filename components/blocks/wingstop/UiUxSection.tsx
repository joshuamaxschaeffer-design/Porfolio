'use client'

import { useEffect, useRef, useState } from 'react'
import { uiux as defaults } from './data'

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

      {/* Module 1 — four flows */}
      <div className="br-container pt-12 md:pt-16">
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
          {defaults.flows.map((flow) => (
            <Flow key={flow.name} flow={flow} />
          ))}
        </div>
      </div>

      {/* Module 2 — dark mode receding stack (black band) */}
      <DarkModeStack />

      {/* Module 3 — UI improvement carousel + video */}
      <Improvement />
    </section>
  )
}

/** A horizontal flow of nodes with arrows; the screen pops up on hover/focus. */
function Flow({ flow }: { flow: { name: string; steps: { src: string; label: string }[] } }) {
  return (
    <div>
      <h3 className="text-[18px] font-semibold text-[var(--br-ink)]">{flow.name}</h3>
      <div className="mt-4 flex items-stretch">
        {flow.steps.map((s, i) => (
          <div key={s.label + i} className="flex items-center">
            <FlowNode step={s} />
            {i < flow.steps.length - 1 && (
              <span aria-hidden className="mx-2 shrink-0 text-[var(--br-muted-2)] sm:mx-3">
                <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
                  <path d="M0 6h22M18 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function FlowNode({ step }: { step: { src: string; label: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="group relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      <div className="flex min-w-[88px] max-w-[110px] flex-col items-center gap-2 rounded-xl border border-[var(--br-line)] bg-[var(--br-bg-2)] px-3 py-3 text-center transition-colors hover:border-[var(--ws-green)] hover:bg-white">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--ws-green)] text-[12px] font-semibold text-white">
          {step.label.charAt(0)}
        </span>
        <span className="text-[12px] leading-tight text-[var(--br-muted)]">{step.label}</span>
      </div>
      {/* hover-revealed screen */}
      <div
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-[150px] -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--br-line)] bg-white opacity-0 shadow-[0_18px_44px_rgba(0,0,0,0.22)] transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={step.src} alt={step.label} loading="lazy" className="block w-full object-cover object-top" style={{ height: open ? 'auto' : 'auto' }} />
      </div>
    </div>
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
      const total = r.height - vh
      setP(reduce ? 0.4 : total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0)
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
  const GAP = 200 + p * 260 // spread grows on scroll

  return (
    <div ref={ref} className="relative mt-16 h-[200vh] bg-[#0a0a0b]">
      <div
        className="ws-dark sticky top-0 h-screen overflow-hidden text-white"
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
            // anchor front card left-center, recede toward top-right vanishing point
            const frontX = 30,
              frontY = 56,
              vpX = 92,
              vpY = 26
            const x = frontX + (vpX - frontX) * (1 - s)
            const y = frontY + (vpY - frontY) * (1 - s)
            const d = z / (200 + 260)
            return (
              <div
                key={src}
                className="absolute overflow-hidden rounded-[14%/6.5%] border border-white/10 bg-black"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: '20%',
                  maxWidth: 230,
                  transform: `translate(-50%,-50%) scale(${s})`,
                  zIndex: defaults.darkMode.screens.length - i,
                  filter: `brightness(${1 - Math.min(0.6, Math.max(0, (d - 0.3) * 0.7))}) blur(${Math.min(8, Math.max(0, (d - 0.6) * 12))}px)`,
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

      <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_minmax(0,300px)] lg:gap-[50px]">
        {/* 3 screens, side-scroll on small screens */}
        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 [scrollbar-width:thin]">
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
        <ImprovementVideo src={defaults.improvement.video} poster={defaults.improvement.poster} />
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
    <div className="mx-auto w-[64%] max-w-[260px] overflow-hidden rounded-[14%/6.5%] bg-black shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/10 lg:mx-0 lg:ml-auto">
      <video ref={ref} className="block aspect-[750/1624] w-full object-cover" src={src} poster={poster} muted loop playsInline controls={false} preload="metadata" />
    </div>
  )
}
