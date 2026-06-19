'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  type MotionValue,
} from 'motion/react'
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

        {/* THE PAGE SYSTEM — the blue UX wireframes as a receding, blurred stack
            (Baserate Scalability projection): the design system up front. */}
        <div className="mt-14">
          <Reveal>
            <Eyebrow>{defaults.ux.wireframes.eyebrow}</Eyebrow>
            <h3 className="mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">
              {defaults.ux.wireframes.title}
            </h3>
            <p className="mt-3 max-w-[112ch] text-[15px] leading-relaxed text-white/70">
              {defaults.ux.wireframes.body}
            </p>
          </Reveal>
          <WireframeStack pages={defaults.ux.wireframes.pages} />
        </div>

        {/* COHESIVE SITE UX — the real page designs laid down on a receding plane */}
        <div className="mt-20 lg:mt-28">
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

/* ── blue UX wireframe stack (Baserate Scalability projection) ───────────────
 * Adapted from the Baserate Scalability timeline: a real pinhole-perspective
 * recede. Each wireframe sits at depth z = i*gap; a pinhole camera projects
 * z → a scale s = F/(F+z) and a screen position interpolated from the front
 * anchor toward a right-side vanishing point by (1−s), so the deck fans back to
 * the right (reads as "facing left"). `gap` grows on scroll (GAP_MIN→GAP_MAX) —
 * the deck expands out of a near-stack as the section scrolls in. Depth cues: a
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

function WireframeStack({ pages }: { pages: { key: string; label: string; src: string }[] }) {
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
    <div ref={stageRef} className="relative mx-auto mt-8 h-[clamp(420px,54vw,720px)] w-full max-w-[1200px]">
      {deck.map((pg, i) => (
        <WireframeCard key={pg.key} page={pg} index={i} gap={gapMV} total={n} frontX={frontX} vpX={vpX} />
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

function WireframeCard({
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
