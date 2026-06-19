'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { marketing as defaults } from './data'

/**
 * THE BRAND ONLINE — marketing-site workstream, on a near-BLACK ground so it
 * reads distinctly from the white/red sections around it. It's the brand site,
 * so it's the most aesthetic section: large food cutouts, big type, page comps.
 *
 * THREE LAYOUT OPTIONS are stacked here for review (each preceded by an
 * "OPTION A/B/C" label). Same content, different treatments:
 *   A · Gallery   — draggable browser-frame gallery of page comps + live link.
 *   B · Food bento — asymmetric image-led grid (big food cutouts + page comps).
 *   C · Editorial  — full-bleed alternating rows, big food, magazine feel.
 * Pick one and the others get stripped.
 *
 * Food cutouts: public/panda/marketing/food/*.webp. Page comps: .../ux/*.webp.
 */

const FOOD = '/panda/marketing/food'
const UX = '/panda/marketing/ux'
const INK = '#0d0d0f' // section ground

export function MarketingSection() {
  return (
    <section
      id="marketing"
      aria-label="The brand online — marketing site"
      className="relative w-full text-white"
      style={{ backgroundColor: INK }}
    >
      <OptionA />
      <OptionLabel letter="B" name="Food bento" />
      <OptionB />
      <OptionLabel letter="C" name="Editorial" />
      <OptionC />
    </section>
  )
}

/* A small banner between options so Joshua can tell them apart while reviewing. */
function OptionLabel({ letter, name }: { letter: string; name: string }) {
  return (
    <div className="mx-auto flex w-full max-w-[1100px] items-center gap-3 px-6 py-6 sm:px-8">
      <span className="br-data rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">
        Option {letter}
      </span>
      <span className="br-data text-xs uppercase tracking-[0.18em] text-white/40">{name}</span>
      <span className="h-px flex-1 bg-white/15" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 * OPTION A — Gallery: heading, draggable page-comp gallery in browser frames,
 * then the live link. Dark ground.
 * ═══════════════════════════════════════════════════════════════════════════ */
function OptionA() {
  return (
    <div className="w-full py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8">
        <Reveal className="max-w-[680px]">
          <h2 className="text-[30px] font-semibold uppercase leading-none tracking-wide text-white sm:text-[40px]">
            {defaults.heading}
          </h2>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-white/70 sm:text-lg">{defaults.intro}</p>
        </Reveal>
      </div>

      <div className="mx-auto mt-14 w-full max-w-[1100px] px-6 sm:px-8">
        <Reveal className="max-w-[640px]">
          <Eyebrow>{defaults.ux.eyebrow}</Eyebrow>
          <h3 className="mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">{defaults.ux.title}</h3>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-white/70">{defaults.ux.body}</p>
        </Reveal>
      </div>
      <DragRail>
        {defaults.ux.pages.map((p) => (
          <figure key={p.key} className="m-0 w-[68vw] shrink-0 snap-start sm:w-[300px]">
            <div className="overflow-hidden rounded-xl border border-white/12 bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
              <BrowserBar />
              <div className="h-[420px] overflow-hidden bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={`${p.label} page design`} draggable={false} loading="lazy" className="pointer-events-none block w-full" />
              </div>
            </div>
            <figcaption className="mt-2 text-center text-[13px] text-white/65">{p.label}</figcaption>
          </figure>
        ))}
      </DragRail>

      <LiveBlock />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 * OPTION B — Food bento: an asymmetric grid mixing big food cutouts, a brand
 * statement, and page comps — gallery-wall on black with red accent tiles.
 * ═══════════════════════════════════════════════════════════════════════════ */
function OptionB() {
  return (
    <div className="relative w-full overflow-hidden py-20 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-32 h-[28rem] w-[28rem] rounded-full bg-[var(--px-red)]/25 blur-3xl" />
      <div className="relative mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <Reveal className="max-w-[680px]">
          <Eyebrow>{defaults.heading}</Eyebrow>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.05] text-white sm:text-[52px]">
            A brand site as good as the food.
          </h2>
          <p className="mt-4 max-w-[54ch] text-[15px] leading-relaxed text-white/70 sm:text-lg">{defaults.intro}</p>
        </Reveal>

        {/* bento grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:auto-rows-[230px]">
          {/* big food hero — spans 2x2 on a red field */}
          <Reveal className="col-span-2 row-span-2 lg:col-span-2 lg:row-span-2">
            <FoodTile src={`${FOOD}/orange-chicken.webp`} caption="The Original Orange Chicken" red big />
          </Reveal>
          <Reveal delay={80} className="col-span-1 lg:row-span-1">
            <CompTile src={`${UX}/home.webp`} label="Homepage" />
          </Reveal>
          <Reveal delay={120} className="col-span-1 lg:row-span-1">
            <FoodTile src={`${FOOD}/string-bean-chicken.webp`} caption="String Bean Chicken" />
          </Reveal>
          <Reveal delay={160} className="col-span-1 lg:row-span-1">
            <FoodTile src={`${FOOD}/broccoli-beef.webp`} caption="Broccoli Beef" red />
          </Reveal>
          <Reveal delay={200} className="col-span-1 lg:row-span-1">
            <CompTile src={`${UX}/food.webp`} label="Our Food" />
          </Reveal>
        </div>

        <div className="mt-10">
          <LiveLink />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 * OPTION C — Editorial: full-bleed alternating rows (big food + page comp),
 * magazine feel on black, large type.
 * ═══════════════════════════════════════════════════════════════════════════ */
function OptionC() {
  const rows = [
    { label: 'Homepage', comp: `${UX}/home.webp`, food: `${FOOD}/takeout-box.webp`, kicker: 'THE HOMEPAGE', title: 'When hunger needs a hug', body: 'A warm, food-first homepage that leads with the order and the brand voice.' },
    { label: 'Our Food', comp: `${UX}/food.webp`, food: `${FOOD}/orange-chicken.webp`, kicker: 'OUR FOOD', title: 'Chinese inspired, American made', body: 'Every dish gets room to breathe — big imagery, clear nutrition, easy browsing.' },
    { label: 'Innovation', comp: `${UX}/innovation.webp`, food: `${FOOD}/firecracker-chicken.webp`, kicker: 'INNOVATION', title: 'Creating the originals', body: 'The Innovation Kitchen story, from the wok to the limited-time drops.' },
  ]
  return (
    <div className="w-full pb-24 pt-16">
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <Reveal className="max-w-[680px]">
          <Eyebrow>{defaults.ux.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.05] text-white sm:text-[48px]">Designing every page.</h2>
        </Reveal>
      </div>

      <div className="mt-14 flex flex-col gap-24">
        {rows.map((r, i) => (
          <EditorialRow key={r.label} row={r} flip={i % 2 === 1} />
        ))}
      </div>

      <div className="mx-auto mt-16 w-full max-w-[1200px] px-6 sm:px-8">
        <LiveBlock />
      </div>
    </div>
  )
}

function EditorialRow({
  row,
  flip,
}: {
  row: { label: string; comp: string; food: string; kicker: string; title: string; body: string }
  flip: boolean
}) {
  return (
    <Reveal>
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-8 px-6 sm:px-8 lg:grid-cols-2 lg:gap-14">
        {/* media: a red panel with the food cutout floating, page comp peeking */}
        <div className={`relative ${flip ? 'lg:order-2' : ''}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--px-red)]">
            <div aria-hidden className="pointer-events-none absolute -left-10 -top-10 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-1/2 h-[72%] w-[58%] -translate-x-1/2 overflow-hidden rounded-t-lg border border-white/20 bg-white shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={row.comp} alt={`${row.label} page design`} loading="lazy" className="block w-full" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={row.food}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute -right-4 top-1/2 w-[58%] -translate-y-1/2 drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>
        {/* copy */}
        <div className={flip ? 'lg:order-1' : ''}>
          <Eyebrow>{row.kicker}</Eyebrow>
          <h3 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-[34px]">{row.title}</h3>
          <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-white/70 sm:text-lg">{row.body}</p>
        </div>
      </div>
    </Reveal>
  )
}

/* ── shared pieces ─────────────────────────────────────────────────────────── */

function LiveBlock() {
  return (
    <div className="mx-auto mt-20 w-full max-w-[1100px] px-6 sm:px-8">
      <Reveal className="max-w-[640px]">
        <Eyebrow>{defaults.live.eyebrow}</Eyebrow>
        <h3 className="mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">{defaults.live.title}</h3>
        <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-white/70">{defaults.live.body}</p>
        <LiveLink />
      </Reveal>
    </div>
  )
}

function LiveLink() {
  return (
    <a
      href={defaults.live.cta.href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--px-red)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      {defaults.live.cta.label}
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}

/** Food cutout tile (Option B). `red` = Panda-red field; otherwise a dark card. */
function FoodTile({ src, caption, big, red }: { src: string; caption: string; big?: boolean; red?: boolean }) {
  return (
    <figure
      className={`relative m-0 h-full overflow-hidden rounded-2xl border ${
        red ? 'border-transparent bg-[var(--px-red)]' : 'border-white/12 bg-white/[0.05]'
      }`}
    >
      <div className={`flex h-full items-center justify-center ${big ? 'aspect-square lg:aspect-auto' : 'aspect-square lg:aspect-auto'} p-4`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={caption} loading="lazy" className={`${big ? 'w-[82%]' : 'w-[80%]'} object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.4)]`} />
      </div>
      <figcaption className={`absolute bottom-3 left-4 ${big ? 'text-base' : 'text-[13px]'} font-medium text-white/90`}>
        {caption}
      </figcaption>
    </figure>
  )
}

/** Page-comp tile (Option B) — top-cropped page design. */
function CompTile({ src, label }: { src: string; label: string }) {
  return (
    <figure className="m-0 h-full overflow-hidden rounded-2xl border border-white/12 bg-white">
      <div className="h-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={`${label} page design`} loading="lazy" className="block w-full" />
      </div>
    </figure>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5a4d]">{children}</span>
}

function BrowserBar({ url }: { url?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-black/10 bg-neutral-50 px-3 py-2">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      {url ? (
        <span className="br-data ml-3 truncate rounded bg-white px-2.5 py-0.5 text-[11px] text-neutral-500">{url}</span>
      ) : null}
    </div>
  )
}

/** Native-scroll + JS mouse-drag rail (Option A). */
function DragRail({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ down: false, startX: 0, startScroll: 0, target: 0, samples: [] as { x: number; t: number }[] })
  const dragRaf = useRef<number | null>(null)
  const momentumRaf = useRef<number | null>(null)
  const RAIL_PAD = 'calc(max(1.5rem, (100vw - 1100px) / 2 + 2rem))'

  const stop = useCallback(() => {
    if (momentumRaf.current != null) cancelAnimationFrame(momentumRaf.current)
    momentumRaf.current = null
  }, [])
  const momentum = useCallback((v0: number) => {
    const el = trackRef.current
    if (!el) return
    stop()
    let v = v0
    let last = performance.now()
    const step = (now: number) => {
      const dt = Math.min(40, now - last)
      last = now
      el.scrollLeft -= v * dt
      v *= Math.exp(-0.0025 * dt)
      const atEdge = el.scrollLeft <= 0 || el.scrollLeft >= el.scrollWidth - el.clientWidth - 1
      if (Math.abs(v) < 0.015 || atEdge) {
        momentumRaf.current = null
        return
      }
      momentumRaf.current = requestAnimationFrame(step)
    }
    momentumRaf.current = requestAnimationFrame(step)
  }, [stop])
  useEffect(() => () => {
    stop()
    if (dragRaf.current != null) cancelAnimationFrame(dragRaf.current)
  }, [stop])
  const tick = useCallback(() => {
    const el = trackRef.current
    if (el && drag.current.down) {
      el.scrollLeft = drag.current.target
      dragRaf.current = requestAnimationFrame(tick)
    } else dragRaf.current = null
  }, [])
  const down = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (!el || e.pointerType !== 'mouse') return
    stop()
    drag.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft, target: el.scrollLeft, samples: [{ x: e.clientX, t: performance.now() }] }
    el.setPointerCapture(e.pointerId)
    if (dragRaf.current == null) dragRaf.current = requestAnimationFrame(tick)
  }
  const move = (e: React.PointerEvent) => {
    if (!drag.current.down) return
    drag.current.target = drag.current.startScroll - (e.clientX - drag.current.startX)
    const now = performance.now()
    const s = drag.current.samples
    s.push({ x: e.clientX, t: now })
    while (s.length > 2 && now - s[0].t > 120) s.shift()
  }
  const up = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (el) {
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {}
    }
    const was = drag.current.down
    drag.current.down = false
    if (dragRaf.current != null) {
      cancelAnimationFrame(dragRaf.current)
      dragRaf.current = null
    }
    if (was && el) {
      const s = drag.current.samples
      const now = performance.now()
      const f = s[0]
      const l = s[s.length - 1]
      const dt = l.t - f.t
      const vx = dt > 0 ? (l.x - f.x) / dt : 0
      if (now - l.t < 90 && Math.abs(vx) > 0.05) momentum(vx)
    }
  }

  return (
    <div className="mt-8">
      <div
        ref={trackRef}
        className="br-noscrollbar flex cursor-grab snap-x gap-5 overflow-x-auto overscroll-x-contain pb-2 select-none active:cursor-grabbing"
        style={{ paddingInline: RAIL_PAD, scrollPaddingInline: RAIL_PAD, touchAction: 'pan-x pan-y' }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        {children}
      </div>
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
