'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { rewardsPlatform as defaults } from './data'

/**
 * REWARDS PLATFORM — the rewards story that follows the Premium Rewards hero on
 * the SAME red field. The three core beats now live in a LARGE, horizontally
 * DRAGGABLE carousel (Earning · Moments of Surprise · The Reward Store), each a
 * big module on the red ground. A short native-experience note closes the band.
 *
 *   carousel  → drag-x with inertia + elastic ends (motion), measured
 *               constraints; reduced-motion / no-JS falls back to a native
 *               horizontal-scroll rail with snap. A hint + progress dots sit
 *               under the rail.
 *
 * Register matches the hero: Panda-red ground, white type, gold ('#E8B23A')
 * accents. Screens are real pilot exports (public/panda/rewards) in a light
 * phone frame. Modules keep all their original content.
 */

const GOLD = '#E8B23A'

export function RewardsPlatformSection() {
  return (
    <section
      id="rewards-platform"
      aria-label="The rewards platform"
      className="relative isolate w-full overflow-hidden bg-[var(--px-red)] pb-20 pt-6 text-white lg:pb-28"
    >
      {/* section intro */}
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        <Reveal className="max-w-[640px]">
          <span className="br-data text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
            INSIDE THE PROGRAM
          </span>
          <h3 className="mt-3 text-2xl font-semibold leading-tight sm:text-[30px]">
            Earn, get surprised, redeem
          </h3>
          <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-white/80 sm:text-base">
            Three pieces make the loyalty loop work. Drag to move through them.
          </p>
        </Reveal>
      </div>

      {/* draggable carousel of the three large modules */}
      <RewardsCarousel />

      {/* closing note — a more native experience (stored value slots here later) */}
      <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
        <div aria-hidden className="mx-auto mt-4 mb-14 h-px w-full bg-white/15" />
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

/* ─────────────────────────────────────────────────────────────────────────
 * Carousel — drag-x rail of three large modules. Inertia + elastic ends via
 * motion; constraints measured from track vs viewport. Reduced-motion → native
 * scroll-snap rail. Active-dot tracking from the dragged x (or scrollLeft).
 * ───────────────────────────────────────────────────────────────────────── */
function RewardsCarousel() {
  const reduce = useReducedMotion()
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [constraint, setConstraint] = useState(0)
  const [active, setActive] = useState(0)

  const modules = [
    <EarnModule key="earn" />,
    <SurpriseModule key="surprise" />,
    <StoreModule key="store" />,
  ]

  useEffect(() => {
    const measure = () => {
      const vp = viewport.current?.offsetWidth ?? 0
      const tw = track.current?.scrollWidth ?? 0
      setConstraint(Math.max(0, tw - vp))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // active dot from dragged offset (motion) or scrollLeft (reduced-motion rail)
  const updateActiveFromX = (x: number) => {
    const first = track.current?.children?.[0] as HTMLElement | undefined
    const step = first ? first.offsetWidth + 24 /* gap */ : 1
    setActive(Math.max(0, Math.min(modules.length - 1, Math.round(-x / step))))
  }

  // Left padding so the rail starts aligned with the editorial column.
  const RAIL_PAD = 'max(1.5rem, calc((100vw - 1180px) / 2 + 2rem))'

  if (reduce) {
    return (
      <div className="mt-10">
        <div
          ref={viewport}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
          style={{ paddingInline: RAIL_PAD, scrollPaddingInline: RAIL_PAD }}
          onScroll={(e) => updateActiveFromX(-(e.currentTarget.scrollLeft))}
        >
          {modules.map((m, i) => (
            <div key={i} className="snap-start">
              {m}
            </div>
          ))}
        </div>
        <RailFooter active={active} count={modules.length} />
      </div>
    )
  }

  return (
    <div className="mt-10">
      <div ref={viewport} className="overflow-hidden" style={{ paddingInline: RAIL_PAD }}>
        <motion.div
          ref={track}
          className="flex w-max cursor-grab gap-6 active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -constraint, right: 0 }}
          dragElastic={0.1}
          dragTransition={{ power: 0.3, timeConstant: 320, bounceStiffness: 280, bounceDamping: 40 }}
          onUpdate={(latest) => {
            const x = typeof latest.x === 'number' ? latest.x : parseFloat(String(latest.x)) || 0
            updateActiveFromX(x)
          }}
        >
          {modules.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </motion.div>
      </div>
      <RailFooter active={active} count={modules.length} />
    </div>
  )
}

function RailFooter({ active, count }: { active: number; count: number }) {
  return (
    <div className="mx-auto mt-5 flex w-full max-w-[1180px] items-center justify-between px-6 sm:px-8">
      <span className="br-data text-[11px] uppercase tracking-[0.16em] text-white/55">
        Drag to explore →
      </span>
      <div className="flex gap-2" aria-hidden>
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === active ? 22 : 8,
              backgroundColor: i === active ? GOLD : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ── the three large modules (same content as before) ─────────────────────── */

/** Shared shell: a large bordered card on the red field, fixed slide width. */
function Module({
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
    <article className="flex w-[86vw] max-w-[920px] shrink-0 select-none flex-col rounded-2xl border border-white/20 bg-white/[0.06] p-7 backdrop-blur-sm sm:w-[78vw] sm:p-9 lg:w-[820px]">
      <header className="max-w-[60ch]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="mt-2 text-2xl font-semibold leading-tight sm:text-[30px]">{title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-white/80 sm:text-base">{body}</p>
      </header>
      <div className="mt-7 flex-1">{children}</div>
    </article>
  )
}

function EarnModule() {
  const d = defaults.earn
  return (
    <Module eyebrow={d.eyebrow} title={d.title} body={d.body}>
      <div className="flex items-end justify-center gap-4 sm:gap-7">
        {d.screens.map((s, i) => (
          <div
            key={s.src}
            className={[
              'w-[28%] max-w-[210px] flex-shrink-0',
              i === 1 ? 'mb-6 w-[31%] sm:mb-9' : 'opacity-95',
            ].join(' ')}
          >
            <Phone src={s.src} alt={s.alt} priority={i === 1} />
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-white/65">
        The points bar fills as orders add up — 0, 210, 520 and on toward the next reward.
      </p>
    </Module>
  )
}

function SurpriseModule() {
  const d = defaults.surprise
  return (
    <Module eyebrow={d.eyebrow} title={d.title} body={d.body}>
      <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:gap-10">
        <div className="mx-auto w-[58%] max-w-[230px] sm:ml-auto sm:mr-0">
          <Phone src={d.card.src} alt={d.card.alt} />
        </div>
        <div className="relative mx-auto w-[58%] max-w-[230px] sm:ml-0">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-full opacity-60 blur-2xl"
            style={{ background: `radial-gradient(circle, ${GOLD}77 0%, transparent 70%)` }}
          />
          <Phone src={d.reveal.src} alt={d.reveal.alt} />
        </div>
      </div>
    </Module>
  )
}

function StoreModule() {
  const d = defaults.store
  return (
    <Module eyebrow={d.eyebrow} title={d.title} body={d.body}>
      <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-10">
        <ol className="order-2 flex flex-col gap-2.5 sm:order-1">
          {d.tiers.map((t) => (
            <li
              key={t.points}
              className="flex items-center gap-4 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-2.5"
            >
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
          ))}
        </ol>
        <div className="order-1 mx-auto w-[56%] max-w-[220px] sm:order-2 sm:w-full">
          <Phone src={d.redeem.src} alt={d.redeem.alt} />
        </div>
      </div>
    </Module>
  )
}

/* ── building blocks ─────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="br-data text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
      {children}
    </span>
  )
}

/** A lightweight white phone frame around a bare 750×1624 screen. */
function Phone({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative aspect-[750/1624] w-full overflow-hidden rounded-[14%/6.5%] bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        className="pointer-events-none h-full w-full object-cover"
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
