'use client'

import { useEffect, useRef, useState } from 'react'
import { rewardsCapstone as d } from './data'
import { Sparkles } from './Sparkles'

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
      <div className="relative mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        {/* one bounded card so the heading + stats read as a single structured
            unit on the red field, rather than floating loose. */}
        <div className="rounded-[20px] border border-white/25 bg-white/[0.06] px-6 py-12 text-center backdrop-blur-sm sm:px-10 sm:py-14 lg:px-14">
          <Reveal>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-[18ch] text-[32px] font-semibold leading-[1.05] text-white sm:text-[46px]">
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
    </div>
  )
}

/* ═══ OPTION D — Trophy moment (centered hero w/ reveal + radial burst) ═════ */
function OptionD() {
  return (
    <div className="relative isolate w-full overflow-hidden bg-[var(--px-red)] pb-20 pt-4 text-white lg:pb-28">
      {/* full-width header — spans the same column as the desktop screen below */}
      <Reveal className="relative mx-auto w-full max-w-[1080px] px-6 sm:px-8">
        <h2 className="max-w-[20ch] text-[40px] font-semibold leading-[1.03] text-white sm:text-[58px] lg:text-[68px]">
          {d.title}
        </h2>
        <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-white/80 sm:text-xl">{d.body}</p>
        <p className="br-data mt-5 text-sm uppercase tracking-[0.14em]" style={{ color: GOLD }}>
          {d.kicker}
        </p>
        {/* feature list spread wide — up to four columns across the full width */}
        <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {d.features.slice(0, 12).map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[14px] text-white/85 sm:text-[15px]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[var(--px-red)]" style={{ backgroundColor: GOLD }}>
                {CHECK}
              </span>
              {f}
            </li>
          ))}
        </ul>
      </Reveal>

      {/* the program on the big screen too — a desktop redemption view, framed
          in a browser window, closing the "whole program" note on the web. */}
      <Reveal delay={80} className="relative mx-auto mt-14 w-full max-w-[1080px] px-6 sm:px-8 lg:mt-20">
        <figure className="m-0 overflow-hidden rounded-[16px] bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.65)] ring-1 ring-black/10">
          <div className="flex items-center gap-2 border-b border-black/10 bg-neutral-50 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="br-data ml-3 truncate rounded bg-white px-2.5 py-0.5 text-[11px] text-neutral-500">
              pandaexpress.com/rewards
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/panda/rewards/desktop-redemption.webp"
            alt="Panda Rewards redemption on the desktop site — the reward catalog with points and menu rewards"
            loading="lazy"
            className="block w-full"
          />
        </figure>
      </Reveal>
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
