'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue as MV } from 'motion/react'
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

        {/* COHESIVE SITE UX — the real page designs laid down on a receding plane.
            A faint full-width hairline tops the deck and is ALSO the clip edge, so
            the raised right-hand screens crop cleanly at the divider instead of
            poking above it; the copy sits on a dark card floating IN FRONT. */}
        <div className="relative mt-20 lg:mt-28">
          {/* the laid-down deck (its full-bleed wrapper carries the top divider
              and clips the angled screens exactly at that hairline) */}
          <Reveal>
            <PerspectiveStack pages={defaults.ux.pages} />
          </Reveal>

          {/* copy card — black with a faint white stroke, sitting on top of the screens */}
          <Reveal className="pointer-events-none absolute left-0 top-10 z-20 w-full sm:top-14 lg:top-16">
            <div className="pointer-events-auto max-w-[460px] rounded-2xl border border-white/15 bg-black/80 p-6 backdrop-blur-md sm:p-7">
              <Eyebrow>{defaults.ux.eyebrow}</Eyebrow>
              <h3 className="mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">
                {defaults.ux.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                {defaults.ux.body}
              </p>
            </div>
          </Reveal>
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
    // full-bleed: break out of the centered container to the whole viewport.
    // The top border is the section hairline AND the clip edge: pt-10 holds the
    // breathing gap INSIDE the clip box, so the angled screens that rise past the
    // deck top are cropped exactly at the divider instead of above it.
    <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-t border-white/10 pt-10">
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
/* The blue UX wireframes as an overlapping, slightly-fanned stack.
 * IMPORTANT: this uses only 2D transforms (rotate + translate). A 3D plane
 * (perspective + rotateX/preserve-3d) made Chrome fail to rasterize the tall
 * wireframes that get scaled down in the plane — they painted solid black even
 * though the image data was fine. A 2D fan avoids that GPU path and renders
 * reliably while still reading as a stacked, angled deck.
 *
 * The fan EXPANDS on scroll: progress is computed manually from the stage's
 * getBoundingClientRect (Motion's useScroll({target}) is frozen by this site's
 * Lenis smooth scroll). At progress 0 the cards sit in a tight near-stack; as
 * the section scrolls through the viewport they spread out to the right.
 * Generous vertical headroom + no top clip; rotated layers promoted to their
 * own compositor layer (translateZ) so the edges anti-alias cleanly. */
function WireframeStack({ pages }: { pages: { key: string; label: string; src: string }[] }) {
  const deck = pages.slice(0, 5)
  const stageRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // Smooth like Baserate's ScalabilityTimeline: a single MotionValue (NO React
  // state / re-render per frame) fed through useSpring, then useTransform to each
  // card's style. Progress is driven manually from getBoundingClientRect in a
  // rAF loop because this site's Lenis smooth-scroll FREEZES Motion's
  // useScroll({target}). Writing straight to MotionValues + spring = fluid,
  // scroll-synced motion with no CSS-transition lag (the old setState + CSS
  // transition was what made it janky).
  const raw = useMotionValue(reduce ? 1 : 0)
  const p = useSpring(raw, { stiffness: 90, damping: 28, mass: 0.5 })

  useEffect(() => {
    if (reduce) {
      raw.set(1)
      return
    }
    let raf = 0
    const measure = () => {
      raf = 0
      const el = stageRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // 0 when the stage's center is near the bottom of the viewport, 1 once it
      // has risen to ~center — a gentle, subtle spread as it scrolls through.
      const center = r.top + r.height / 2
      const prog = (vh - center) / (vh * 0.55)
      raw.set(Math.max(0, Math.min(1, prog)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [raw, reduce])

  return (
    // Desktop: no overflow-hidden — let the fan breathe so the top corners
    // aren't clipped. Mobile: the deck is scaled to FIT the column — a modest
    // 1.15× from the TOP-LEFT so the front (largest) card anchors at the left
    // and the whole 5-card fan stays fully visible, nothing clipped top/bottom.
    // Every size here is viewport-proportional (50vw stage / 58vw reserved box /
    // vw-based cards) so the fit holds across the entire sub-lg range instead of
    // only at one width; the wrapper still goes full-bleed (breaks the
    // container's side padding) and clips only the side bleed at the browser
    // edges. lg+ keeps its natural, un-scaled fan.
    <div className="relative mt-10 flex w-[calc(100%+3rem)] justify-center overflow-hidden -mx-6 sm:w-[calc(100%+4rem)] sm:-mx-8 lg:mx-0 lg:w-full lg:overflow-visible">
      <div className="h-[58vw] w-full overflow-hidden lg:h-auto lg:overflow-visible">
        <div
          ref={stageRef}
          className="relative h-[50vw] w-full max-w-[1100px] origin-top-left scale-[1.15] lg:h-[clamp(340px,44vw,560px)] lg:origin-top lg:scale-100"
        >
          {deck.map((pg, i) => (
            <WireframeCard key={pg.key} page={pg} index={i} total={deck.length} p={p} />
          ))}
        </div>
      </div>
    </div>
  )
}

/** One fanned wireframe card. Its left/rotate are MotionValues derived from the
 *  spring `p` (0 tight → 1 spread) via useTransform — updates on the compositor,
 *  never via React re-render, so it tracks scroll smoothly. Subtle travel. */
function WireframeCard({
  page,
  index,
  total,
  p,
}: {
  page: { key: string; label: string; src: string }
  index: number
  total: number
  p: MV<number>
}) {
  const widthPct = 30 - index * 2.4
  const darken = Math.min(0.45, index * 0.11)
  // subtle expand: each card's left-step and tilt grow only a little with p
  const left = useTransform(p, (v) => `${8 + index * (7 + 7 * v)}%`)
  const rotate = useTransform(p, (v) => -6 + index * (1.0 + 0.7 * v))
  const transform = useTransform(rotate, (r) => `translate3d(0,-50%,0) rotate(${r}deg)`)
  return (
    <motion.figure
      className="absolute top-1/2 m-0"
      style={{
        left,
        width: `${widthPct}%`,
        transform,
        transformOrigin: 'center bottom',
        zIndex: total - index,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <div
        className="relative aspect-[360/560] overflow-hidden rounded-[12px] bg-white"
        style={{
          boxShadow: '0 26px 60px -26px rgba(0,0,0,0.8)',
          outline: '1px solid rgba(255,255,255,0.06)',
          outlineOffset: '-1px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={page.src}
          alt={`${page.label} page design`}
          draggable={false}
          loading="lazy"
          className="block w-full select-none"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#0d0d0f]" style={{ opacity: darken }} />
      </div>
    </motion.figure>
  )
}

/* ── shared ─────────────────────────────────────────────────────────────────── */

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
