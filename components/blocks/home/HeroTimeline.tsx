'use client'

import { useRef, useState } from 'react'

/**
 * Hero process timeline (Figma 335-73237). A thin horizontal line with 6 evenly
 * spaced tick marks, spanning from just after the "DESIGN SOLUTIONS" label to
 * the right edge of the SCHAEFFER wordmark.
 *
 * Interaction: the dark navy selector bar FOLLOWS the cursor horizontally across
 * the track (clamped to the ends). The phase NAME swaps at the MIDPOINT between
 * two ticks — i.e. it shows whichever tick's zone the cursor is in. A thin white
 * line sits in front of the dark bar. A tooltip with the phase name + an upward
 * beak rides under the bar. The trigger zone is tall (3×) so it's not finicky.
 * Styles matched to the Figma dev code: Recursive, #070e2c, rounded-2px, soft shadow.
 */
const PHASES = ['Strategy', 'Branding', 'UX', 'UI', 'Implementation', 'Marketing']

export function HeroTimeline({ className = '' }: { className?: string }) {
  const track = useRef<HTMLDivElement>(null)
  // x = pointer position across the track in 0..1; null when not hovering.
  const [x, setX] = useState<number | null>(null)

  const onMove = (e: React.PointerEvent) => {
    const el = track.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setX(Math.max(0, Math.min(1, (e.clientX - r.left) / (r.width || 1))))
  }

  const n = PHASES.length
  // active phase = the zone the cursor is in (zones split at the midpoints).
  const idx = x === null ? null : Math.max(0, Math.min(n - 1, Math.round(x * (n - 1))))
  const active = idx !== null

  return (
    <div
      ref={track}
      className={`relative flex h-[36px] items-center ${className}`}
      onPointerMove={onMove}
      onPointerLeave={() => setX(null)}
    >
      {/* the visual row (centred in the tall, easy-to-hit trigger zone) */}
      <div className="relative h-[11px] w-full">
        {/* base line */}
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#070e2c]/35" />

        {/* static tick marks */}
        {PHASES.map((label, i) => (
          <div
            key={label}
            className="absolute top-1/2 h-[5px] w-px -translate-x-1/2 -translate-y-1/2 bg-[#070e2c]/45"
            style={{ left: `${(i / (n - 1)) * 100}%` }}
          />
        ))}

        {/* the selector bar — follows the cursor x; dark navy w/ a white centre line */}
        {active && x !== null && (
          <div
            className="pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x * 100}%` }}
          >
            <div className="relative h-[11px] w-[8px] rounded-[2px] bg-[#070e2c]">
              {/* white line in front of the box */}
              <div className="absolute left-1/2 top-1/2 h-[7px] w-px -translate-x-1/2 -translate-y-1/2 bg-white" />
            </div>

            {/* tooltip below */}
            <div className="absolute left-1/2 top-[16px] -translate-x-1/2">
              <div className="absolute left-1/2 top-[-3px] h-[8px] w-[8px] -translate-x-1/2 rotate-45 rounded-[1px] bg-[#070e2c]" />
              <div
                className="relative whitespace-nowrap rounded-[2px] bg-[#070e2c] px-[9px] pb-[6px] pt-[7px] uppercase text-white shadow-[0px_1px_2px_rgba(12,12,13,0.1),0px_1px_2px_rgba(12,12,13,0.05)]"
                style={{ fontFamily: 'var(--font-data)', fontSize: '12px', lineHeight: 1 }}
              >
                {PHASES[idx!]}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
