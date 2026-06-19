'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { marketing as defaults } from './data'

/**
 * THE BRAND ONLINE — the marketing-site workstream, in two real parts:
 *
 *   1. THE UX — a draggable gallery of the full page designs I made (tall page
 *      comps shown in a browser frame, scroll-cropped), plus the site map.
 *   2. LIVE & SHIPPED — the design as it shipped on pandaexpress.com, shown in
 *      browser-frame mockups (real captures; asset-slotted until dropped in),
 *      with a link to the live site.
 *
 * White ground (a calm break between the red Rewards section and red Outcomes).
 * Reveal-on-scroll is opacity/transform only; reduced-motion safe. The UX rail
 * reuses the native-scroll + JS-drag pattern from the rewards carousel.
 */
export function MarketingSection() {
  return (
    <section
      id="marketing"
      aria-label="The brand online — marketing site"
      className="relative w-full bg-white py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8">
        <Reveal className="max-w-[680px]">
          <h2 className="text-[30px] font-semibold uppercase leading-none tracking-wide text-[var(--br-ink)] sm:text-[40px]">
            {defaults.heading}
          </h2>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-[var(--br-body)] sm:text-lg">
            {defaults.intro}
          </p>
        </Reveal>
      </div>

      {/* 1 — THE UX */}
      <div className="mx-auto mt-14 w-full max-w-[1100px] px-6 sm:px-8">
        <Reveal className="max-w-[640px]">
          <Eyebrow>{defaults.ux.eyebrow}</Eyebrow>
          <h3 className="mt-2 text-xl font-semibold leading-tight text-[var(--br-ink)] sm:text-2xl">
            {defaults.ux.title}
          </h3>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-[var(--br-body)]">
            {defaults.ux.body}
          </p>
        </Reveal>
      </div>
      <UxGallery />

      {/* site map */}
      <div className="mx-auto mt-12 w-full max-w-[1100px] px-6 sm:px-8">
        <Reveal>
          <figure className="m-0 overflow-hidden rounded-xl border border-[var(--br-line)] bg-[var(--br-bg-2,#f4f4f5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={defaults.ux.sitemap.src} alt={defaults.ux.sitemap.alt} loading="lazy" className="block w-full" />
          </figure>
          <figcaption className="mt-2 text-[13px] text-[var(--br-muted-2,#71717a)]">
            {defaults.ux.sitemap.label} — the full site mapped before design.
          </figcaption>
        </Reveal>
      </div>

      {/* 2 — LIVE & SHIPPED */}
      <div className="mx-auto mt-20 w-full max-w-[1100px] px-6 sm:px-8">
        <Reveal className="max-w-[640px]">
          <Eyebrow>{defaults.live.eyebrow}</Eyebrow>
          <h3 className="mt-2 text-xl font-semibold leading-tight text-[var(--br-ink)] sm:text-2xl">
            {defaults.live.title}
          </h3>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-[var(--br-body)]">
            {defaults.live.body}
          </p>
          <a
            href={defaults.live.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--px-red)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {defaults.live.cta.label}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {defaults.live.shots.map((s, i) => (
            <Reveal key={s.key} delay={i * 90}>
              <BrowserMock label={s.label} src={s.src} url="pandaexpress.com" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── UX gallery: native-scroll + JS mouse-drag rail of tall page comps ─────── */
function UxGallery() {
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ down: false, startX: 0, startScroll: 0, target: 0, samples: [] as { x: number; t: number }[] })
  const dragRaf = useRef<number | null>(null)
  const momentumRaf = useRef<number | null>(null)

  const RAIL_PAD = 'calc(max(1.5rem, (100vw - 1100px) / 2 + 2rem))'

  const stopMomentum = useCallback(() => {
    if (momentumRaf.current != null) {
      cancelAnimationFrame(momentumRaf.current)
      momentumRaf.current = null
    }
  }, [])
  const startMomentum = useCallback((v0: number) => {
    const el = trackRef.current
    if (!el) return
    stopMomentum()
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
  }, [stopMomentum])

  useEffect(() => () => {
    stopMomentum()
    if (dragRaf.current != null) cancelAnimationFrame(dragRaf.current)
  }, [stopMomentum])

  const tick = useCallback(() => {
    const el = trackRef.current
    if (el && drag.current.down) {
      el.scrollLeft = drag.current.target
      dragRaf.current = requestAnimationFrame(tick)
    } else {
      dragRaf.current = null
    }
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (!el || e.pointerType !== 'mouse') return
    stopMomentum()
    drag.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft, target: el.scrollLeft, samples: [{ x: e.clientX, t: performance.now() }] }
    el.setPointerCapture(e.pointerId)
    if (dragRaf.current == null) dragRaf.current = requestAnimationFrame(tick)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return
    drag.current.target = drag.current.startScroll - (e.clientX - drag.current.startX)
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
      const f = s[0]
      const l = s[s.length - 1]
      const dt = l.t - f.t
      const vx = dt > 0 ? (l.x - f.x) / dt : 0
      if (now - l.t < 90 && Math.abs(vx) > 0.05) startMomentum(vx)
    }
  }

  return (
    <div className="mt-8">
      <div
        ref={trackRef}
        className="br-noscrollbar flex cursor-grab snap-x gap-5 overflow-x-auto overscroll-x-contain pb-2 select-none active:cursor-grabbing"
        style={{ paddingInline: RAIL_PAD, scrollPaddingInline: RAIL_PAD, touchAction: 'pan-x pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {defaults.ux.pages.map((p) => (
          <figure key={p.key} className="m-0 w-[68vw] shrink-0 snap-start sm:w-[300px]">
            <PageComp src={p.src} label={p.label} />
            <figcaption className="mt-2 text-center text-[13px] text-[var(--br-body)]">{p.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

/* ── building blocks ─────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--px-red)]">{children}</span>
  )
}

/** A tall page comp inside a browser frame, scroll-cropped to a fixed height. */
function PageComp({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--br-line)] bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)]">
      <BrowserBar />
      <div className="h-[420px] overflow-hidden bg-[var(--br-bg-2,#f4f4f5)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={`${label} page design`} draggable={false} loading="lazy" className="pointer-events-none block w-full" />
      </div>
    </div>
  )
}

/** Browser-frame mockup for the live site; real screenshot or labeled slot. */
function BrowserMock({ label, src, url }: { label: string; src: string; url: string }) {
  return (
    <figure className="m-0">
      <div className="overflow-hidden rounded-xl border border-[var(--br-line)] bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)]">
        <BrowserBar url={url} />
        <div className="aspect-[16/10] overflow-hidden bg-[var(--br-bg-2,#f4f4f5)]">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={`pandaexpress.com — ${label}`} loading="lazy" className="block h-full w-full object-cover object-top" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="br-data text-[11px] uppercase tracking-wide text-[var(--br-muted-2,#a1a1aa)]">
                {label}
              </span>
            </div>
          )}
        </div>
      </div>
      <figcaption className="mt-2 text-center text-[13px] text-[var(--br-body)]">{label}</figcaption>
    </figure>
  )
}

function BrowserBar({ url }: { url?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-[var(--br-line)] bg-[var(--br-bg-2,#f7f7f8)] px-3 py-2">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      {url ? (
        <span className="br-data ml-3 truncate rounded bg-white px-2.5 py-0.5 text-[11px] text-[var(--br-muted-2,#71717a)]">
          {url}
        </span>
      ) : null}
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
