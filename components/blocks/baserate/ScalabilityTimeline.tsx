'use client'

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { designSystems } from './data'

type Frame = (typeof designSystems.scalability.frames)[number]

/**
 * SCALABILITY — a real pinhole-perspective "zoom-out" timeline.
 *
 * Cards sit in 3D at EQUAL depth intervals (card i at z = i * gap). A pinhole
 * camera projects depth z to a scale factor s = F / (F + z); the card's screen
 * position is interpolated from the front anchor toward the vanishing point by
 * (1 − s). Because the spacing in z is constant, the projected gaps compress
 * toward the vanishing point exactly the way a real lens renders them — the far
 * cards bunch together near the VP rather than flying off.
 *
 * Scroll = the dolly: `gap` animates from ~0 (cards stacked at the front) to its
 * full value (spread into depth) as the section scrolls in.
 *
 * Depth cues ramp FAST: darkness and blur are functions of s so a card is
 * mostly gone by the 3rd one back. Blur is double-applied (two stacked layers)
 * for a smoother falloff. A floor of ticker lines shares the same projection,
 * so they converge toward the VP and fade out within the first few steps.
 */

// --- camera / projection constants ---
// Larger F = gentler perspective shrink (cards stay big, like the mockup).
const F = 1500 // focal length
const GAP_MAX = 560 // z-distance between adjacent cards when fully spread
const GAP_MIN = 230 // at scroll start — SUBTLE dolly (small travel to GAP_MAX)
// Vanishing point in stage % — where everything converges as z → ∞.
const VP_X = 88
const VP_Y = 20
// Front card anchor in stage %. Sits high so the lower band of the stage stays
// open for the receding floor line/ticks to read clearly beneath the cards.
const FRONT_X = 33
// Slightly lower than the original 40 to offset the taller 70%-wide cards; the
// header also gets generous top margin so the card can't reach it.
const FRONT_Y = 48
// The floor baseline (near-camera) the rail line + ticks rest on — well below
// the card stack so the timeline is never occluded by the big front card.
// (Pushed lower so the receding ground line + dots read clearly.)
const FLOOR_Y = 99

// Project a depth z (>=0) → {scale, screenX%, screenY%} via the pinhole law.
// frontX overrides the front-card X anchor (mobile centers the front card).
function project(z: number, frontX = FRONT_X, vpX = VP_X) {
  const s = F / (F + z) // 1 at z=0, →0 far away
  const k = 1 - s
  return {
    s,
    x: frontX + (vpX - frontX) * k,
    y: FRONT_Y + (VP_Y - FRONT_Y) * k,
  }
}

// Depth cues keyed to the DEPTH RATIO d = z / GAP_MAX (so d≈0 = front card,
// d≈1 = the next card back at full spread, etc). Crucially these stay ~0 for
// the first ~1.3 steps so the front TWO cards read fully crisp, then ramp hard
// so card 3+ dissolve into black — matching the PS mockup (front sharp, back
// barely there).
// Gentle ramp across ALL 6 cards: card 1 (d≈0) and card 2 (d≈1) crisp, then a
// steady fade so card 6 (d≈5) is the one that's barely visible — not the 4th.
function darkenForD(d: number) {
  return Math.max(0, Math.min(0.95, (d - 1) * 0.2))
}
function blurForD(d: number) {
  return Math.max(0, (d - 1) * 7) // px (split across two layers)
}

export function ScalabilityTimeline() {
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)

  // Mobile: center the front card (it's the priority; the receding ones run off
  // the right edge) and tighten the stage. Desktop keeps the left-anchored,
  // toward-the-top-right recede.
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  // Mobile: nudge the front card ~5% LEFT (≈20px on a phone) and push the
  // vanishing point ~5% RIGHT so the farthest-back card runs further off-screen.
  const frontX = mobile ? 45 : FRONT_X
  const vpX = mobile ? 94 : VP_X

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'center center'],
  })
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.6 })

  const gap = useTransform(p, [0, 1], [GAP_MIN, GAP_MAX])
  const gapStatic = useMotionValue(GAP_MAX)
  const gapMV = reduce ? gapStatic : gap

  const frames = designSystems.scalability.frames
  const n = frames.length

  return (
    <>
      {/* The perspective stage. Mobile: short + centered front card. Desktop:
          taller, front card never collides with the SCALABILITY header. */}
      <div ref={stageRef} className="relative mx-auto block h-[340px] w-full max-w-[1240px] pt-4 sm:h-[460px] lg:h-[680px]">
        {/* (floor rail removed — just the receding screens) */}

        {/* cards far → near so nearer paint on top */}
        {frames.map((frame, i) => (
          <FrameCard key={frame.image} frame={frame} index={i} gap={gapMV} total={n} frontX={frontX} vpX={vpX} />
        ))}

        {/* vignette: far half dissolves into the panel black */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 110% at 84% 28%, rgba(7,10,20,0) 26%, rgba(7,10,20,0.6) 60%, rgba(7,10,20,0.98) 86%)',
          }}
        />
      </div>

      {/* (Mobile uses the same perspective stage above, just at a smaller
          height — no separate stacked fallback, no rail lines.) */}
    </>
  )
}

/**
 * One screenshot card, projected from its depth z = index * gap. As `gap` grows
 * on scroll the card recedes along the true perspective path. Two stacked blur
 * layers + a darkening overlay give a smooth, fast depth falloff.
 */
function FrameCard({ frame, index, gap, total, frontX, vpX }: { frame: Frame; index: number; gap: MotionValue<number>; total: number; frontX: number; vpX: number }) {
  // depth ratio d = z / GAP_MAX → drives the cues (front 2 stay crisp).
  const d = useTransform(gap, (g) => (index * g) / GAP_MAX)
  const proj = useTransform(gap, (g) => project(index * g, frontX, vpX))
  const left = useTransform(proj, (pr) => `${pr.x}%`)
  const top = useTransform(proj, (pr) => `${pr.y}%`)
  const scale = useTransform(proj, (pr) => pr.s)
  const darken = useTransform(d, (dd) => darkenForD(dd))
  // split the blur across the outer wrapper and the inner image for a softer,
  // double-applied look (cheap approximation of a gaussian pyramid).
  const blurOuter = useTransform(d, (dd) => `blur(${blurForD(dd) * 0.45}px)`)
  const blurInner = useTransform(d, (dd) => `blur(${blurForD(dd) * 0.55}px)`)

  // Dot on the floor directly below this card + a connector line from the
  // card down to it. Both fade/blur with depth like the card.
  const dotTop = useTransform(proj, (pr) => `${VP_Y + (FLOOR_Y - VP_Y) * pr.s}%`)
  const dotSize = useTransform(proj, (pr) => `${Math.max(3, 11 * pr.s)}px`)
  const cueOpacity = useTransform(d, (dd) => Math.max(0, 1 - dd * 0.32))
  const cueBlur = useTransform(d, (dd) => `blur(${blurForD(dd) * 0.4}px)`)
  // connector line: from card bottom (proj.y + ~half card height in %) to dot
  const lineTop = useTransform(proj, (pr) => `${pr.y}%`)
  const lineHeight = useTransform(proj, (pr) => `${VP_Y + (FLOOR_Y - VP_Y) * pr.s - pr.y}%`)

  // (Rail connector line + floor dot removed — the screens just recede on their
  // own now, no timeline lines.)
  return (
    <motion.div
      className="absolute"
      style={{
        left,
        top,
        width: '70%', // scaled up ~30% from 54% per request
        x: '-50%',
        y: '-50%',
        scale,
        zIndex: total - index,
        filter: blurOuter,
        willChange: 'transform, filter',
      }}
    >
      {/* No border — a white/translucent edge + blur creates a glowing halo.
          Clean clipped corners that simply fade into the black instead. */}
      <motion.div
        className="relative overflow-hidden rounded-xl bg-white"
        style={{ boxShadow: '0 30px 70px -28px rgba(0,0,0,0.7)', filter: blurInner }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={frame.image} alt="Baserate screen" draggable={false} className="block w-full select-none" />
        <motion.div className="pointer-events-none absolute inset-0 bg-[#070a14]" style={{ opacity: darken }} />
      </motion.div>
    </motion.div>
  )
}

/**
 * Floor rail: short horizontal ticker lines at EQUAL z spacing, projected with
 * the same pinhole law so they converge toward the vanishing point. They blur
 * and darken fast — invisible within the first few steps, as in real fog/DOF.
 */
function Rail({ n, gap }: { n: number; gap: MotionValue<number> }) {
  // Many fine z steps (≈4× the old density) — a dense "ground ruler".
  const STEPS = 120
  const ticks = Array.from({ length: STEPS }, (_, i) => i)
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <RailLine n={n} gap={gap} />
      {ticks.map((i) => (
        <RailTick key={i} step={i} steps={STEPS} n={n} gap={gap} />
      ))}
    </div>
  )
}

/** A continuous receding "ground line" along the same floor baseline as the
 *  ticks, so the timeline reads as one line trailing toward the vanishing
 *  point (where individual ticks would be hidden behind the cards). */
function RailLine({ n, gap }: { n: number; gap: MotionValue<number> }) {
  const SEG = 24
  const pts = useTransform(gap, (g) => {
    const arr: string[] = []
    for (let i = 0; i <= SEG; i++) {
      const frac = i / SEG
      const pr = project(frac * (n - 1) * g)
      const y = VP_Y + (FLOOR_Y - VP_Y) * pr.s
      arr.push(`${pr.x},${y}`)
    }
    return arr.join(' ')
  })
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ zIndex: 0 }}>
      <defs>
        {/* the single receding line — bright white, fading only near the VP */}
        <linearGradient id="railLineFade" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,1)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <motion.polyline points={pts} fill="none" stroke="url(#railLineFade)" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function RailTick({ step, steps, n, gap }: { step: number; steps: number; n: number; gap: MotionValue<number> }) {
  // tick depth: spread ticks across the same z-range the cards occupy
  const frac = step / (steps - 1)
  const zMaxRatio = frac * (n - 1) // tick's depth ratio (in GAP_MAX units)
  const proj = useTransform(gap, (g) => project(frac * (n - 1) * g))
  const left = useTransform(proj, (pr) => `${pr.x}%`)
  // ticks live on a dedicated FLOOR baseline below the cards: near the camera
  // it sits at the very bottom of the stage (98%) and recedes up toward the
  // vanishing point as depth increases — so it's the visible "ground ruler"
  // running beneath the floating cards, never hidden behind the front card.
  const top = useTransform(proj, (pr) => `${VP_Y + (FLOOR_Y - VP_Y) * pr.s}%`)
  const width = useTransform(proj, (pr) => `${Math.max(0.3, 4.5 * pr.s)}%`)
  // Visible but clearly dimmer than the bright receding line + connectors.
  const opacity = useTransform(gap, () => Math.max(0, 0.55 - zMaxRatio * 0.14))
  const blur = useTransform(gap, () => `blur(${blurForD(zMaxRatio) * 0.4}px)`)
  return (
    <motion.span
      className="absolute"
      style={{
        left,
        top,
        width,
        height: '1px',
        x: '-50%',
        y: '-50%',
        opacity,
        filter: blur,
        zIndex: 0,
        background: 'rgba(255,255,255,0.9)',
      }}
    />
  )
}
