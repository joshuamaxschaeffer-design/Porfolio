'use client'

import { useEffect, useRef, useState } from 'react'
import { rewardsCapstone as d } from './data'
import { Sparkles } from './Sparkles'
import { RewardsRadial } from './RewardsRadial'

/**
 * REWARDS CAPSTONE — a celebratory close to the Rewards Program chapter:
 * "look at this fun program and everything we built into it." Sits on the red
 * field after the rewards carousel, keeps the gold/sparkle register.
 *
 * FOUR layout OPTIONS are stacked here for review (each preceded by an
 * "OPTION A/B/C/D" label). Pick one, strip the rest:
 *   A · Feature grid   — gold-checked capability cards, sparkles overhead.
 *   B · By the numbers  — big count-up stats of what was built.
 *   C · Feature marquee — animated scrolling rows of every reward perk.
 *   D · Trophy moment   — centered hero: headline + Good Fortune reveal +
 *                         radial burst + a compact feature list.
 */

const GOLD = '#E8B23A'
const CHECK = (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function RewardsCapstoneSection() {
  return (
    <section id="rewards-capstone" aria-label="The whole rewards program" className="w-full">
      <OptionB />
      <OptionD />
    </section>
  )
}

/* ═══ OPTION B — By the numbers (count-up stats) ════════════════════════════ */
function OptionB() {
  return (
    <div className="relative isolate w-full overflow-hidden bg-[var(--px-red)] pb-12 pt-20 text-white lg:pb-16 lg:pt-28">
      <Sparkles />
      <div className="relative mx-auto w-full max-w-[1180px] px-6 text-center sm:px-8">
        <Reveal>
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <h2 className="mx-auto mt-3 max-w-[18ch] text-[32px] font-semibold leading-[1.05] sm:text-[46px]">
            A whole lot of program.
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {d.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div>
                <CountUp value={s.value} suffix={s.suffix} />
                <div className="mt-2 text-sm uppercase tracking-wide text-white/70">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══ OPTION D — Trophy moment (centered hero w/ reveal + radial burst) ═════ */
function OptionD() {
  return (
    <div className="relative isolate w-full overflow-hidden bg-[var(--px-red)] pb-20 pt-4 text-white lg:pb-28">
      <div className="relative mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* copy */}
        <Reveal>
          <h2 className="text-[34px] font-semibold leading-[1.04] sm:text-[52px]">{d.title}</h2>
          <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-white/80 sm:text-lg">{d.body}</p>
          <p className="br-data mt-5 text-sm uppercase tracking-[0.14em]" style={{ color: GOLD }}>
            {d.kicker}
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {d.features.slice(0, 8).map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[14px] text-white/85">
                <span className="flex h-5 w-5 items-center justify-center rounded-full text-[var(--px-red)]" style={{ backgroundColor: GOLD }}>
                  {CHECK}
                </span>
                {f}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* the Good Fortune reveal screen bursting from a radial */}
        <Reveal delay={120}>
          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <RewardsRadial className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
            <div className="absolute left-1/2 top-1/2 z-10 w-[46%] -translate-x-1/2 -translate-y-1/2">
              <div className="overflow-hidden rounded-[14%/6.5%] bg-white shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)] ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/panda/rewards/good-fortune-awaits.webp" alt="Good Fortune reward reveal" loading="lazy" className="block w-full" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="br-data text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
      {children}
    </span>
  )
}

/** Count-up number that animates when scrolled into view. */
function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setN(value)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            io.disconnect()
            const dur = 1100
            const start = performance.now()
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / dur)
              const eased = 1 - Math.pow(1 - p, 3)
              setN(Math.round(value * eased))
              if (p < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value])
  return (
    <div ref={ref} className="text-[56px] font-semibold leading-none tabular-nums sm:text-[72px]">
      {n}
      {suffix ? <span style={{ color: GOLD }}>{suffix}</span> : null}
    </div>
  )
}

/** Opacity/transform reveal on scroll; static under reduced-motion. */
function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(18px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
