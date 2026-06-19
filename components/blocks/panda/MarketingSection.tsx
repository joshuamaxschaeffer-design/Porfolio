'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
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
 * Adapted from the Baserate Scalability timeline: a real pinhole-perspective
 * recede. Each page sits at depth z = i*gap; a pinhole camera projects z → a
 * scale s = F/(F+z) and a screen position interpolated from the front anchor
 * toward a right-side vanishing point by (1−s), so the deck fans back to the
 * right (reads as "facing left"). `gap` grows on scroll (GAP_MIN→GAP_MAX) — the
 * deck expands out of a near-stack as the section scrolls in. Depth cues: a
 * darkening overlay + a STATIC (per-card, settled-depth) blur split across two
 * layers; NO border/edge-mask — a radial vignette dissolves the far cards into
 * the black. Reduced-motion → settled (fully spread, static).
 * ──────────────────────────────────────────────────────────────────────────── */
const UX_F = 1500 // focal length (gentle shrink)
const UX_GAP_MAX = 440 // z between cards, fully spread
const UX_GAP_MIN = 200 // at scroll start
const UX_VP_X = 92 // vanishing point x (stage %) — far right
const UX_VP_Y = 26
const UX_FRONT_Y = 50

function uxProject(z: number, frontX: number, vpX: number) {
  const s = UX_F / (UX_F + z)
  const k = 1 - s
  return { s, x: frontX + (vpX - frontX) * k, y: UX_FRONT_Y + (UX_VP_Y - UX_FRONT_Y) * k }
}
const uxDarken = (d: number) => Math.max(0, Math.min(0.92, (d - 1) * 0.24))
const uxBlur = (d: number) => Math.max(0, (d - 1) * 7)

function PerspectiveStack({ pages }: { pages: { key: string; label: string; src: string }[] }) {
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const apply = () => setMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  const frontX = mobile ? 30 : 22 // front card sits left; deck recedes right
  const vpX = mobile ? 96 : UX_VP_X

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'center center'] })
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.6 })
  const gap = useTransform(p, [0, 1], [UX_GAP_MIN, UX_GAP_MAX])
  const gapStatic = useMotionValue(UX_GAP_MAX)
  const gapMV = reduce ? gapStatic : gap

  const deck = pages.slice(0, 5)
  const n = deck.length
  return (
    <div
      ref={stageRef}
      className="relative mx-auto mt-8 h-[clamp(420px,54vw,720px)] w-full max-w-[1200px]"
    >
      {deck.map((pg, i) => (
        <UxCard key={pg.key} page={pg} index={i} gap={gapMV} total={n} frontX={frontX} vpX={vpX} />
      ))}
      {/* vignette: the far/right portion dissolves into the section black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 115% at 86% 34%, rgba(13,13,15,0) 30%, rgba(13,13,15,0.55) 62%, rgba(13,13,15,0.98) 88%)',
        }}
      />
    </div>
  )
}

function UxCard({
  page,
  index,
  gap,
  total,
  frontX,
  vpX,
}: {
  page: { key: string; label: string; src: string }
  index: number
  gap: MotionValue<number>
  total: number
  frontX: number
  vpX: number
}) {
  const d = useTransform(gap, (g) => (index * g) / UX_GAP_MAX)
  const proj = useTransform(gap, (g) => uxProject(index * g, frontX, vpX))
  const left = useTransform(proj, (pr) => `${pr.x}%`)
  const top = useTransform(proj, (pr) => `${pr.y}%`)
  const scale = useTransform(proj, (pr) => pr.s)
  const darken = useTransform(d, (dd) => uxDarken(dd))
  // static blur from settled depth (gap=GAP_MAX → d=index) — Safari perf
  const q = (v: number, step: number) => Math.round(v / step) * step
  const blurOuter = `blur(${q(uxBlur(index) * 0.45, 2)}px)`
  const blurInner = `blur(${q(uxBlur(index) * 0.55, 2)}px)`
  return (
    <motion.div
      className="absolute"
      style={{
        left,
        top,
        width: 'min(34%, 360px)', // tall, narrow portrait page
        x: '-50%',
        y: '-50%',
        scale,
        zIndex: total - index,
        filter: blurOuter,
        willChange: 'transform',
      }}
    >
      {/* clean clipped corners, no border (a translucent edge + blur = halo) */}
      <motion.div
        className="relative overflow-hidden rounded-xl bg-white"
        style={{ boxShadow: '0 30px 70px -28px rgba(0,0,0,0.7)', filter: blurInner }}
      >
        {/* fixed portrait crop, top-anchored — uniform height across the deck */}
        <div className="aspect-[360/620] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={page.src} alt={`${page.label} page design`} draggable={false} className="block w-full select-none" />
        </div>
        <motion.div className="pointer-events-none absolute inset-0 bg-[#0d0d0f]" style={{ opacity: darken }} />
      </motion.div>
    </motion.div>
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
