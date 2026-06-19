'use client'

import { useEffect, useRef, useState } from 'react'
import { marketing as defaults } from './data'

/**
 * THE BRAND ONLINE — marketing-site workstream, on a near-BLACK ground so it
 * reads distinctly from the white/red sections around it. It's the brand site,
 * so it's the most aesthetic section: a food-led bento mixing big dish cutouts
 * with real page screenshots, then the live link.
 *
 * Layout: the "Food bento" direction (chosen from the 3 options). The page
 * tiles show REAL pandaexpress.com screenshots from `marketing.liveShots`
 * (public/panda/marketing/live/*). Until a screenshot file is dropped in, a
 * tile shows a clean labeled placeholder — never a broken image.
 *
 * Food cutouts: public/panda/marketing/food/*.webp.
 */

const FOOD = '/panda/marketing/food'

export function MarketingSection() {
  const shots = defaults.liveShots
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
          <Reveal className="max-w-[640px]">
            <Eyebrow>{defaults.ux.eyebrow}</Eyebrow>
            <h3 className="mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">
              {defaults.ux.title}
            </h3>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-white/70">
              {defaults.ux.body}
            </p>
          </Reveal>
          <Reveal>
            <PerspectiveStack pages={defaults.ux.pages} />
          </Reveal>
        </div>

        {/* bento: big food hero (2x2) + page screenshots + food cutouts */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:auto-rows-[230px]">
          {/* big food hero on a red field — spans 2x2 */}
          <Reveal className="col-span-2 row-span-2 lg:col-span-2 lg:row-span-2">
            <FoodTile src={`${FOOD}/orange-chicken.webp`} caption="The Original Orange Chicken" red big />
          </Reveal>

          {/* page screenshot — Homepage */}
          <Reveal delay={80} className="col-span-1 lg:row-span-1">
            <ShotTile shot={shots[0]} />
          </Reveal>

          {/* food cutout */}
          <Reveal delay={120} className="col-span-1 lg:row-span-1">
            <FoodTile src={`${FOOD}/string-bean-chicken.webp`} caption="String Bean Chicken" />
          </Reveal>

          {/* food cutout (red) */}
          <Reveal delay={160} className="col-span-1 lg:row-span-1">
            <FoodTile src={`${FOOD}/broccoli-beef.webp`} caption="Broccoli Beef" red />
          </Reveal>

          {/* page screenshot — Our Food */}
          <Reveal delay={200} className="col-span-1 lg:row-span-1">
            <ShotTile shot={shots[1]} />
          </Reveal>
        </div>

        {/* a third page screenshot on its own wide row (optional 3rd capture) */}
        <Reveal delay={120} className="mt-4 sm:mt-5">
          <ShotTile shot={shots[2]} wide />
        </Reveal>

        <div className="mt-10">
          <LiveLink />
        </div>
      </div>
    </section>
  )
}

/* ── tiles ─────────────────────────────────────────────────────────────────── */

/* ── perspective UX deck ─────────────────────────────────────────────────────
 * The blue/white page wireframes as a receding 3D stack that faces slightly
 * LEFT (rotateY), each card stepped right + back + scaled so they recede,
 * spread out enough to read each page's top. Every card is cropped to the SAME
 * height (top-anchored) so the deck is even. Front card fully lit; deeper cards
 * dim + blur for depth. Reduced-motion users still get the stepped layout.
 * ──────────────────────────────────────────────────────────────────────────── */
function PerspectiveStack({ pages }: { pages: { key: string; label: string; src: string }[] }) {
  const deck = pages.slice(0, 5) // strongest 5, front-to-back
  const n = deck.length
  return (
    <div className="relative mx-auto mt-8 w-full max-w-[1100px]" style={{ perspective: '1800px', perspectiveOrigin: '50% 40%' }}>
      <div className="relative" style={{ height: 'clamp(560px, 72vw, 920px)', transformStyle: 'preserve-3d' }}>
        {deck.map((p, i) => {
          const depth = i / Math.max(1, n - 1) // 0 (front) .. 1 (back)
          const left = `${depth * 17 * (n - 1)}%`
          const scale = 1 - depth * 0.1
          const z = -depth * 220
          const ty = depth * 26
          const dim = depth * 0.42
          const blur = depth * 1.4
          return (
            <figure
              key={p.key}
              className="absolute left-0 top-0 m-0 overflow-hidden rounded-xl border border-white/12 bg-white shadow-[0_30px_70px_-24px_rgba(0,0,0,0.7)]"
              style={{
                width: 'min(31%, 320px)',
                height: '100%',
                left,
                transform: `translateZ(${z}px) translateY(${ty}px) rotateY(-18deg) scale(${scale})`,
                transformOrigin: 'left center',
                zIndex: n - i,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={`${p.label} page design`}
                loading="lazy"
                draggable={false}
                className="block h-full w-full object-cover object-top"
                style={{ filter: blur ? `brightness(${1 - dim}) blur(${blur}px)` : undefined }}
              />
              {dim > 0 ? (
                <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `rgba(13,13,15,${dim})` }} />
              ) : null}
            </figure>
          )
        })}
      </div>
      <p className="mt-4 text-[13px] text-white/45">Homepage, Our Food, Innovation, Our Family, Our Shop — one connected system.</p>
    </div>
  )
}

/** Food cutout tile. `red` = Panda-red field; otherwise a dark card. */
function FoodTile({ src, caption, big, red }: { src: string; caption: string; big?: boolean; red?: boolean }) {
  return (
    <figure
      className={`relative m-0 h-full overflow-hidden rounded-2xl border ${
        red ? 'border-transparent bg-[var(--px-red)]' : 'border-white/12 bg-white/[0.05]'
      }`}
    >
      <div className="flex h-full items-center justify-center p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption}
          loading="lazy"
          className={`${big ? 'w-[82%]' : 'w-[80%]'} object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.4)]`}
        />
      </div>
      <figcaption className={`absolute bottom-3 left-4 ${big ? 'text-base' : 'text-[13px]'} font-medium text-white/90`}>
        {caption}
      </figcaption>
    </figure>
  )
}

/** A real pandaexpress.com page screenshot in a browser frame. Falls back to a
 *  clean labeled placeholder until the screenshot file is dropped in. */
function ShotTile({ shot, wide }: { shot: { key: string; label: string; src: string }; wide?: boolean }) {
  const [ok, setOk] = useState(true)
  const hasShot = !!shot.src && ok
  return (
    <figure className="m-0 h-full overflow-hidden rounded-2xl border border-white/12 bg-white">
      <BrowserBar url="pandaexpress.com" />
      <div className={`overflow-hidden bg-neutral-100 ${wide ? 'aspect-[1440/520]' : 'h-[calc(100%-37px)]'}`}>
        {hasShot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shot.src}
            alt={`pandaexpress.com — ${shot.label}`}
            loading="lazy"
            onError={() => setOk(false)}
            className="block h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full min-h-[160px] w-full items-center justify-center">
            <span className="br-data text-[11px] uppercase tracking-wide text-neutral-400">{shot.label}</span>
          </div>
        )}
      </div>
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
