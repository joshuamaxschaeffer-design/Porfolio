'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import { designSystems } from './data'

type Frame = (typeof designSystems.scalability.frames)[number]

/**
 * SCALABILITY — a timeline that recedes into 3D space toward the top-right.
 *
 * Every "stop" on the timeline has a screen position along a path that marches
 * up-and-right toward a vanishing point. At each stop we draw a white dot on
 * the rail, a short tether, and — floating above it — a screenshot card. The
 * front stop (index 0) is the most recent / most complex build: large, sharp,
 * bright. Each step back is smaller, dimmer, blurrier and darker, so the
 * product's history fades into the distance. A line threads through every dot.
 *
 * As the section scrolls into view the whole rig performs a slow parallax
 * "camera" move (rotateX/Y + lift); nearer cards drift more than far ones,
 * which sells the depth. Motion is gated on `prefers-reduced-motion`, and a
 * simple vertical stack takes over on small screens.
 */

// Geometry constants — tuned so cards clearly float above a visible rail.
// The rail (dots + line) lives low in the stage; each card floats well above
// its dot with a visible gap, so the "screens hovering over a receding
// timeline" relationship reads clearly.
const STOPS = (i: number, n: number) => {
  const t = i / (n - 1) // 0 front → 1 far
  return {
    t,
    // dot position on the rail (screen %). marches up + right toward vanishing pt.
    dotX: 16 + t * 60,
    dotY: 90 - t * 34, // rail sits low; recedes upward
    // card center floats this far ABOVE its dot (bigger gap up front).
    lift: 30 + (1 - t) * 12, // % of stage height
    // Scale falloff is HALF as dramatic as before (was t*0.6) — cards stay
    // closer in size as they recede; depth is carried by blur + darkness.
    scale: 1 - t * 0.3,
    // Cards stay fully OPAQUE — a dark overlay (below) deepens with distance
    // instead of fading opacity, so you never see the card behind through one.
    opacity: 1,
    // Blur + darken are MUCH stronger now so the back card is barely visible.
    blur: t * 9,
    darken: t * 0.86,
    dotSize: 14 - t * 8,
    z: -i * 230,
  }
}

export function ScalabilityTimeline() {
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'center center'],
  })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.6 })

  // Camera move: rig starts tilted/low and settles as you arrive.
  const camRotX = useTransform(p, [0, 1], [13, 5])
  const camRotY = useTransform(p, [0, 1], [-18, -12])
  const camY = useTransform(p, [0, 1], [60, 0])

  const frames = designSystems.scalability.frames
  const n = frames.length

  return (
    <>
      {/* ----- Desktop / tablet: the real 3D stage ----- */}
      <div
        ref={stageRef}
        className="relative mx-auto hidden h-[600px] w-full max-w-[1240px] md:block lg:h-[700px]"
        style={{ perspective: '1800px', perspectiveOrigin: '64% 38%' }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            ...(reduce
              ? { transform: 'rotateX(5deg) rotateY(-12deg)' }
              : { rotateX: camRotX, rotateY: camRotY, y: camY }),
          }}
        >
          {/* Rail: line threaded through the dots, drawn first (behind cards). */}
          <Rail n={n} />

          {/* Cards, far → near so nearer ones paint on top. */}
          {frames.map((frame, i) => (
            <FrameCard key={frame.image} frame={frame} index={i} total={n} progress={p} animate={!reduce} />
          ))}
        </motion.div>

        {/* Vignette so the far end melts into the black panel. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(130% 95% at 72% 30%, rgba(7,10,20,0) 34%, rgba(7,10,20,0.5) 76%, rgba(7,10,20,0.95) 100%)',
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

// Sample the same receding path the photo stops use, but at an arbitrary t in
// [0,1] — so the ticker marks can be placed continuously between the stops.
function pathAt(t: number) {
  return { x: 16 + t * 60, y: 90 - t * 34 }
}

/**
 * The rail: a run of thin, short horizontal ticker marks marching along the
 * receding path toward the vanishing point — like a ruler measuring time into
 * the future. Low opacity, fading + shrinking with distance. White dots remain
 * at the photo stops to anchor the year labels.
 */
function Rail({ n }: { n: number }) {
  const stops = Array.from({ length: n }, (_, i) => STOPS(i, n))

  // Many evenly-spaced ticks from the front (t=0) to past the last stop (t=1).
  const TICKS = 46
  const ticks = Array.from({ length: TICKS }, (_, i) => i / (TICKS - 1))

  return (
    <div className="absolute inset-0" style={{ transform: 'translateZ(-1px)' }}>
      {/* ticker marks — short horizontal lines receding into the distance */}
      {ticks.map((t, i) => {
        const p = pathAt(t)
        // near the camera the ticks are wider + brighter; they shrink and fade
        // as they go back, vanishing before the far end.
        const width = 2.6 * (1 - t) + 0.4 // % of stage width
        const opacity = Math.max(0, 0.32 * (1 - t * 1.1))
        return (
          <span
            key={i}
            className="absolute bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${width}%`,
              height: '1px',
              transform: 'translate(-50%, -50%)',
              opacity,
            }}
          />
        )
      })}

      {/* white dots at the 6 photo stops (anchor the year labels) */}
      {stops.map((s, i) => (
        <span
          key={`dot-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.dotX}%`,
            top: `${s.dotY}%`,
            width: `${s.dotSize}px`,
            height: `${s.dotSize}px`,
            transform: 'translate(-50%, -50%)',
            opacity: Math.max(0.3, 1 - s.t * 0.55),
            boxShadow: `0 0 ${16 - s.t * 7}px rgba(255,255,255,${0.75 - s.t * 0.35})`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * One screenshot card floating above its dot. All visuals are a function of the
 * stop's depth `t`. Nearer cards parallax more than far ones as we scroll in.
 */
function FrameCard({
  frame,
  index,
  total,
  progress,
  animate,
}: {
  frame: Frame
  index: number
  total: number
  progress: ReturnType<typeof useSpring>
  animate: boolean
}) {
  const s = STOPS(index, total)

  // Card center sits `lift`% above its dot.
  const cardLeft = s.dotX
  const cardTop = s.dotY - s.lift

  // Parallax: nearer cards lift a touch more than far ones as we scroll in.
  // Combine the -50% centering offset and the px lift into ONE y value so the
  // parallax doesn't clobber the centering. Hooks always run (rules of hooks);
  // we only bind `yCalc` to the element when animating.
  const liftPx = useTransform(progress, [0, 1], [20 * (1 - s.t), 0])
  const yCalc = useTransform(liftPx, (px) => `calc(-50% + ${px}px)`)

  return (
    <>
      {/* tether: a faint vertical line from dot up to the card */}
      <div
        className="absolute"
        style={{
          left: `${s.dotX}%`,
          top: `${cardTop}%`,
          height: `${s.lift}%`,
          width: '1px',
          transform: 'translateX(-50%)',
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.35) 100%)',
          opacity: Math.max(0.3, s.opacity),
          zIndex: total - index,
        }}
      />

      <motion.div
        className="absolute"
        style={{
          left: `${cardLeft}%`,
          top: `${cardTop}%`,
          width: '27%',
          transformStyle: 'preserve-3d',
          zIndex: total - index,
          x: '-50%',
          y: animate ? yCalc : '-50%',
          z: s.z,
          scale: s.scale,
          opacity: s.opacity,
        }}
      >
        <div
          className="relative overflow-hidden rounded-xl border border-white/10 bg-white"
          style={{
            boxShadow: `0 ${28 - s.t * 16}px ${56 - s.t * 28}px -18px rgba(0,0,0,${0.6 - s.t * 0.28})`,
            filter: s.blur ? `blur(${s.blur}px)` : undefined,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={frame.image} alt={`Baserate ${frame.date}`} draggable={false} className="block w-full" />
          <div className="pointer-events-none absolute inset-0 bg-[#070a14]" style={{ opacity: s.darken }} />
        </div>
      </motion.div>

      {/* date label, just below its dot on the rail — nearer few stay legible */}
      {s.t < 0.8 && (
        <span
          className="br-data absolute -translate-x-1/2 whitespace-nowrap font-medium text-white"
          style={{
            left: `${s.dotX}%`,
            top: `calc(${s.dotY}% + ${12 - s.t * 4}px)`,
            fontSize: `${14 - s.t * 5}px`,
            letterSpacing: '0.08em',
            opacity: 1 - s.t * 0.5,
            zIndex: total + 2,
            textShadow: '0 1px 8px rgba(0,0,0,0.8)',
          }}
        >
          {frame.date}
        </span>
      )}
    </>
  )
}
