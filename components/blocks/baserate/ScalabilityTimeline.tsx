'use client'

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { designSystems } from './data'

type Frame = (typeof designSystems.scalability.frames)[number]

/**
 * SCALABILITY — a "zoom-out" timeline that reads as a 3D environment.
 *
 * As the section scrolls in, the camera dollies BACKWARD: the cards start
 * clustered near the viewer (front card large, the rest stacked close behind),
 * then spread into depth — each one receding, shrinking, blurring and darkening.
 * A rail of dots + short ticker lines sits BEHIND the cards on the floor and
 * moves with the exact same camera, so the whole thing feels like one space.
 *
 * Implementation: a single scroll progress `p` (0 = clustered, 1 = fully zoomed
 * out) feeds every element. Each card has a base depth `i`; its effective depth
 * is `i * zoom(p)`, and position/scale/blur/darken all derive from that. The
 * rail samples the same depth→screen mapping, so card N always floats above its
 * dot. Dates count UP into the future (front = nearest year).
 */

// How clustered (p=0) vs spread (p=1) the depths are.
const ZOOM_MIN = 0.18
const ZOOM_MAX = 1

// Map an effective depth d (0 = front) to all visual properties. `d` already
// folds in the zoom, so this is the single source of truth for both cards and
// the rail beneath them.
function depthProps(d: number) {
  return {
    // screen path: marches up + right toward the vanishing point
    x: 16 + d * 13.5, // %
    y: 70 - d * 9, // % (card center; higher = further back)
    railY: 92 - d * 8.5, // % (rail sits lower than the cards)
    scale: 1 / (1 + d * 0.5), // perspective-ish shrink
    blur: d * 2.7, // px
    darken: Math.min(0.9, d * 0.2), // overlay alpha
    dotSize: Math.max(4, 13 - d * 2.2), // px
  }
}

export function ScalabilityTimeline() {
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'center center'],
  })
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.6 })

  // zoom: 0 → ZOOM_MIN (clustered), 1 → ZOOM_MAX (spread out)
  const zoom = useTransform(p, [0, 1], [ZOOM_MIN, ZOOM_MAX])
  // reduced-motion users get the fully-spread end state, static
  const zoomStatic = useMotionValue(ZOOM_MAX)
  const zoomMV = reduce ? zoomStatic : zoom

  const frames = designSystems.scalability.frames
  const n = frames.length

  return (
    <>
      {/* ----- Desktop / tablet: the zoom-out 3D stage ----- */}
      <div
        ref={stageRef}
        className="relative mx-auto hidden h-[600px] w-full max-w-[1240px] md:block lg:h-[700px]"
      >
        {/* Rail FIRST so it paints behind every card. */}
        <Rail n={n} zoom={zoomMV} />

        {/* Cards far → near so nearer paint on top. */}
        {frames.map((frame, i) => (
          <FrameCard key={frame.image} frame={frame} index={i} zoom={zoomMV} total={n} />
        ))}

        {/* Vignette so the far end melts into the black panel. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(135% 100% at 70% 26%, rgba(7,10,20,0) 30%, rgba(7,10,20,0.55) 74%, rgba(7,10,20,0.96) 100%)',
          }}
        />
      </div>

      {/* ----- Mobile fallback: clean vertical fade-back stack ----- */}
      <div className="mx-auto mt-10 flex max-w-md flex-col gap-5 px-6 md:hidden">
        {frames.map((frame, i) => (
          <div key={frame.image} className="flex items-center gap-4">
            <div className="flex flex-col items-center self-stretch pt-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
              {i < n - 1 && <span className="mt-1 w-px flex-1 bg-white/20" />}
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-lg"
                style={{ opacity: 1 - i * 0.12 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={frame.image} alt={`Baserate ${frame.date}`} className="w-full" />
              </div>
            </div>
            <span className="br-data shrink-0 self-start pt-1 text-xs text-white/50">{frame.date}</span>
          </div>
        ))}
      </div>
    </>
  )
}

/**
 * One screenshot card. Its effective depth = index * zoom, so as `zoom` grows
 * (scroll) the deeper cards push further back — a dolly-out. Position, scale,
 * blur and darken all derive from that depth via depthProps().
 */
function FrameCard({
  frame,
  index,
  zoom,
  total,
}: {
  frame: Frame
  index: number
  zoom: MotionValue<number>
  total: number
}) {
  // Everything is a transform of the effective depth (index * zoom).
  const left = useTransform(zoom, (z) => `${depthProps(index * z).x}%`)
  const top = useTransform(zoom, (z) => `${depthProps(index * z).y}%`)
  const scale = useTransform(zoom, (z) => depthProps(index * z).scale)
  const blur = useTransform(zoom, (z) => `blur(${depthProps(index * z).blur}px)`)
  const darken = useTransform(zoom, (z) => depthProps(index * z).darken)
  // date sits just below the card's dot on the rail
  const dateTop = useTransform(zoom, (z) => `${depthProps(index * z).railY}%`)
  const dateOpacity = useTransform(zoom, (z) => Math.max(0, 1 - index * z * 0.5))
  const dateSize = useTransform(zoom, (z) => `${Math.max(9, 14 - index * z * 2)}px`)

  return (
    <>
      <motion.div
        className="absolute"
        style={{
          left,
          top,
          width: '34%',
          x: '-50%',
          y: '-50%',
          scale,
          zIndex: total - index,
          filter: blur,
          willChange: 'transform, filter',
        }}
      >
        <div
          className="relative overflow-hidden rounded-xl border border-white/10 bg-white"
          style={{ boxShadow: '0 30px 60px -24px rgba(0,0,0,0.6)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={frame.image} alt={`Baserate ${frame.date}`} draggable={false} className="block w-full select-none" />
          <motion.div className="pointer-events-none absolute inset-0 bg-[#070a14]" style={{ opacity: darken }} />
        </div>
      </motion.div>

      {/* year label, anchored to this card's dot on the rail */}
      <motion.span
        className="br-data absolute -translate-x-1/2 whitespace-nowrap font-medium text-white"
        style={{
          left,
          top: dateTop,
          fontSize: dateSize,
          letterSpacing: '0.08em',
          opacity: dateOpacity,
          zIndex: total + 2,
          textShadow: '0 1px 8px rgba(0,0,0,0.85)',
        }}
      >
        {frame.date}
      </motion.span>
    </>
  )
}

/**
 * The rail: white dots at each photo stop + a run of thin ticker lines between
 * them, all on the "floor" behind the cards. Driven by the SAME zoom value so
 * it dollies out in lockstep, and each mark blurs + dims with depth exactly
 * like the cards above it.
 */
function Rail({ n, zoom }: { n: number; zoom: MotionValue<number> }) {
  // Dots at integer depths 0..n-1; ticks at fine fractional depths between.
  const dotDepths = Array.from({ length: n }, (_, i) => i)
  const TICKS_PER_GAP = 5
  const tickDepths: number[] = []
  for (let i = 0; i < (n - 1) * TICKS_PER_GAP + 1; i++) tickDepths.push(i / TICKS_PER_GAP)

  return (
    // zIndex 0 keeps the whole rail behind the cards (which start at zIndex >= 1)
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      {tickDepths.map((bd, i) => (
        <RailTick key={`t${i}`} baseDepth={bd} zoom={zoom} />
      ))}
      {dotDepths.map((bd, i) => (
        <RailDot key={`d${i}`} baseDepth={bd} zoom={zoom} />
      ))}
    </div>
  )
}

function RailTick({ baseDepth, zoom }: { baseDepth: number; zoom: MotionValue<number> }) {
  const left = useTransform(zoom, (z) => `${depthProps(baseDepth * z).x}%`)
  const top = useTransform(zoom, (z) => `${depthProps(baseDepth * z).railY}%`)
  const width = useTransform(zoom, (z) => `${Math.max(0.3, 2.4 / (1 + baseDepth * z * 0.5))}%`)
  // fade + blur with depth, matching the cards
  const opacity = useTransform(zoom, (z) => Math.max(0, 0.3 * (1 - baseDepth * z * 0.5)))
  const blur = useTransform(zoom, (z) => `blur(${baseDepth * z * 1.6}px)`)
  return (
    <motion.span
      className="absolute bg-white"
      style={{ left, top, width, height: '1px', x: '-50%', y: '-50%', opacity, filter: blur }}
    />
  )
}

function RailDot({ baseDepth, zoom }: { baseDepth: number; zoom: MotionValue<number> }) {
  const left = useTransform(zoom, (z) => `${depthProps(baseDepth * z).x}%`)
  const top = useTransform(zoom, (z) => `${depthProps(baseDepth * z).railY}%`)
  const size = useTransform(zoom, (z) => `${depthProps(baseDepth * z).dotSize}px`)
  const opacity = useTransform(zoom, (z) => Math.max(0.15, 1 - baseDepth * z * 0.45))
  const blur = useTransform(zoom, (z) => `blur(${baseDepth * z * 1.6}px)`)
  const shadow = useTransform(zoom, (z) => `0 0 ${Math.max(2, 14 - baseDepth * z * 4)}px rgba(255,255,255,0.6)`)
  return (
    <motion.span
      className="absolute rounded-full bg-white"
      style={{ left, top, width: size, height: size, x: '-50%', y: '-50%', opacity, filter: blur, boxShadow: shadow }}
    />
  )
}
