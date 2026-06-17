'use client'

import { useEffect, useState } from 'react'

/**
 * Gold sparkles + fireworks that animate on and off across the top of the
 * Premium Rewards hero (Figma node 292:25968). Two kinds:
 *   • 'sparkle'  — a four-point twinkle that scales up from nothing, holds for
 *                  a beat, then shrinks/fades away.
 *   • 'firework' — a ring of short rays that BURST outward from the centre
 *                  (rays shoot from 0 → full length while the whole thing fades
 *                  in then out), like a tiny firework.
 *
 * ~20 are sprinkled across the band but each spends most of its loop invisible,
 * with staggered delays + varied periods, so only ~4–5 are ever lit at once.
 * SVGs are hand-built (not Figma exports) so they stay crisp and animate
 * cheaply via CSS. Honours prefers-reduced-motion (everything just sits still
 * at a low opacity, no looping).
 *
 * Pure CSS keyframes (no JS per-frame work) → effectively free at runtime.
 */

const GOLD = '#E8B23A'
const GOLD_LIGHT = '#F4CF6B'

/** One scattered instance. x/y are % of the band; size is px at 1440w-ish. */
interface Spark {
  id: number
  kind: 'sparkle' | 'firework' | 'star' | 'bigFirework'
  x: number // % from left
  y: number // % from top (kept in the upper region)
  size: number // px
  delay: number // s before its first appearance
  period: number // s for one full on→off→idle loop
}

/* A fixed, deliberately-scattered set of ~22 across the top band. Hand-placed
 * (rather than random) so it matches the airy, even spread in the mock and is
 * deterministic between server + client render (no hydration mismatch). */
const SPARKS: Spark[] = [
  { id: 1, kind: 'sparkle', x: 4.4, y: 8, size: 30, delay: 0.0, period: 7.5 },
  { id: 2, kind: 'star', x: 12.6, y: 4.5, size: 15, delay: 2.9, period: 8.2 },
  { id: 3, kind: 'sparkle', x: 28.8, y: 3.2, size: 22, delay: 5.1, period: 9.0 },
  { id: 4, kind: 'firework', x: 44.1, y: 11.5, size: 42, delay: 1.4, period: 8.6 },
  { id: 5, kind: 'sparkle', x: 53.8, y: 4.8, size: 26, delay: 4.3, period: 7.8 },
  { id: 6, kind: 'star', x: 62.0, y: 9.5, size: 18, delay: 6.7, period: 8.9 },
  { id: 7, kind: 'firework', x: 31.0, y: 18.5, size: 38, delay: 3.6, period: 9.4 },
  { id: 8, kind: 'sparkle', x: 89.0, y: 3.5, size: 30, delay: 0.8, period: 8.0 },
  { id: 9, kind: 'star', x: 90.5, y: 25, size: 18, delay: 5.9, period: 9.1 },
  { id: 10, kind: 'firework', x: 96.5, y: 7.5, size: 38, delay: 2.2, period: 8.4 },
  { id: 11, kind: 'star', x: 0.9, y: 21, size: 18, delay: 4.8, period: 9.3 },
  { id: 12, kind: 'sparkle', x: 51.1, y: 0.5, size: 18, delay: 7.4, period: 7.9 },
  { id: 13, kind: 'firework', x: 66.2, y: 27.5, size: 40, delay: 1.9, period: 9.6 },
  { id: 14, kind: 'star', x: 3.5, y: 31.5, size: 16, delay: 6.1, period: 8.7 },
  { id: 15, kind: 'sparkle', x: 17.3, y: 1.5, size: 16, delay: 3.0, period: 8.3 },
  { id: 16, kind: 'sparkle', x: 76.5, y: 2.5, size: 20, delay: 5.4, period: 9.2 },
  { id: 17, kind: 'firework', x: 36.0, y: 1.8, size: 36, delay: 7.9, period: 8.1 },
  { id: 18, kind: 'star', x: 92.7, y: 13, size: 15, delay: 2.6, period: 9.0 },
  { id: 19, kind: 'sparkle', x: 24.5, y: 12, size: 18, delay: 6.4, period: 8.8 },
  { id: 20, kind: 'firework', x: 84.5, y: 18, size: 38, delay: 4.0, period: 9.5 },
  { id: 21, kind: 'sparkle', x: 70.0, y: 5.5, size: 16, delay: 8.6, period: 7.7 },
  { id: 22, kind: 'star', x: 58.5, y: 14, size: 14, delay: 3.8, period: 9.2 },
  // LARGE fireworks (~2× the others), each bursting in two short rounds,
  // spread across the band with varied timing so they don't fire in sync.
  { id: 23, kind: 'bigFirework', x: 52.5, y: 16, size: 76, delay: 2.4, period: 9.8 },
  { id: 24, kind: 'bigFirework', x: 14.0, y: 13, size: 70, delay: 6.2, period: 10.4 },
  { id: 25, kind: 'bigFirework', x: 80.5, y: 9, size: 72, delay: 0.6, period: 9.2 },
  { id: 26, kind: 'bigFirework', x: 38.0, y: 27, size: 66, delay: 8.1, period: 10.0 },
]

/* ── Glyphs ───────────────────────────────────────────────────────────────
 * Each is drawn in a 0 0 100 100 box, centred on (50,50), so a single CSS
 * scale about the centre makes it grow/burst from its middle. */

// Shared sparkle outline path (concave 4-point diamond, hollow centre).
const SPARKLE_D =
  'M50 8 C53 36 64 47 92 50 C64 53 53 64 50 92 C47 64 36 53 8 50 C36 47 47 36 50 8 Z'

/** Four-point sparkle drawn as an OUTLINE stroke. It appears/disappears by
 *  animating STROKE-WIDTH (0 → peak → 0), NOT opacity — so it "inflates" into
 *  view and thins back out to nothing. The outer wrapper still scales it. The
 *  peak stroke width rides on a CSS var (--spk-w) so one keyframe serves both
 *  the bigger sparkle (7) and the smaller star (6). reduced → static at peak. */
function SparkleGlyph({ peak = 7, reduced }: { peak?: number; reduced?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="block h-full w-full overflow-visible"
      aria-hidden
      style={{ ['--spk-w' as string]: `${peak}` }}
    >
      <path
        d={SPARKLE_D}
        fill="none"
        stroke={GOLD}
        strokeWidth={reduced ? peak : 0}
        strokeLinejoin="round"
        strokeLinecap="round"
        className={reduced ? undefined : 'pr-spark-stroke'}
      />
    </svg>
  )
}

/** Small four-point accent — same sparkle, lighter peak stroke. */
function StarGlyph({ reduced }: { reduced?: boolean }) {
  return <SparkleGlyph peak={6} reduced={reduced} />
}

/** Firework rays — 12 round-capped <line>s from an inner radius outward, at TWO
 *  alternating lengths (long / short) like the reference. Each ray is animated
 *  with a TRIM PATH (After-Effects style): stroke-dashoffset sweeps the visible
 *  segment from the inner end out to the tip, then off the tip, so the ray
 *  SHOOTS OUTWARD and retracts — no opacity change. pathLength=1 normalises the
 *  dash math so long & short rays trim identically.
 *
 *  `box` lets the big variant render in a 200-unit viewBox while keeping the
 *  SAME absolute stroke width, so at 2× render size the stroke matches the
 *  small firework's screen weight. Geometry is fractions of `box`.
 *
 *  `animClass` selects which trim keyframe (single burst vs the two rounds), and
 *  the per-instance duration/delay ride on CSS vars (--fw-dur/--fw-delay) set on
 *  the host so one keyframe serves every instance. `reduced` → fully drawn,
 *  static.
 */
function FireworkRays({
  box = 100,
  stroke = 5,
  animClass,
  reduced,
}: {
  box?: number
  stroke?: number
  animClass?: string
  reduced?: boolean
}) {
  const c = box / 2
  const inner = box * 0.16 // gap at the centre
  const long = box * 0.46 // tip radius — long rays
  const short = box * 0.34 // tip radius — short rays
  const rays = Array.from({ length: 12 }, (_, i) => ({ deg: (i * 360) / 12, long: i % 2 === 0 }))
  return (
    <>
      {rays.map(({ deg, long: isLong }) => {
        const r = isLong ? long : short
        return (
          <line
            key={deg}
            x1={c}
            y1={c - inner}
            x2={c}
            y2={c - r}
            stroke={GOLD}
            strokeWidth={stroke}
            strokeLinecap="round"
            pathLength={1}
            className={reduced ? undefined : animClass}
            // reduced-motion (or no animClass) → ray fully drawn & static.
            style={reduced ? { strokeDasharray: 'none' } : undefined}
            transform={`rotate(${deg} ${c} ${c})`}
          />
        )
      })}
    </>
  )
}

function FireworkGlyph({
  period,
  delay,
  reduced,
}: {
  period: number
  delay: number
  reduced: boolean
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="block h-full w-full"
      aria-hidden
      style={{ ['--fw-dur' as string]: `${period}s`, ['--fw-delay' as string]: `${delay}s` }}
    >
      <g>
        <FireworkRays box={100} stroke={7.5} animClass="pr-fw-ray" reduced={reduced} />
      </g>
    </svg>
  )
}

/** Larger firework (2× the others) that bursts in TWO short rounds. Drawn in a
 *  200-unit box with the SAME absolute stroke width so, rendered at 2× the size,
 *  its rays read at the same weight as the small firework. Two ray sets trim
 *  outward in sequence: an inner round fires first (pr-fw-ray-r1), then a second
 *  rotated round a beat later (pr-fw-ray-r2) — both pure trim-path, no opacity. */
function BigFireworkGlyph({
  period,
  delay,
  reduced,
}: {
  period: number
  delay: number
  reduced: boolean
}) {
  const c = 100
  return (
    <svg
      viewBox="0 0 200 200"
      className="block h-full w-full"
      aria-hidden
      style={{ ['--fw-dur' as string]: `${period}s`, ['--fw-delay' as string]: `${delay}s` }}
    >
      {/* round 1 — first burst, trims outward first */}
      <g>
        <FireworkRays box={200} stroke={7.5} animClass="pr-fw-ray-r1" reduced={reduced} />
      </g>
      {/* round 2 — second burst a beat later, rotated 15° so it reads as a new pop */}
      <g transform={`rotate(15 ${c} ${c})`}>
        <FireworkRays box={200} stroke={7.5} animClass="pr-fw-ray-r2" reduced={reduced} />
      </g>
    </svg>
  )
}

function Glyph({
  kind,
  period,
  delay,
  reduced,
}: {
  kind: Spark['kind']
  period: number
  delay: number
  reduced: boolean
}) {
  if (kind === 'bigFirework') return <BigFireworkGlyph period={period} delay={delay} reduced={reduced} />
  if (kind === 'firework') return <FireworkGlyph period={period} delay={delay} reduced={reduced} />
  if (kind === 'star') return <StarGlyph reduced={reduced} />
  return <SparkleGlyph reduced={reduced} />
}

export function Sparkles({ className }: { className?: string }) {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`} aria-hidden>
      {/* Scoped keyframes — all motion is STROKE-BASED (After-Effects trim path
          style), not opacity. Each glyph is lit for only a small slice of its
          loop, so ~4–5 show at once.
          • Fireworks: each ray's visible dash sweeps from the centre out to the
            tip then off it (stroke-dashoffset 1 → 0 → -1) — the ray shoots
            outward and retracts. No opacity. pathLength=1 normalises long/short.
          • Sparkles: the outer wrapper still SCALES in/out, but the glyph
            appears/disappears via STROKE-WIDTH (0 → peak → 0), not opacity. */}
      <style>{`
        /* ── sparkles ──
           Grow THEN shrink: the wrapper scales up to a peak then back down to
           nothing, and the stroke-width inflates then deflates in lock-step, so
           the sparkle blooms open and closes again (no plateau / no abrupt
           vanish). Both peak together at ~16% and return to 0 by ~32%; the rest
           of the loop is idle so only ~4–5 show at once. */
        @keyframes pr-spark-scale {
          0%, 100% { transform: scale(0); }
          16%      { transform: scale(1.12); }
          32%      { transform: scale(0); }
        }
        @keyframes pr-spark-stroke {
          0%, 100% { stroke-width: 0; }
          16%      { stroke-width: var(--spk-w); }
          32%      { stroke-width: 0; }
        }
        .pr-spark-stroke {
          animation: pr-spark-stroke var(--spk-dur, 8s) ease-in-out var(--spk-delay, 0s) infinite;
        }
        /* ── fireworks: trim-path rays ──
           dasharray 1 = one pathLength unit; offset 1 hides the ray (segment
           before the start), 0 = fully drawn inner→tip, -1 = the visible segment
           has slid fully off past the tip. The offset sweeps 1 → 0 → -1: first
           the ray DRAWS OUT from the centre, then the inner end catches up to the
           tip so it collapses to a DOT at the outer edge. At that dot moment
           (offset -1) opacity snaps to 0 so the dot disappears, then the offset
           resets to 1 WHILE invisible and opacity snaps back to 1 when the next
           draw begins. So: shoot out → collapse to an edge dot → dot vanishes →
           re-draw fresh. Stacked steps at the dot make the flip instantaneous.
           linear = even motion. Short burst → ~4–5 fireworks lit at once. */
        @keyframes pr-fw-trim {
          0%   { stroke-dashoffset: 1;  opacity: 1; }  /* start drawing */
          7%   { stroke-dashoffset: 0;  opacity: 1; }  /* fully extended */
          12%  { stroke-dashoffset: -1; opacity: 1; }  /* collapsed to edge dot */
          12.01% { stroke-dashoffset: -1; opacity: 0; }/* dot vanishes */
          12.02% { stroke-dashoffset: 1;  opacity: 0; }/* reset to start, hidden */
          100% { stroke-dashoffset: 1;  opacity: 0; }  /* wait (idle) */
        }
        .pr-fw-ray {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          opacity: 0;
          animation: pr-fw-trim var(--fw-dur, 8s) linear var(--fw-delay, 0s) infinite;
        }
        /* Big firework — two rounds. Round 1 fires first; round 2 a beat later
           (own keyframe). Both: draw out → collapse to edge dot → vanish. */
        .pr-fw-ray-r1 {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          opacity: 0;
          animation: pr-fw-trim var(--fw-dur, 8s) linear var(--fw-delay, 0s) infinite;
        }
        .pr-fw-ray-r2 {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          opacity: 0;
          animation: pr-fw-trim-late var(--fw-dur, 8s) linear var(--fw-delay, 0s) infinite;
        }
        /* second round: same sweep, shifted to start right after round 1. */
        @keyframes pr-fw-trim-late {
          0%, 8% { stroke-dashoffset: 1;  opacity: 0; } /* idle until r2 fires */
          8.01%  { stroke-dashoffset: 1;  opacity: 1; } /* start drawing */
          15%    { stroke-dashoffset: 0;  opacity: 1; } /* fully extended */
          20%    { stroke-dashoffset: -1; opacity: 1; } /* collapsed to edge dot */
          20.01% { stroke-dashoffset: -1; opacity: 0; } /* dot vanishes */
          20.02% { stroke-dashoffset: 1;  opacity: 0; } /* reset, hidden */
          100%   { stroke-dashoffset: 1;  opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pr-spark-stroke, .pr-fw-ray, .pr-fw-ray-r1, .pr-fw-ray-r2 { animation: none; }
        }
      `}</style>

      {SPARKS.map((s) => {
        const isSpark = s.kind === 'sparkle' || s.kind === 'star'
        // Sparkles still SCALE on the wrapper (stroke-width handles appear/
        // disappear inside the glyph). Fireworks carry no wrapper animation —
        // their rays trim via CSS vars set on the inner <svg>.
        const wrapperStyle: React.CSSProperties = {
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: `clamp(${Math.round(s.size * 0.55)}px, ${s.size / 14.4}vw, ${s.size}px)`,
          aspectRatio: '1 / 1',
          // centre the node, then (for sparkles) scale about that centre
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }
        if (isSpark && !reduced) {
          // expose the stroke-width animation timing to the glyph + drive scale
          ;(wrapperStyle as Record<string, string | number>)['--spk-dur'] = `${s.period}s`
          ;(wrapperStyle as Record<string, string | number>)['--spk-delay'] = `${s.delay}s`
        }
        return (
          <div key={s.id} className="absolute" style={wrapperStyle}>
            {/* inner layer owns the scale (kept off the centring transform) */}
            <div
              className="h-full w-full"
              style={
                isSpark && !reduced
                  ? { animation: `pr-spark-scale ${s.period}s ease-in-out ${s.delay}s infinite` }
                  : undefined
              }
            >
              <Glyph kind={s.kind} period={s.period} delay={s.delay} reduced={reduced} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
