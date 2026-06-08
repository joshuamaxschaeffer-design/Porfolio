'use client'

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
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
const FRONT_Y = 40
// The floor baseline (near-camera) the rail line + ticks rest on — well below
// the card stack so the timeline is never occluded by the big front card.
// (Pushed lower so the receding ground line + dots read clearly.)
const FLOOR_Y = 99

// Project a depth z (>=0) → {scale, screenX%, screenY%} via the pinhole law.
function project(z: number) {
  const s = F / (F + z) // 1 at z=0, →0 far away
  const k = 1 - s
  return {
    s,
    x: FRONT_X + (VP_X - FRONT_X) * k,
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
      {/* ----- Desktop / tablet: the perspective stage ----- */}
      {/* taller + top padding so the front card never collides with the
          SCALABILITY header above it */}
      <div ref={stageRef} className="relative mx-auto hidden h-[720px] w-full max-w-[1240px] pt-16 md:block lg:h-[820px]">
        {/* floor rail (behind everything) */}
        <Rail n={n} gap={gapMV} />

        {/* cards far → near so nearer paint on top */}
        {frames.map((frame, i) => (
          <FrameCard key={frame.image} frame={frame} index={i} gap={gapMV} total={n} />
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

      {/* ----- Mobile: clamped depth stack. The perspective scene can't fit a
          phone (Baserate Mobile Spec §7), so we keep the *metaphor* — scrolling
          DOWN = moving forward in time — as a vertical sequence with a shallow,
          clamped depth cue (decreasing scale floored so text stays legible, +
          decreasing opacity, + a slight overlap) and a thin rail down the side
          echoing the desktop timeline. No live blur (GPU-cheap). ----- */}
      <div className="relative mx-auto mt-10 max-w-md px-6 md:hidden">
        {/* thin rail running down the stack */}
        <div
          aria-hidden
          className="absolute bottom-6 left-[34px] top-2 w-px"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.45), rgba(255,255,255,0.06))' }}
        />
        <div className="flex flex-col">
          {frames.map((frame, i) => {
            // clamp the falloff: scale floors at 0.78 so the deepest card's UI
            // stays readable; opacity floors at 0.45; cards overlap slightly.
            const scale = Math.max(0.78, 1 - i * 0.05)
            const opacity = Math.max(0.45, 1 - i * 0.12)
            return (
              <div
                key={frame.image}
                className="relative min-w-0"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'center top',
                  opacity,
                  marginTop: i === 0 ? 0 : -18,
                  zIndex: frames.length - i,
                }}
              >
                {/* floor dot on the rail, aligned to this card */}
                <span
                  aria-hidden
                  className="absolute -left-[2px] top-5 h-2 w-2 -translate-x-1/2 rounded-full"
                  style={{ background: '#000', border: '1.5px solid rgba(255,255,255,0.9)' }}
                />
                <div className="ml-6 overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.7)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={frame.image} alt="Baserate screen" className="w-full" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

/**
 * One screenshot card, projected from its depth z = index * gap. As `gap` grows
 * on scroll the card recedes along the true perspective path. Two stacked blur
 * layers + a darkening overlay give a smooth, fast depth falloff.
 */
function FrameCard({ frame, index, gap, total }: { frame: Frame; index: number; gap: MotionValue<number>; total: number }) {
  // depth ratio d = z / GAP_MAX → drives the cues (front 2 stay crisp).
  const d = useTransform(gap, (g) => (index * g) / GAP_MAX)
  const proj = useTransform(gap, (g) => project(index * g))
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

  return (
    <>
      {/* connector line (card → floor dot) — matches the receding line's 1px
          weight + lighter color */}
      <motion.div
        className="absolute"
        style={{
          left,
          top: lineTop,
          height: lineHeight,
          width: '1.5px',
          x: '-50%',
          background: 'rgba(255,255,255,1)',
          opacity: cueOpacity,
          filter: cueBlur,
          zIndex: 0,
        }}
      />
      {/* floor dot — solid black fill + white stroke (not a grey fill) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left,
          top: dotTop,
          width: dotSize,
          height: dotSize,
          x: '-50%',
          y: '-50%',
          opacity: cueOpacity,
          filter: cueBlur,
          background: '#000000',
          border: '1.5px solid rgba(255,255,255,1)',
          zIndex: 0,
        }}
      />

    <motion.div
      className="absolute"
      style={{
        left,
        top,
        width: '54%',
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
    </>
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
