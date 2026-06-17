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
  kind: 'sparkle' | 'firework' | 'star'
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
  { id: 4, kind: 'firework', x: 44.1, y: 11.5, size: 30, delay: 1.4, period: 8.6 },
  { id: 5, kind: 'sparkle', x: 53.8, y: 4.8, size: 26, delay: 4.3, period: 7.8 },
  { id: 6, kind: 'star', x: 62.0, y: 9.5, size: 18, delay: 6.7, period: 8.9 },
  { id: 7, kind: 'firework', x: 45.3, y: 6.8, size: 24, delay: 3.6, period: 9.4 },
  { id: 8, kind: 'sparkle', x: 89.0, y: 3.5, size: 30, delay: 0.8, period: 8.0 },
  { id: 9, kind: 'star', x: 90.5, y: 25, size: 18, delay: 5.9, period: 9.1 },
  { id: 10, kind: 'firework', x: 96.5, y: 7.5, size: 26, delay: 2.2, period: 8.4 },
  { id: 11, kind: 'star', x: 0.9, y: 21, size: 18, delay: 4.8, period: 9.3 },
  { id: 12, kind: 'sparkle', x: 51.1, y: 0.5, size: 18, delay: 7.4, period: 7.9 },
  { id: 13, kind: 'firework', x: 66.2, y: 27.5, size: 28, delay: 1.9, period: 9.6 },
  { id: 14, kind: 'star', x: 3.5, y: 31.5, size: 16, delay: 6.1, period: 8.7 },
  { id: 15, kind: 'sparkle', x: 17.3, y: 1.5, size: 16, delay: 3.0, period: 8.3 },
  { id: 16, kind: 'sparkle', x: 76.5, y: 2.5, size: 20, delay: 5.4, period: 9.2 },
  { id: 17, kind: 'firework', x: 36.0, y: 1.8, size: 22, delay: 7.9, period: 8.1 },
  { id: 18, kind: 'star', x: 92.7, y: 13, size: 15, delay: 2.6, period: 9.0 },
  { id: 19, kind: 'sparkle', x: 24.5, y: 12, size: 18, delay: 6.4, period: 8.8 },
  { id: 20, kind: 'firework', x: 84.5, y: 18, size: 22, delay: 4.0, period: 9.5 },
  { id: 21, kind: 'sparkle', x: 70.0, y: 5.5, size: 16, delay: 8.6, period: 7.7 },
  { id: 22, kind: 'star', x: 58.5, y: 14, size: 14, delay: 3.8, period: 9.2 },
]

/* ── Glyphs ───────────────────────────────────────────────────────────────
 * Each is drawn in a 0 0 100 100 box, centred on (50,50), so a single CSS
 * scale about the centre makes it grow/burst from its middle. */

/** Four-point "twinkle" sparkle — concave diamond with a soft inner core. */
function SparkleGlyph() {
  return (
    <svg viewBox="0 0 100 100" className="block h-full w-full" aria-hidden>
      <path
        d="M50 2 C54 34 66 46 98 50 C66 54 54 66 50 98 C46 66 34 54 2 50 C34 46 46 34 50 2 Z"
        fill={GOLD}
      />
      <path
        d="M50 24 C52 44 56 48 76 50 C56 52 52 56 50 76 C48 56 44 52 24 50 C44 48 48 44 50 24 Z"
        fill={GOLD_LIGHT}
      />
    </svg>
  )
}

/** Simple thin four-point star (the small "Stroke" accents in the mock). */
function StarGlyph() {
  return (
    <svg viewBox="0 0 100 100" className="block h-full w-full" aria-hidden>
      <path
        d="M50 6 C53 38 62 47 94 50 C62 53 53 62 50 94 C47 62 38 53 6 50 C38 47 47 38 50 6 Z"
        fill={GOLD}
      />
    </svg>
  )
}

/** Firework — 12 tapered rays radiating from the centre. The rays themselves
 *  scale out from r0 via a child <g> so they "shoot" from the middle. */
function FireworkGlyph() {
  const rays = Array.from({ length: 12 }, (_, i) => (i * 360) / 12)
  return (
    <svg viewBox="0 0 100 100" className="block h-full w-full" aria-hidden>
      <g>
        {rays.map((deg) => (
          <rect
            key={deg}
            x="48.7"
            y="6"
            width="2.6"
            height="30"
            rx="1.3"
            fill={GOLD}
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="3.2" fill={GOLD_LIGHT} />
    </svg>
  )
}

function Glyph({ kind }: { kind: Spark['kind'] }) {
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
      `}</style>

      {SPARKS.map((s) => {
        const isFw = s.kind === 'firework'
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
              // The fade/scale loop. Reduced motion → hold faint & still.
              opacity: reduced ? 0.5 : undefined,
              animation: reduced
                ? undefined
                : `${isFw ? 'pr-fw-fade' : 'pr-spark-pop'} ${s.period}s ease-in-out ${s.delay}s infinite`,
              willChange: 'transform, opacity',
            }}
          >
            {/* Firework rays get their own burst animation on the inner <g>. */}
            {isFw && !reduced ? (
              <div
                className="h-full w-full"
                style={{ animation: `pr-fw-burst ${s.period}s ease-out ${s.delay}s infinite` }}
              >
                <Glyph kind={s.kind} />
              </div>
            ) : (
              <Glyph kind={s.kind} />
            )}
          </div>
        )
      })}
    </div>
  )
}
