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
const F = 1100 // focal length (px-ish, in the same units as z)
const GAP_MAX = 900 // real z-distance between adjacent cards when fully spread
const GAP_MIN = 70 // when clustered at the front (scroll start)
// Vanishing point in stage % — where everything converges as z → ∞.
const VP_X = 86
const VP_Y = 30
// Front card anchor in stage %.
const FRONT_X = 30
const FRONT_Y = 52

// Project a depth z (>=0) → {scale, screenX%, screenY%} via the pinhole law.
function project(z: number) {
  const s = F / (F + z) // 1 at z=0, →0 far away
  // interpolate from the front anchor toward the VP by how far we've receded
  const k = 1 - s
  return {
    s,
    x: FRONT_X + (VP_X - FRONT_X) * k,
    y: FRONT_Y + (VP_Y - FRONT_Y) * k,
  }
}

// Depth cues from the scale factor. Tuned (steep) so the 2nd card back is
// already deeply dimmed and the 3rd+ have all but dissolved into the black —
// matching real atmospheric/DOF falloff in the reference.
function darkenFor(s: number) {
  // (1-s) for cards: c1≈0.45, c2≈0.62, c3≈0.71 → push hard with a low exponent.
  return Math.min(0.96, Math.pow(1 - s, 0.55) * 1.95)
}
function blurFor(s: number) {
  return Math.pow(1 - s, 0.7) * 42 // px (split across two layers)
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
  const proj = useTransform(gap, (g) => project(index * g))
  const left = useTransform(proj, (pr) => `${pr.x}%`)
  const top = useTransform(proj, (pr) => `${pr.y}%`)
  const scale = useTransform(proj, (pr) => pr.s)
  const darken = useTransform(proj, (pr) => darkenFor(pr.s))
  // split the blur across the outer wrapper and the inner image for a softer,
  // double-applied look (cheap approximation of a gaussian pyramid).
  const blurOuter = useTransform(proj, (pr) => `blur(${blurFor(pr.s) * 0.45}px)`)
  const blurInner = useTransform(proj, (pr) => `blur(${blurFor(pr.s) * 0.55}px)`)

  return (
    <motion.div
      className="absolute"
      style={{
        left,
        top,
        width: '40%',
        x: '-50%',
        y: '-50%',
        scale,
        zIndex: total - index,
        filter: blurOuter,
        willChange: 'transform, filter',
      }}
    >
      <motion.div
        className="relative overflow-hidden rounded-xl border border-white/10 bg-white"
        style={{ boxShadow: '0 30px 60px -24px rgba(0,0,0,0.6)', filter: blurInner }}
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
  // tick depth: spread the ticks across the same z-range the cards occupy
  const frac = step / (steps - 1)
  const proj = useTransform(gap, (g) => {
    const zMax = (n - 1) * g
    return project(frac * zMax * 1.05)
  })
  const left = useTransform(proj, (pr) => `${pr.x}%`)
  // ticks sit a bit BELOW the card centers, on the "floor"
  const top = useTransform(proj, (pr) => `${pr.y + 26 * pr.s}%`)
  const width = useTransform(proj, (pr) => `${Math.max(0.2, 3.2 * pr.s)}%`)
  const opacity = useTransform(proj, (pr) => Math.max(0, 0.32 * Math.pow(pr.s, 2.2)))
  const blur = useTransform(proj, (pr) => `blur(${blurFor(pr.s) * 0.5}px)`)
  return (
    <motion.span
      className="absolute bg-white"
      style={{ left, top, width, height: '1px', x: '-50%', y: '-50%', opacity, filter: blur }}
    />
  )
}
