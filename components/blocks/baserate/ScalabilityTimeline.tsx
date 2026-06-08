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
const VP_Y = 26
// Front card anchor in stage %.
const FRONT_X = 33
const FRONT_Y = 50

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
      <div ref={stageRef} className="relative mx-auto hidden h-[620px] w-full max-w-[1240px] md:block lg:h-[720px]">
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

      {/* ----- Mobile fallback: clean vertical fade-back stack ----- */}
      <div className="mx-auto mt-10 flex max-w-md flex-col gap-5 px-6 md:hidden">
        {frames.map((frame, i) => (
          <div key={frame.image} className="min-w-0" style={{ opacity: 1 - i * 0.14 }}>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={frame.image} alt="Baserate screen" className="w-full" />
            </div>
          </div>
        ))}
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

  return (
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
  )
}

/**
 * Floor rail: short horizontal ticker lines at EQUAL z spacing, projected with
 * the same pinhole law so they converge toward the vanishing point. They blur
 * and darken fast — invisible within the first few steps, as in real fog/DOF.
 */
function Rail({ n, gap }: { n: number; gap: MotionValue<number> }) {
  // Sample many fine z steps from the front out to ~the last card's depth.
  const STEPS = 30
  const ticks = Array.from({ length: STEPS }, (_, i) => i)
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      {ticks.map((i) => (
        <RailTick key={i} step={i} steps={STEPS} n={n} gap={gap} />
      ))}
    </div>
  )
}

function RailTick({ step, steps, n, gap }: { step: number; steps: number; n: number; gap: MotionValue<number> }) {
  // tick depth: spread ticks across the same z-range the cards occupy
  const frac = step / (steps - 1)
  const zMaxRatio = frac * (n - 1) // tick's depth ratio (in GAP_MAX units)
  const proj = useTransform(gap, (g) => project(frac * (n - 1) * g))
  const left = useTransform(proj, (pr) => `${pr.x}%`)
  // ticks sit on the "floor" below the card centers (offset shrinks with depth)
  const top = useTransform(proj, (pr) => `${pr.y + 30 * pr.s}%`)
  const width = useTransform(proj, (pr) => `${Math.max(0.3, 4.5 * pr.s)}%`)
  // brighter near the camera so the receding "floor ruler" is clearly visible
  // for the first few steps, then fading with the same gentle curve as cards.
  const opacity = useTransform(gap, () => Math.max(0, 0.6 - zMaxRatio * 0.16))
  const blur = useTransform(gap, () => `blur(${blurForD(zMaxRatio) * 0.4}px)`)
  return (
    <motion.span
      className="absolute bg-white"
      style={{ left, top, width, height: '1.5px', x: '-50%', y: '-50%', opacity, filter: blur, zIndex: 0 }}
    />
  )
}
