'use client'

import { useRef, useState } from 'react'

/**
 * Hero process timeline (Figma 335-73237). A thin horizontal line with 6 evenly
 * spaced tick marks, spanning from after "DESIGN SOLUTIONS" to SCHAEFFER's right
 * edge.
 *
 * Interaction (matches Figma): a dark navy BOX stays anchored at the active
 * phase's tick (the section being referenced). A dark FILLED line runs from that
 * box to an open CIRCLE that follows the cursor. The phase name swaps at the
 * MIDPOINT between ticks. The tooltip (name + upward beak) rides under the
 * circle. The trigger zone is tall (~3×) so hovering isn't finicky.
 * Styles: Recursive, #070e2c, rounded-2px, soft drop shadow.
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
  const idx = x === null ? null : Math.max(0, Math.min(n - 1, Math.round(x * (n - 1))))
  const active = idx !== null && x !== null
  // The hollow dot + tooltip follow the RAW cursor; the phase name swaps at the
  // midpoint between ticks (via idx). The filled square anchors to whichever END
  // the cursor is nearest: in the left half it sits at the start and the line
  // runs rightward; once the cursor crosses the halfway point the square jumps
  // to the right end and the line + label flip to the right side.
  const cursor = x === null ? 0 : x * 100 // % — follower dot at the raw cursor
  const rightSide = x !== null && x >= 0.5 // past the halfway point
  const anchor = rightSide ? 100 : 0 // % — origin square end

  return (
    <div
      ref={track}
      className={`relative flex h-[36px] items-center ${className}`}
      onPointerMove={onMove}
      onPointerLeave={() => setX(null)}
    >
      <div className="relative h-[12px] w-full">
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

        {active && (
          <>
            {/* DARK filled line between the anchored square and the cursor dot */}
            <div
              className="pointer-events-none absolute top-1/2 h-[2px] -translate-y-1/2 bg-[#070e2c]"
              style={{
                left: `${Math.min(anchor, cursor)}%`,
                width: `${Math.abs(anchor - cursor)}%`,
              }}
            />

            {/* anchored BOX at the nearest end (with a white centre line) */}
            <div
              className="pointer-events-none absolute top-1/2 z-10 h-[12px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-[#070e2c]"
              style={{ left: `${anchor}%` }}
            >
              <div className="absolute left-1/2 top-1/2 h-[8px] w-px -translate-x-1/2 -translate-y-1/2 bg-white" />
            </div>

            {/* hollow CIRCLE at the cursor + tooltip directly below it */}
            <div
              className="pointer-events-none absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${cursor}%` }}
            >
              <div className="h-[12px] w-[12px] rounded-full border-[2px] border-[#070e2c] bg-white" />
              {/* tooltip below the circle — flips to the right side past the midpoint */}
              <div
                className="absolute top-[13px]"
                style={
                  rightSide
                    ? { right: '-6px' } // anchor to the right of the dot
                    : { left: '-6px' } // anchor to the left of the dot
                }
              >
                <div
                  className="absolute top-[-3px] h-[8px] w-[8px] rotate-45 rounded-[1px] bg-[#070e2c]"
                  style={rightSide ? { right: '6px' } : { left: '6px' }}
                />
                <div
                  className="relative whitespace-nowrap rounded-[2px] bg-[#070e2c] px-[9px] pb-[6px] pt-[7px] uppercase text-white shadow-[0px_1px_2px_rgba(12,12,13,0.1),0px_1px_2px_rgba(12,12,13,0.05)]"
                  style={{ fontFamily: 'var(--font-data)', fontSize: '12px', lineHeight: 1 }}
                >
                  {PHASES[idx!]}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
