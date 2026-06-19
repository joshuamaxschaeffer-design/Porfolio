'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { marketing as defaults } from './data'

/**
 * THE BRAND ONLINE — marketing-site workstream, on a near-BLACK ground so it
 * reads distinctly from the white/red sections around it.
 *
 * The section is the angled UX deck: the real pandaexpress.com page designs laid
 * down on a single receding plane, full-bleed on the black field, then the live
 * link. Tall pages auto-scroll their own content (up and down); short pages
 * render at their natural height, static, and are ordered last (far right).
 */

export function MarketingSection() {
  return (
    <section
      id="marketing"
      aria-label="The brand online — marketing site"
      className="relative w-full overflow-hidden py-20 text-white lg:py-28"
      style={{ backgroundColor: '#0d0d0f' }}
    >
      {/* soft red glow, top-right */}
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-32 h-[28rem] w-[28rem] rounded-full bg-[var(--px-red)]/25 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        {/* header */}
        <Reveal className="max-w-[680px]">
          <Eyebrow>{defaults.heading}</Eyebrow>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.05] text-white sm:text-[52px]">
            A brand site as good as the food.
          </h2>
          <p className="mt-4 max-w-[54ch] text-[15px] leading-relaxed text-white/70 sm:text-lg">
            {defaults.intro}
          </p>
        </Reveal>

        {/* THE UX — the page designs as a receding perspective deck */}
        <div className="mt-14">
          <Reveal>
            <Eyebrow>{defaults.ux.eyebrow}</Eyebrow>
            <h3 className="mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">
              {defaults.ux.title}
            </h3>
            <p className="mt-3 max-w-[112ch] text-[15px] leading-relaxed text-white/70">
              {defaults.ux.body}
            </p>
          </Reveal>
          <Reveal>
            <PerspectiveStack pages={defaults.ux.pages} />
          </Reveal>
        </div>

        <div className="mt-10">
          <LiveLink />
        </div>
      </div>
    </section>
  )
}

/* ── tiles ─────────────────────────────────────────────────────────────────── */

/* ── angled UX deck (full-bleed) ─────────────────────────────────────────────
 * The real page screenshots laid down on a receding surface — a single 3D plane
 * tilted back (rotateX) + leaned right (rotateZ), full viewport width on the
 * black field (no box crop, no device frames). Tall pages auto-scroll their own
 * content so you see more than the fold. Rows recede via translateZ so the far
 * tiles read smaller. Inspired by the Wingstop angled-screens mockup, minus the
 * stretched device frames. Reduced-motion → no auto-scroll, static pose.
 * ──────────────────────────────────────────────────────────────────────────── */
type DeckPage = { key: string; label: string; src: string; ratio?: number }

/** Window aspect (height / width) for a tile in the deck. A page can scroll only
 *  when it's taller than this; shorter pages get a window sized to their image. */
const WINDOW_RATIO = 34 / 13 // h-[34vw] / w-[13vw] ≈ 2.62

function PerspectiveStack({ pages }: { pages: DeckPage[] }) {
  const reduce = useReducedMotion()
  // tall pages (scrollable) first; short, static pages pushed to the far right.
  const deck = [...pages]
    .slice(0, 7)
    .sort((a, b) => (b.ratio ?? WINDOW_RATIO) - (a.ratio ?? WINDOW_RATIO))
  return (
    // full-bleed: break out of the centered container to the whole viewport
    <div className="relative left-1/2 mt-10 w-screen -translate-x-1/2 overflow-hidden">
      <div
        className="mx-auto"
        style={{ perspective: '2200px', perspectiveOrigin: '50% 30%' }}
      >
        {/* the tilted + leaned plane the screens lie on (straightened ~7°) */}
        <div
          className="mx-auto flex items-start justify-center gap-[2.2vw] px-[4vw] pb-[6vw] pt-[2vw]"
          style={{
            transformStyle: 'preserve-3d',
            // translateX recenters the plane: the rotateZ lean shifts the mass
            // left, so nudge it back right so nothing clips on the left edge.
            transform: 'translateX(6vw) rotateX(39deg) rotateZ(-25deg) scale(0.94)',
            transformOrigin: '50% 40%',
          }}
        >
          {deck.map((pg, i) => (
            <AngledScreen key={pg.key} page={pg} reduce={!!reduce} index={i} />
          ))}
        </div>
      </div>
      {/* edge vignettes so the laid-down plane dissolves into the black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, #0d0d0f 0%, rgba(13,13,15,0) 14%, rgba(13,13,15,0) 86%, #0d0d0f 100%), linear-gradient(to bottom, rgba(13,13,15,0) 55%, #0d0d0f 97%)',
        }}
      />
    </div>
  )
}

/** One page screenshot lying on the plane; no device chrome, clean rounded
 *  corners. Tall pages get a fixed-height window and auto-scroll their content
 *  up and down; short pages get a window sized to the image and stay static. */
function AngledScreen({ page, reduce, index }: { page: DeckPage; reduce: boolean; index: number }) {
  const ratio = page.ratio ?? WINDOW_RATIO
  const scrolls = ratio > WINDOW_RATIO + 0.15
  // how far the tall image must travel inside the fixed window, as a % of img height
  const travelPct = scrolls ? (1 - WINDOW_RATIO / ratio) * 100 : 0
  // stagger the scroll phase so the columns don't move in lockstep
  const delay = -(index * 2.6)
  return (
    <figure className="relative m-0 w-[13vw] min-w-[96px] shrink-0">
      <div
        className={`relative overflow-hidden rounded-[14px] bg-white ${
          scrolls ? 'h-[34vw] max-h-[640px] min-h-[300px]' : ''
        }`}
        style={{
          boxShadow: '0 40px 80px -30px rgba(0,0,0,0.85), 0 10px 24px -12px rgba(0,0,0,0.6)',
          // short pages: window height follows the image's own aspect
          ...(scrolls ? {} : { aspectRatio: `1 / ${ratio}` }),
        }}
      >
        <div
          className={scrolls && !reduce ? 'pxmk-vscroll' : ''}
          style={
            scrolls && !reduce
              ? ({ ['--pxmk-travel' as string]: `-${travelPct}%`, animationDelay: `${delay}s` } as React.CSSProperties)
              : undefined
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={page.src} alt={`${page.label} — pandaexpress.com`} draggable={false} className="block w-full select-none" />
        </div>
      </div>
      <style>{`
        .pxmk-vscroll{animation:pxmk-vscroll 26s ease-in-out infinite alternate}
        @keyframes pxmk-vscroll{from{transform:translateY(0)}to{transform:translateY(var(--pxmk-travel,0))}}
        @media (prefers-reduced-motion: reduce){.pxmk-vscroll{animation:none}}
      `}</style>
    </figure>
  )
}

/* ── shared ─────────────────────────────────────────────────────────────────── */

function LiveLink() {
  return (
    <a
      href={defaults.live.cta.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-[var(--px-red)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      {defaults.live.cta.label}
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5a4d]">{children}</span>
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
