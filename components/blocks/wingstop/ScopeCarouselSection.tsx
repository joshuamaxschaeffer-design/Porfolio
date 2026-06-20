'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { scope as defaults } from './data'

/**
 * SECTION 1 — SCOPE. A large, horizontally draggable carousel of equal-height
 * modules, one per workstream, with labeled jump-pills under the rail. Topic:
 * the scope of everything done across Wingstop's digital presence.
 *
 * Carousel mechanics are lifted from the Panda RewardsPlatformSection (which in
 * turn came from the Baserate problems carousel): native scroll track (momentum
 * + snap on touch), JS 1:1 mouse drag + flick momentum, a JS-measured trailing
 * spacer so the LAST module reaches position 1, and a pager that follows scroll.
 */

const GREEN = '#00843D'
const GREEN_BRIGHT = '#23c265'
// Tighter than before: scope cards are an overview, not a deep-dive — keep them
// dense so they don't read as empty balloons.
const CARD = 'h-[440px] w-[78vw] max-w-[680px] sm:w-[60vw] lg:h-[460px] lg:w-[620px]'

export function ScopeCarouselSection() {
  return (
    <section id="scope" aria-label="Scope of work" className="bg-white">
      <header className="br-container pt-16 md:pt-24">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
          1. {defaults.eyebrow}
        </p>
        <h2 className="mt-3 max-w-[20ch] text-[30px] font-medium uppercase leading-[1.05] text-[var(--br-ink)] md:text-[38px]">
          {defaults.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-base text-[var(--br-muted)] md:text-[19px]">{defaults.intro}</p>
      </header>
      <ScopeCarousel />
    </section>
  )
}

function ScopeCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [spacerW, setSpacerW] = useState(0)
  const labels = defaults.pills

  const RAIL_PAD = 'calc(max(1.5rem, (100vw - 1443px) / 2 + 5rem))'

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

  const measureSpacer = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const cards = el.querySelectorAll<HTMLElement>('[data-card]')
    const last = cards[cards.length - 1]
    if (!last) return
    const cs = getComputedStyle(el)
    const padLeft = parseFloat(cs.paddingLeft) || 0
    const padRight = parseFloat(cs.paddingRight) || 0
    const gap = parseFloat(cs.columnGap) || 0
    const w = el.clientWidth - last.offsetWidth - gap - padLeft - padRight
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
    if (e.pointerType !== 'mouse') return
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
    <div className="mt-10 md:mt-14">
      <div
        ref={trackRef}
        className="br-noscrollbar flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-2 select-none active:cursor-grabbing lg:snap-none"
        style={{ paddingInline: RAIL_PAD, scrollPaddingInline: RAIL_PAD, touchAction: 'pan-x pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {defaults.modules.map((m) => (
          <div key={m.key} data-card className="shrink-0 snap-start lg:snap-align-none">
            <ScopeModule m={m} />
          </div>
        ))}
        <div aria-hidden className="shrink-0" style={{ width: spacerW }} />
      </div>

      {/* jump-pills */}
      <div
        className="br-noscrollbar mx-auto mt-6 flex max-w-[1443px] gap-2 overflow-x-auto px-6 md:px-20"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => scrollToCard(i)}
            aria-current={i === active}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
              i === active
                ? 'border-transparent font-medium text-white'
                : 'border-[var(--br-line)] text-[var(--br-muted)] hover:border-[var(--br-muted-2)] hover:text-[var(--br-ink)]'
            }`}
            style={i === active ? { backgroundColor: GREEN } : undefined}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── module shell + per-workstream visuals ─────────────────────────────────── */

type Mod = (typeof defaults.modules)[number]

function ScopeModule({ m }: { m: Mod }) {
  const green = (m as { tone?: string }).tone === 'green'
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl p-7 sm:p-9 ${CARD} ${
        green
          ? 'text-white [box-shadow:0_20px_50px_-12px_rgba(0,132,61,0.5)]'
          : 'border border-[var(--br-line)] bg-[var(--br-bg-2)] [box-shadow:var(--br-card-shadow)]'
      }`}
      style={green ? { backgroundColor: GREEN } : undefined}
    >
      <header className="max-w-[60ch]">
        <span
          className="br-data text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: green ? 'rgba(255,255,255,0.85)' : GREEN }}
        >
          {m.eyebrow}
        </span>
        <h3
          className={`mt-2 text-2xl font-semibold leading-tight sm:text-[28px] ${
            green ? 'text-white' : 'text-[var(--br-ink)]'
          }`}
        >
          {m.title}
        </h3>
        <p className={`mt-3 text-[15px] leading-relaxed sm:text-base ${green ? 'text-white/85' : 'text-[var(--br-muted)]'}`}>
          {m.body}
        </p>
      </header>
      <div className="relative mt-5 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <ModuleVisual m={m} green={green} />
      </div>
    </article>
  )
}

function ModuleVisual({ m, green }: { m: Mod; green: boolean }) {
  const mm = m as Record<string, unknown>

  // device mockup (MVP, dark-mode UI). The new hero device PNGs already include
  // a phone frame, so render them bare (no extra Phone wrapper) and let them
  // fill the card height.
  if (typeof mm.device === 'string') {
    const framed = (mm.device as string).includes('/hero2/')
    if (framed) {
      // Fill the card: device-home is a tall phone PNG. Push it up so it bleeds
      // off the bottom edge (like Panda's modules) rather than floating small.
      return (
        <div className="absolute inset-x-0 bottom-0 flex justify-center" style={{ top: '-4%' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mm.device as string}
            alt={m.title}
            loading="lazy"
            className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_18px_36px_rgba(0,0,0,0.45)]"
          />
        </div>
      )
    }
    return (
      <div className="absolute inset-x-0 bottom-0 top-[6%] flex justify-center">
        <img
          src={mm.device as string}
          alt={m.title}
          // eslint-disable-next-line @next/next/no-img-element
          className="h-full w-auto max-w-none rounded-[14%/6.5%] object-cover object-top drop-shadow-[0_18px_36px_rgba(0,0,0,0.45)]"
        />
      </div>
    )
  }
  // desktop screen anchored at the bottom (browser frame, like Panda MVP)
  if (typeof mm.desktop === 'string') {
    return (
      <div className="absolute inset-x-2 bottom-0 top-[4%] overflow-hidden rounded-t-xl border border-black/10 bg-white [box-shadow:0_-10px_40px_rgba(0,0,0,0.18)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mm.desktop as string} alt={m.title} loading="lazy" className="block h-full w-full object-cover object-top" />
      </div>
    )
  }
  // emails stacked with perspective
  if (Array.isArray(mm.emails)) {
    return <PerspectiveStack srcs={mm.emails as string[]} green={green} />
  }
  // location/contact pages stacked with perspective
  if (Array.isArray(mm.stacked)) {
    return <PerspectiveStack srcs={mm.stacked as string[]} green={green} />
  }
  // in-store boards side by side
  if (Array.isArray(mm.boards)) {
    return (
      <div className="grid w-full grid-cols-2 items-end gap-4">
        {(mm.boards as string[]).map((b) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={b}
            src={b}
            alt={m.title}
            loading="lazy"
            className="w-full rounded-lg border border-black/10 [box-shadow:0_14px_30px_rgba(0,0,0,0.2)]"
          />
        ))}
      </div>
    )
  }
  // flavor icon mockup grid
  if (Array.isArray(mm.icons)) {
    return (
      <div className="grid w-full max-w-[420px] grid-cols-3 gap-4 pb-2">
        {(mm.icons as string[]).map((ic) => (
          <div
            key={ic}
            className="flex aspect-square items-center justify-center rounded-2xl border border-[var(--br-line)] bg-white [box-shadow:var(--br-card-shadow)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ic} alt="" className="h-12 w-12 object-contain" style={{ filter: `drop-shadow(0 2px 3px rgba(0,0,0,0.15))` }} />
          </div>
        ))}
      </div>
    )
  }
  return null
}

/** Two/three screens stacked with a slight receding perspective. */
function PerspectiveStack({ srcs, green }: { srcs: string[]; green: boolean }) {
  return (
    <div
      className="relative h-full w-full"
      style={{ perspective: '1400px' }}
    >
      {srcs.slice(0, 3).map((s, i) => {
        // gentle fanned overlap, anchored low, filling the card width
        return (
          <div
            key={s}
            className="absolute bottom-0 overflow-hidden rounded-xl border border-black/10 bg-white"
            style={{
              left: `${10 + i * 12}%`,
              bottom: `${-2 - i * 2}%`,
              width: '54%',
              maxHeight: '108%',
              transform: `rotate(${-6 + i * 5}deg)`,
              transformOrigin: 'bottom center',
              zIndex: srcs.length - i,
              boxShadow: green ? '0 18px 40px rgba(0,0,0,0.4)' : '0 18px 40px rgba(0,0,0,0.25)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s} alt="" loading="lazy" className="block w-full object-cover object-top" />
          </div>
        )
      })}
    </div>
  )
}

function Phone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[750/1624] w-full overflow-hidden rounded-[14%/6.5%] bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        loading="lazy"
        className="pointer-events-none h-full w-full object-cover object-top"
      />
    </div>
  )
}
