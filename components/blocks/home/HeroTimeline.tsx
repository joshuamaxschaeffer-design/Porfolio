'use client'

import { useRef, useState } from 'react'

/**
 * Hero process timeline (Figma 335-73237). A thin horizontal line with 6 evenly
 * spaced tick marks, spanning from after "DESIGN SOLUTIONS" to SCHAEFFER's right
 * edge.
 *
 * Interaction: the line behaves like a progress bar that COMPLETES up to the
 * cursor. A filled square is anchored at the left origin; a dark filled line
 * runs from it to a hollow circle that follows the cursor. The tooltip logs the
 * phase to the LEFT of the cursor (the last tick passed). Each tick has a wide
 * (+/-20px) magnetic trigger zone: get within 20px and the line + dot SNAP to
 * that tick, and the tick is "selected" -- the hollow circle becomes the black
 * box with a white centre line. The tooltip rides centred under the circle/box.
 * Styles: Recursive, #070e2c, rounded-2px, soft drop shadow.
 */
const PHASES = ['Strategy', 'Branding', 'UX', 'UI', 'Implementation', 'Marketing']
const SNAP_PX = 20 // magnetic trigger distance to a tick (either direction)

export function HeroTimeline({ className = '' }: { className?: string }) {
  const track = useRef<HTMLDivElement>(null)
  // pointer x in PIXELS across the track; null when not hovering.
  const [px, setPx] = useState<number | null>(null)
  const [width, setWidth] = useState(0)

  const onMove = (e: React.PointerEvent) => {
    const el = track.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setWidth(r.width)
    setPx(Math.max(0, Math.min(r.width, e.clientX - r.left)))
  }

  const n = PHASES.length
  const active = px !== null && width > 0
  const tickPx = (i: number) => (i / (n - 1)) * width // each tick's x in px

  // Which tick (if any) the cursor is magnetically locked onto (+/-SNAP_PX).
  let snappedIdx: number | null = null
  if (active) {
    let best = SNAP_PX + 1
    for (let i = 0; i < n; i++) {
      const d = Math.abs(px! - tickPx(i))
      if (d <= SNAP_PX && d < best) {
        best = d
        snappedIdx = i
      }
    }
  }

  // The phase the tooltip describes = the tick to the LEFT of the cursor (the
  // last one passed). When snapped, it's that exact tick.
  const labelIdx = !active
    ? 0
    : snappedIdx !== null
      ? snappedIdx
      : Math.max(0, Math.min(n - 1, Math.floor(px! / (width / (n - 1)))))

  // Head position (dot/box + tooltip) in % of width. Snaps to the tick when
  // locked, otherwise follows the raw cursor.
  const headPx = snappedIdx !== null ? tickPx(snappedIdx) : px ?? 0
  const head = width > 0 ? (headPx / width) * 100 : 0

  return (
    <div
      ref={track}
      className={`relative flex h-[40px] items-center ${className}`}
      onPointerMove={onMove}
      onPointerLeave={() => setPx(null)}
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
            {/* DARK filled line from the origin up to the head (progress fill) */}
            <div
              className="pointer-events-none absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-[#070e2c]"
              style={{ width: `${head}%` }}
            />

            {/* every tick at or BEFORE the head is "selected" -> black box with
                white centre line (the origin is tick 0, always selected). */}
            {PHASES.map((label, i) => {
              const tickPct = (i / (n - 1)) * 100
              if (tickPct > head + 0.5) return null
              return (
                <div
                  key={`passed-${label}`}
                  className="pointer-events-none absolute top-1/2 z-10 h-[12px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-[#070e2c]"
                  style={{ left: `${tickPct}%` }}
                >
                  <div className="absolute left-1/2 top-1/2 h-[8px] w-px -translate-x-1/2 -translate-y-1/2 bg-white" />
                </div>
              )
            })}

            {/* HEAD marker + tooltip, centred on the head position */}
            <div
              className="pointer-events-none absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${head}%` }}
            >
              {snappedIdx !== null ? (
                // selected tick -> black box with white centre line
                <div className="relative h-[12px] w-[9px] rounded-[2px] bg-[#070e2c]">
                  <div className="absolute left-1/2 top-1/2 h-[8px] w-px -translate-x-1/2 -translate-y-1/2 bg-white" />
                </div>
              ) : (
                // between ticks -> hollow follower circle
                <div className="h-[12px] w-[12px] rounded-full border-[2px] border-[#070e2c] bg-white" />
              )}

              {/* tooltip -- centred horizontally on the head, beak pointing up */}
              <div className="absolute left-1/2 top-[17px] -translate-x-1/2">
                <div className="absolute left-1/2 top-[-3px] h-[8px] w-[8px] -translate-x-1/2 rotate-45 rounded-[1px] bg-[#070e2c]" />
                <div
                  className="relative whitespace-nowrap rounded-[2px] bg-[#070e2c] px-[9px] pb-[6px] pt-[7px] uppercase text-white shadow-[0px_1px_2px_rgba(12,12,13,0.1),0px_1px_2px_rgba(12,12,13,0.05)]"
                  style={{ fontFamily: 'var(--font-data)', fontSize: '12px', lineHeight: 1 }}
                >
                  {PHASES[labelIdx]}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
