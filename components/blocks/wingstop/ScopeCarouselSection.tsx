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
// Bigger, more confident cards (the page read too timid/small vs. the Samsung
// + Baserate bar). Taller + wider so the visuals can be large and own the card.
const CARD = 'h-[560px] w-[84vw] max-w-[820px] sm:w-[70vw] lg:h-[580px] lg:w-[760px]'

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
      if (pillRaf.current != null) cancelAnimationFrame(pillRaf.current)
    },
    [],
  )

  const pillRaf = useRef<number | null>(null)
  const scrollToCard = useCallback(
    (i: number) => {
      const el = trackRef.current
      if (!el) return
      const card = el.querySelectorAll<HTMLElement>('[data-card]')[i]
      if (!card) return
      // Stop any drag momentum so it doesn't fight the jump.
      stopMomentum()
      if (pillRaf.current != null) cancelAnimationFrame(pillRaf.current)
      const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0
      const maxLeft = el.scrollWidth - el.clientWidth
      const to = Math.max(0, Math.min(maxLeft, card.offsetLeft - padLeft))
      // Manual rAF tween on scrollLeft. We do NOT use scrollTo({behavior:'smooth'}):
      // Lenis ships lenis.css which forces scroll-behavior:auto globally, so the
      // native smooth jump is a no-op. Driving scrollLeft directly is Lenis-safe.
      const from = el.scrollLeft
      const dist = to - from
      if (Math.abs(dist) < 1) return
      const dur = Math.min(620, 240 + Math.abs(dist) * 0.5)
      const start = performance.now()
      const ease = (t: number) => 1 - Math.pow(1 - t, 3) // easeOutCubic
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / dur)
        el.scrollLeft = from + dist * ease(p)
        if (p < 1) {
          pillRaf.current = requestAnimationFrame(step)
        } else {
          pillRaf.current = null
        }
      }
      pillRaf.current = requestAnimationFrame(step)
    },
    [stopMomentum],
  )

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
    <div className="mt-10 pb-16 md:mt-14 md:pb-24">
      <div
        ref={trackRef}
        className="br-noscrollbar flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pt-3 pb-14 select-none active:cursor-grabbing lg:snap-none"
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
      {/* Visual zone: the mockup sits LARGE and grounded at the card bottom so
          the card reads full and confident (no floating-in-empty-space). Always
          shown whole, never cropped mid-content. */}
      <div className="relative mt-4 flex min-h-0 flex-1 items-end justify-center">
        <ModuleVisual m={m} green={green} />
      </div>
    </article>
  )
}

function ModuleVisual({ m, green }: { m: Mod; green: boolean }) {
  const mm = m as Record<string, unknown>

  // PHONE FAN — multiple screens (e.g. dark mode): a hero phone center with a
  // stepped-back peek on each side, all framed + grounded at the card floor.
  if (Array.isArray(mm.devices)) {
    const screens = mm.devices as string[]
    return (
      <div className="relative flex h-full w-full items-end justify-center pb-1">
        {screens[1] && (
          <div
            className="absolute bottom-2 h-[78%]"
            style={{ aspectRatio: '750 / 1624', transform: 'translateX(-62%) rotate(-7deg)' }}
          >
            <Phone src={screens[1]} alt={m.title} dim />
          </div>
        )}
        {screens[2] && (
          <div
            className="absolute bottom-2 h-[78%]"
            style={{ aspectRatio: '750 / 1624', transform: 'translateX(62%) rotate(7deg)' }}
          >
            <Phone src={screens[2]} alt={m.title} dim />
          </div>
        )}
        <div className="relative z-10 h-full max-h-[360px]" style={{ aspectRatio: '750 / 1624' }}>
          <Phone src={screens[0]} alt={m.title} />
        </div>
      </div>
    )
  }

  // PHONE mockup (MVP hero device, dark-mode UI). Show the device whole, at a
  // controlled height, sitting on the card floor. The /hero2 PNGs already have
  // a frame; bare screens get a Phone frame. Either way it FITS, no clipping.
  if (typeof mm.device === 'string') {
    const framed = (mm.device as string).includes('/hero2/')
    if (framed) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mm.device as string}
          alt={m.title}
          loading="eager"
          className="h-full max-h-[360px] w-auto object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
        />
      )
    }
    return (
      <div className="h-full max-h-[360px]" style={{ aspectRatio: '750 / 1624' }}>
        <Phone src={mm.device as string} alt={m.title} />
      </div>
    )
  }

  // DESKTOP: the real full-COLOR desktop page shown whole (no browser chrome).
  // It's a tall page, so it sits grounded at the card floor and we reveal the
  // top. Kept a touch SMALLER (max-w-[460px]) so it always clears the card's
  // title/intro above it — no overlap.
  if (typeof mm.desktop === 'string') {
    return (
      <div className="w-full max-w-[460px] overflow-hidden rounded-xl [box-shadow:0_22px_48px_rgba(0,0,0,0.28)]">
        <div className="aspect-[16/11] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mm.desktop as string} alt={m.title} loading="eager" className="block w-full object-cover object-top" />
        </div>
      </div>
    )
  }

  // EMAILS: tall captures — a tidy overlapping stack of tall thumbnails reads
  // right (they're meant to be tall).
  if (Array.isArray(mm.emails)) return <ThumbStack srcs={mm.emails as string[]} green={green} />
  // WEB PAGES (location / finder): these source captures are extremely tall full
  // pages, so a tall crop is mostly empty white. Show them as fanned BROWSER
  // WINDOWS cropped to a clean 16:10 of the top, where the actual content lives.
  if (Array.isArray(mm.stacked)) return <WindowStack srcs={mm.stacked as string[]} />

  // IN-STORE boards side by side. The source boards are 9:16 (900×1600), so each
  // sits in a matching 9:16 frame and fills it edge-to-edge (no letterbox / no
  // wrong-ratio box). Centered as a pair, grounded at the card floor.
  if (Array.isArray(mm.boards)) {
    return (
      <div className="flex h-full w-full items-end justify-center gap-4 pb-1">
        {(mm.boards as string[]).map((b) => (
          <div
            key={b}
            className="h-full max-h-[380px] overflow-hidden rounded-lg border border-black/10 [box-shadow:0_14px_30px_rgba(0,0,0,0.2)]"
            style={{ aspectRatio: '9 / 16' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b} alt={m.title} loading="eager" className="block h-full w-full object-cover" />
          </div>
        ))}
      </div>
    )
  }

  // FLAVOR icon grid — Joshua's own designed flavor icons (green badge + white
  // glyph). They're complete badges, so they sit on the card directly (no white
  // tile) at a confident size with a soft lift.
  if (Array.isArray(mm.icons)) {
    return (
      <div className="grid w-full max-w-[380px] grid-cols-3 gap-5 pb-2">
        {(mm.icons as string[]).map((ic) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={ic}
            src={ic}
            alt=""
            loading="eager"
            className="aspect-square w-full object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)]"
          />
        ))}
      </div>
    )
  }
  return null
}

/** A tidy overlapping stack of small thumbnails (emails / pages). */
function ThumbStack({ srcs, green }: { srcs: string[]; green: boolean }) {
  const shots = srcs.slice(0, 3)
  return (
    <div className="relative h-[380px] w-full">
      {shots.map((s, i) => (
        <div
          key={s}
          className="absolute left-1/2 top-1/2 w-[185px] overflow-hidden rounded-xl border border-black/10 bg-white"
          style={{
            transform: `translate(calc(-50% + ${(i - 1) * 62}px), calc(-50% + ${(i - 1) * 14}px)) rotate(${(i - 1) * 6}deg)`,
            zIndex: i,
            boxShadow: green ? '0 18px 40px rgba(0,0,0,0.42)' : '0 18px 40px rgba(0,0,0,0.26)',
          }}
        >
          <div className="h-[340px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s} alt="" loading="eager" className="block w-full object-cover object-top" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Fanned browser-window thumbnails — for very tall full-page web captures that
 *  would otherwise crop to empty white. Each is a clean 16:10 of the page top.
 *  Windows are LARGE (~2× the old size) so the pages read clearly; the fan
 *  offsets stay modest so the trio still fits the card. */
function WindowStack({ srcs }: { srcs: string[] }) {
  const shots = srcs.slice(0, 3)
  return (
    <div className="relative h-full max-h-[420px] w-full">
      {shots.map((s, i) => (
        <div
          key={s}
          className="absolute left-1/2 top-1/2 w-[78%] max-w-[480px] overflow-hidden rounded-lg border border-black/10 bg-white"
          style={{
            transform: `translate(calc(-50% + ${(i - 1) * 34}px), calc(-50% + ${(i - 1) * 30}px)) rotate(${(i - 1) * 3}deg)`,
            zIndex: i,
            boxShadow: '0 18px 40px rgba(0,0,0,0.24)',
          }}
        >
          <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#f3f3f5] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-black/15" />
            <span className="h-2 w-2 rounded-full bg-black/15" />
            <span className="h-2 w-2 rounded-full bg-black/15" />
          </div>
          <div className="aspect-[16/10] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s} alt="" loading="eager" className="block w-full object-cover object-top" />
          </div>
        </div>
      ))}
    </div>
  )
}

function Phone({ src, alt, dim = false }: { src: string; alt: string; dim?: boolean }) {
  // Match the framed device used in the App section: dark bezel + notch so it
  // reads as hardware, not a bare rounded screenshot.
  return (
    <div
      className={`relative h-full w-full rounded-[15%/7%] bg-[#0c0d0d] p-[3.5%] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 ${
        dim ? 'brightness-[0.82] saturate-[0.92]' : ''
      }`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[12%/6%] bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          loading="eager"
          className="pointer-events-none h-full w-full object-cover object-top"
        />
      </div>
      <div className="absolute left-1/2 top-[3.5%] h-[1.6%] w-[34%] -translate-x-1/2 rounded-full bg-[#0c0d0d]" />
    </div>
  )
}
