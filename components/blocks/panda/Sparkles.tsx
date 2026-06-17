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
  // One LARGE firework (~2× the others) bursting in two short rounds.
  { id: 23, kind: 'bigFirework', x: 52.5, y: 16, size: 76, delay: 2.4, period: 9.8 },
]

/* ── Glyphs ───────────────────────────────────────────────────────────────
 * Each is drawn in a 0 0 100 100 box, centred on (50,50), so a single CSS
 * scale about the centre makes it grow/burst from its middle. */

/** Four-point sparkle drawn as an OUTLINE stroke — a concave diamond with a
 *  hollow centre and rounded points (matches the reference). Stroke width 7 in
 *  the 100-unit box → same visual weight family as the fireworks. */
function SparkleGlyph() {
  return (
    <svg viewBox="0 0 100 100" className="block h-full w-full" aria-hidden>
      <path
        d="M50 8 C53 36 64 47 92 50 C64 53 53 64 50 92 C47 64 36 53 8 50 C36 47 47 36 50 8 Z"
        fill="none"
        stroke={GOLD}
        strokeWidth={7}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Small four-point accent — same outlined sparkle, lighter stroke so it reads
 *  as a smaller twinkle among the bigger sparkles/fireworks. */
function StarGlyph() {
  return (
    <svg viewBox="0 0 100 100" className="block h-full w-full" aria-hidden>
      <path
        d="M50 8 C53 36 64 47 92 50 C64 53 53 64 50 92 C47 64 36 53 8 50 C36 47 47 36 50 8 Z"
        fill="none"
        stroke={GOLD}
        strokeWidth={6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Firework — 12 thick rounded rays radiating from the centre, at TWO
 *  alternating lengths (long / short) like the reference. Drawn as round-capped
 *  <line>s from an inner radius outward; the parent <g> scales them out from the
 *  middle so they "shoot" on burst. STROKE is the shared firework weight (5).
 *
 *  `box` lets the big variant render in a 200-unit viewBox while keeping the
 *  SAME absolute stroke width, so at 2× render size the stroke matches the
 *  small firework's screen weight. Geometry is expressed as fractions of `box`.
 */
function FireworkRays({ box = 100, stroke = 5 }: { box?: number; stroke?: number }) {
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
            transform={`rotate(${deg} ${c} ${c})`}
          />
        )
      })}
    </>
  )
}

function FireworkGlyph() {
  return (
    <svg viewBox="0 0 100 100" className="block h-full w-full" aria-hidden>
      <g>
        <FireworkRays box={100} stroke={7.5} />
      </g>
    </svg>
  )
}

/** Larger firework (2× the others) that bursts in TWO short rounds. Drawn in a
 *  200-unit box with the SAME absolute stroke width (5) so, rendered at 2× the
 *  size, its rays read at the same weight as the small firework. Two ray sets
 *  are stacked: an OUTER long set and an INNER short set, each on its own <g>
 *  so they can pop in sequence (see the .pr-bigfw-* keyframes). */
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
  const r1 = reduced ? undefined : `pr-bigfw-round1 ${period}s ease-out ${delay}s infinite`
  const r2 = reduced ? undefined : `pr-bigfw-round2 ${period}s ease-out ${delay}s infinite`
  return (
    <svg viewBox="0 0 200 200" className="block h-full w-full" aria-hidden>
      {/* round 1 — first burst (shorter rays, fires first) */}
      <g style={{ transformOrigin: `${c}px ${c}px`, transformBox: 'view-box', animation: r1, opacity: reduced ? 1 : 0 }}>
        <FireworkRays box={200} stroke={7.5} />
      </g>
      {/* round 2 — second burst a beat later, rotated 15° so it reads as a new pop */}
      <g style={{ transformOrigin: `${c}px ${c}px`, transformBox: 'view-box', animation: r2, opacity: reduced ? 1 : 0 }}>
        <g transform={`rotate(15 ${c} ${c})`}>
          <FireworkRays box={200} stroke={7.5} />
        </g>
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
  if (kind === 'firework') return <FireworkGlyph />
  if (kind === 'star') return <StarGlyph />
  return <SparkleGlyph />
}

export function Sparkles({ className }: { className?: string }) {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`} aria-hidden>
      {/* Scoped keyframes. The "on" window is a small slice of each loop, so
          most of the time a given spark is invisible → only ~4–5 lit at once.
          • sparkle/star: scale 0 → 1 (overshoot) → 0 with a matching fade.
          • firework: the whole node fades in/out while its rays scale out from
            the centre (handled by .pr-fw-rays). */}
      <style>{`
        @keyframes pr-spark-pop {
          0%, 100% { opacity: 0; transform: scale(0); }
          7%       { opacity: 1; transform: scale(1.12); }
          12%      { opacity: 1; transform: scale(0.96); }
          20%      { opacity: 1; transform: scale(1); }
          30%      { opacity: 0; transform: scale(0.35); }
        }
        @keyframes pr-fw-fade {
          0%, 100% { opacity: 0; }
          6%       { opacity: 1; }
          22%      { opacity: 1; }
          34%      { opacity: 0; }
        }
        @keyframes pr-fw-burst {
          0%   { transform: scale(0.05); }
          30%  { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
        /* Big firework — two short rounds. Round 1 pops first and holds; round 2
           fires a beat later (rotated 15°) so it reads as a fresh burst. Each
           group carries its OWN scale + opacity (no parent fade), giving the
           two-pop appear-then-disappear. */
        @keyframes pr-bigfw-round1 {
          0%   { transform: scale(0.05); opacity: 0; }
          5%   { transform: scale(0.85); opacity: 1; }
          12%  { transform: scale(1); opacity: 1; }
          34%  { transform: scale(1.05); opacity: 1; }
          40%  { opacity: 0; }
          100% { transform: scale(1.05); opacity: 0; }
        }
        @keyframes pr-bigfw-round2 {
          0%, 12%  { transform: scale(0.05); opacity: 0; }
          18%      { transform: scale(0.9); opacity: 1; }
          24%      { transform: scale(1.12); opacity: 1; }
          34%      { transform: scale(1.18); opacity: 1; }
          40%      { opacity: 0; }
          100%     { transform: scale(1.18); opacity: 0; }
        }
      `}</style>

      {SPARKS.map((s) => {
        const isFw = s.kind === 'firework'
        const isBig = s.kind === 'bigFirework'
        // The big firework manages its own opacity + two-round bursts on its
        // inner groups, so its outer node carries NO fade/scale animation.
        const outerAnim = reduced || isBig
          ? undefined
          : `${isFw ? 'pr-fw-fade' : 'pr-spark-pop'} ${s.period}s ease-in-out ${s.delay}s infinite`
        return (
          <div
            key={s.id}
            className="absolute"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `clamp(${Math.round(s.size * 0.55)}px, ${s.size / 14.4}vw, ${s.size}px)`,
              aspectRatio: '1 / 1',
              transform: 'translate(-50%, -50%)',
              // Reduced motion → hold faint & still. Big firework keeps full
              // opacity at the node level (its rounds fade themselves).
              opacity: reduced ? (isBig ? 0.5 : 0.5) : undefined,
              animation: outerAnim,
              willChange: 'transform, opacity',
            }}
          >
            {/* Small firework's rays get a single burst on an inner div. */}
            {isFw && !reduced ? (
              <div
                className="h-full w-full"
                style={{ animation: `pr-fw-burst ${s.period}s ease-out ${s.delay}s infinite` }}
              >
                <Glyph kind={s.kind} period={s.period} delay={s.delay} reduced={reduced} />
              </div>
            ) : (
              <Glyph kind={s.kind} period={s.period} delay={s.delay} reduced={reduced} />
            )}
          </div>
        )
      })}
    </div>
  )
}
