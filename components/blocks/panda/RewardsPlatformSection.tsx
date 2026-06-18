'use client'

import { useEffect, useRef, useState } from 'react'
import { rewardsPlatform as defaults } from './data'

/**
 * REWARDS PLATFORM — the curated beats that follow the Premium Rewards hero on
 * the SAME red field, so Act II reads as one continuous, celebratory chapter:
 *
 *   1. Earning        — three phones showing the points bar fill (0 → 210 → 520)
 *   2. Moments of     — the "Monthly Good Fortune" surprise card + its reveal,
 *      Surprise         with a soft gold glow behind the reveal
 *   3. The Reward     — a points→reward ladder beside the real redeem screen
 *      Store
 *   4. A more native  — short closing note (stored value slots in here later)
 *      experience
 *
 * Register matches the hero: Panda-red ground, white type, gold ('#E8B23A')
 * accents. All screens are real pilot exports (public/panda/rewards) shown in a
 * lightweight phone frame. Responsive: phones stack/scale down < lg; the ladder
 * goes single-column. Reveal-on-scroll is opacity/transform only (cheap), and
 * is disabled under prefers-reduced-motion.
 */

const GOLD = '#E8B23A'

export function RewardsPlatformSection() {
  return (
    <section
      id="rewards-platform"
      aria-label="The rewards platform"
      className="relative isolate w-full overflow-hidden bg-[var(--px-red)] pb-20 pt-4 text-white lg:pb-28"
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        {/* Beat 1 — Earning */}
        <Beat eyebrow={defaults.earn.eyebrow} title={defaults.earn.title} body={defaults.earn.body}>
          <div className="mt-10 flex items-end justify-center gap-4 sm:gap-7">
            {defaults.earn.screens.map((s, i) => (
              <Reveal
                key={s.src}
                delay={i * 90}
                className={[
                  'w-[28%] max-w-[230px] flex-shrink-0',
                  // middle phone sits a touch higher + larger to lead the eye
                  i === 1 ? 'mb-6 w-[31%] sm:mb-9' : 'opacity-95',
                ].join(' ')}
              >
                <Phone src={s.src} alt={s.alt} priority={i === 1} />
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-white/70">
            The points bar fills as orders add up — 0, 210, 520 and on toward the next reward.
          </p>
        </Beat>

        <Divider />

        {/* Beat 2 — Moments of surprise */}
        <Beat
          eyebrow={defaults.surprise.eyebrow}
          title={defaults.surprise.title}
          body={defaults.surprise.body}
        >
          <div className="mt-10 grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10">
            <Reveal className="mx-auto w-[64%] max-w-[260px] md:ml-auto md:mr-0">
              <Phone src={defaults.surprise.card.src} alt={defaults.surprise.card.alt} />
            </Reveal>
            <Reveal delay={120} className="relative mx-auto w-[64%] max-w-[260px] md:ml-0">
              {/* soft gold bloom behind the reveal screen */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-8 -z-10 rounded-full opacity-50 blur-2xl"
                style={{ background: `radial-gradient(circle, ${GOLD}66 0%, transparent 70%)` }}
              />
              <Phone src={defaults.surprise.reveal.src} alt={defaults.surprise.reveal.alt} />
            </Reveal>
          </div>
        </Beat>

        <Divider />

        {/* Beat 3 — The reward store */}
        <Beat eyebrow={defaults.store.eyebrow} title={defaults.store.title} body={defaults.store.body}>
          <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
            {/* ladder */}
            <ol className="order-2 flex flex-col gap-3 lg:order-1">
              {defaults.store.tiers.map((t, i) => (
                <Reveal key={t.points} delay={i * 70}>
                  <li className="flex items-center gap-4 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                    <span
                      className="br-data shrink-0 rounded-md px-2.5 py-1 text-sm font-semibold tabular-nums text-[var(--px-red)]"
                      style={{ backgroundColor: GOLD }}
                    >
                      {t.points}
                    </span>
                    <span className="text-[15px] leading-tight text-white/90">{t.label}</span>
                    <span className="ml-auto hidden text-xs uppercase tracking-wide text-white/45 sm:block">
                      points
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>
            {/* redeem screen */}
            <Reveal delay={120} className="order-1 mx-auto w-[60%] max-w-[260px] lg:order-2 lg:w-full">
              <Phone src={defaults.store.redeem.src} alt={defaults.store.redeem.alt} />
            </Reveal>
          </div>
        </Beat>

        <Divider />

        {/* Beat 4 — native experience (closing note; stored value slots here later) */}
        <Reveal className="mx-auto max-w-[760px] text-center">
          <Eyebrow>{defaults.native.eyebrow}</Eyebrow>
          <h3 className="mt-3 text-2xl font-semibold leading-tight sm:text-[28px]">
            {defaults.native.title}
          </h3>
          <p className="mx-auto mt-4 max-w-[58ch] text-[15px] leading-relaxed text-white/80 sm:text-base">
            {defaults.native.body}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ── building blocks ─────────────────────────────────────────────────────── */

function Beat({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string
  title: string
  body: string
  children: React.ReactNode
}) {
  return (
    <div className="py-12 sm:py-14">
      <Reveal className="max-w-[640px]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="mt-3 text-2xl font-semibold leading-tight sm:text-[30px]">{title}</h3>
        <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-white/80 sm:text-base">
          {body}
        </p>
      </Reveal>
      {children}
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="br-data text-xs font-semibold uppercase tracking-[0.18em]"
      style={{ color: GOLD }}
    >
      {children}
    </span>
  )
}

function Divider() {
  return <div aria-hidden className="mx-auto h-px w-full max-w-[1180px] bg-white/15" />
}

/** A lightweight white phone frame around a bare 750×1624 screen. */
function Phone({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative aspect-[750/1624] w-full overflow-hidden rounded-[14%/6.5%] bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className="h-full w-full object-cover"
      />
    </div>
  )
}

/** Opacity/transform reveal on scroll; static under reduced-motion. */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
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
