'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { rewardsPlatform as defaults } from './data'

/**
 * REWARDS PLATFORM — the rewards story that follows the Premium Rewards hero on
 * the SAME red field. The three core beats live in a LARGE, horizontally
 * draggable / scrollable carousel of equal-height modules (Earning · Moments of
 * Surprise · The Reward Store), with labeled jump-pills under the rail. A short
 * native-experience note closes the band.
 *
 * Carousel mechanics are adapted from the Baserate "problems" carousel
 * (components/blocks/baserate/ChallengeSection.tsx): a NATIVE scroll track
 * (momentum + snap on touch), JS 1:1 drag + flick momentum on mouse, a trailing
 * spacer so even the LAST module can scroll fully left to position 1, and a
 * pager whose active state follows scroll position. Reduced-motion safe (native
 * scroll always works; the JS drag only enhances mouse).
 */

const GOLD = '#E8B23A'
const CARD_H = 'lg:h-[640px]' // equal height across all modules on desktop

export function RewardsPlatformSection() {
  return (
    <section
      id="rewards-platform"
      aria-label="The rewards platform"
      className="relative isolate w-full overflow-hidden bg-[var(--px-red)] pb-20 pt-4 text-white lg:pb-24"
    >
      {/* Section title — sits above the carousel, aligned to the editorial
          column (max-w-1180 + px-8) so it lines up with the rail and pills. */}
      <header className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <span className="br-data text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
          {defaults.eyebrow}
        </span>
        <h2 className="mt-2 text-[32px] font-semibold leading-tight sm:text-[40px]">{defaults.heading}</h2>
      </header>

      {/* The Premium Rewards hero above is the section banner; here the cards
          carry the story. A draggable carousel of large modules + jump-pills. */}
      <RewardsCarousel />
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * Carousel — native-scroll track + JS mouse-drag w/ flick momentum + jump-pills.
 * (Pattern adapted from baserate/ChallengeSection.) A trailing spacer lets the
 * last module scroll all the way to the left (position 1). `active` tracks the
 * module nearest the left content edge for the pills.
 * ───────────────────────────────────────────────────────────────────────── */
function RewardsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  // trailing-spacer width, measured so the LAST module stops exactly at
  // position 1 (its left edge at the rail) with no empty over-scroll past it.
  const [spacerW, setSpacerW] = useState(0)

  const modules = [<EarnModule key="earn" />, <SurpriseModule key="surprise" />, <StoreModule key="store" />]
  const labels = defaults.pills

  // left padding so the rail aligns with the editorial column (max-w-1180 + px-8)
  const RAIL_PAD = 'calc(max(1.5rem, (100vw - 1180px) / 2 + 2rem))'

  const drag = useRef({
    down: false,
    moved: false,
    startX: 0,
    startScroll: 0,
    targetScroll: 0,
    samples: [] as { x: number; t: number }[],
  })
  const momentumRaf = useRef<number | null>(null)
  const dragRaf = useRef<number | null>(null)

  const stopMomentum = useCallback(() => {
    if (momentumRaf.current != null) {
      cancelAnimationFrame(momentumRaf.current)
      momentumRaf.current = null
    }
  }, [])

  const startMomentum = useCallback(
    (v0: number) => {
      const el = trackRef.current
      if (!el) return
      stopMomentum()
      let v = v0
      let last = performance.now()
      const DECAY = 0.0025
      const MIN_V = 0.015
      const stepFn = (now: number) => {
        const dt = Math.min(40, now - last)
        last = now
        el.scrollLeft -= v * dt
        v *= Math.exp(-DECAY * dt)
        const atEdge = el.scrollLeft <= 0 || el.scrollLeft >= el.scrollWidth - el.clientWidth - 1
        if (Math.abs(v) < MIN_V || atEdge) {
          momentumRaf.current = null
          return
        }
        momentumRaf.current = requestAnimationFrame(stepFn)
      }
      momentumRaf.current = requestAnimationFrame(stepFn)
    },
    [stopMomentum],
  )

  const updateActive = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0
    const children = Array.from(el.querySelectorAll<HTMLElement>('[data-card]'))
    let nearest = 0
    let best = Infinity
    children.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - (el.scrollLeft + padLeft))
      if (d < best) {
        best = d
        nearest = i
      }
    })
    setActive(nearest)
  }, [])

  // Size the trailing spacer so max-scroll lands the LAST module at position 1:
  // remaining viewport to the right of a left-aligned last card = clientWidth
  // − padLeft − lastCardWidth. That exact fill makes the scroll hit a wall with
  // the last card at the rail (no empty over-scroll). 0 when content fits.
  const measureSpacer = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const cards = el.querySelectorAll<HTMLElement>('[data-card]')
    const last = cards[cards.length - 1]
    if (!last) return
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0
    const w = el.clientWidth - padLeft - last.offsetWidth
    setSpacerW(Math.max(0, Math.round(w)))
  }, [])

  useEffect(() => {
    updateActive()
    measureSpacer()
    const el = trackRef.current
    if (!el) return
    const onResize = () => {
      measureSpacer()
      updateActive()
    }
    el.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', onResize)
    // re-measure once images/fonts settle the card width
    const t = window.setTimeout(measureSpacer, 250)
    return () => {
      el.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(t)
    }
  }, [updateActive, measureSpacer])

  useEffect(() => () => stopMomentum(), [stopMomentum])
  useEffect(
    () => () => {
      if (dragRaf.current != null) cancelAnimationFrame(dragRaf.current)
    },
    [],
  )

  const scrollToCard = useCallback((i: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('[data-card]')[i]
    if (!card) return
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0
    el.scrollTo({ left: card.offsetLeft - padLeft, behavior: 'smooth' })
  }, [])

  const dragTick = useCallback(() => {
    const el = trackRef.current
    if (el && drag.current.down) {
      el.scrollLeft = drag.current.targetScroll
      dragRaf.current = requestAnimationFrame(dragTick)
    } else {
      dragRaf.current = null
    }
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (!el) return
    if (e.pointerType !== 'mouse') return // touch scrolls natively
    stopMomentum()
    const now = performance.now()
    drag.current = {
      down: true,
      moved: false,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      targetScroll: el.scrollLeft,
      samples: [{ x: e.clientX, t: now }],
    }
    el.setPointerCapture(e.pointerId)
    if (dragRaf.current == null) dragRaf.current = requestAnimationFrame(dragTick)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    drag.current.targetScroll = drag.current.startScroll - dx
    const now = performance.now()
    const s = drag.current.samples
    s.push({ x: e.clientX, t: now })
    while (s.length > 2 && now - s[0].t > 120) s.shift()
  }
  const endDrag = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (el) {
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {}
    }
    const wasDown = drag.current.down
    drag.current.down = false
    if (dragRaf.current != null) {
      cancelAnimationFrame(dragRaf.current)
      dragRaf.current = null
    }
    if (wasDown && el) {
      const s = drag.current.samples
      const now = performance.now()
      const first = s[0]
      const last = s[s.length - 1]
      const dt = last.t - first.t
      const vx = dt > 0 ? (last.x - first.x) / dt : 0
      if (now - last.t < 90 && Math.abs(vx) > 0.05) startMomentum(vx)
    }
  }

  return (
    <div className="mt-10">
      <div
        ref={trackRef}
        className="br-noscrollbar flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-2 select-none active:cursor-grabbing lg:snap-none"
        style={{ paddingInline: RAIL_PAD, scrollPaddingInline: RAIL_PAD, touchAction: 'pan-x pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {modules.map((m, i) => (
          <div key={i} data-card className="shrink-0 snap-start lg:snap-align-none">
            {m}
          </div>
        ))}
        {/* trailing spacer, JS-measured (measureSpacer) to exactly the gap that
            lets the LAST module stop at position 1 — its left edge at the rail —
            with no empty over-scroll past it. */}
        <div aria-hidden className="shrink-0" style={{ width: spacerW }} />
      </div>

      {/* jump-pills with labels */}
      <div className="br-noscrollbar mx-auto mt-6 flex max-w-[1180px] gap-2 overflow-x-auto px-6 sm:px-8" style={{ touchAction: 'pan-x pan-y' }}>
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => scrollToCard(i)}
            aria-current={i === active}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
              i === active
                ? 'border-transparent font-medium text-[var(--px-red)]'
                : 'border-white/35 text-white/75 hover:border-white/60 hover:text-white'
            }`}
            style={i === active ? { backgroundColor: GOLD } : undefined}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── the three large modules (same content; equal height) ─────────────────── */

/** Shared shell: a large bordered card on the red field, fixed slide width + equal height. */
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
    <article className={`flex w-[86vw] max-w-[920px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/[0.06] p-7 backdrop-blur-sm sm:w-[78vw] sm:p-9 lg:w-[820px] ${CARD_H}`}>
      <header className="max-w-[60ch]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="mt-2 text-2xl font-semibold leading-tight sm:text-[30px]">{title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-white/80 sm:text-base">{body}</p>
      </header>
      <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">
        <div className="w-full">{children}</div>
      </div>
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
            className={['w-[22%] max-w-[150px] flex-shrink-0', i === 1 ? 'mb-5 w-[25%] max-w-[168px] sm:mb-7' : 'opacity-95'].join(' ')}
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
        <div className="mx-auto w-[48%] max-w-[172px] sm:ml-auto sm:mr-0">
          <Phone src={d.card.src} alt={d.card.alt} />
        </div>
        <div className="relative mx-auto w-[48%] max-w-[172px] sm:ml-0">
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
      <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[minmax(0,1fr)_200px] sm:gap-10">
        <ol className="order-2 flex flex-col gap-2 sm:order-1">
          {d.tiers.map((t) => (
            <li
              key={t.points}
              className="flex items-center gap-4 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-2"
            >
              <span
                className="br-data shrink-0 rounded-md px-2.5 py-1 text-sm font-semibold tabular-nums text-[var(--px-red)]"
                style={{ backgroundColor: GOLD }}
              >
                {t.points}
              </span>
              <span className="text-[15px] leading-tight text-white/90">{t.label}</span>
              <span className="ml-auto hidden text-xs uppercase tracking-wide text-white/45 sm:block">points</span>
            </li>
          ))}
        </ol>
        <div className="order-1 mx-auto w-[46%] max-w-[172px] sm:order-2 sm:w-full sm:max-w-[180px]">
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
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
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
