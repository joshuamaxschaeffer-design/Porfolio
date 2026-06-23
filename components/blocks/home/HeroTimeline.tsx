'use client'

import { useRef, useState } from 'react'

/**
 * Hero process timeline (Figma 335-73237). A thin horizontal line with 6 evenly
 * spaced tick marks, spanning from just after the "DESIGN SOLUTIONS" label to
 * the right edge of the SCHAEFFER wordmark. Hovering near a tick highlights it
 * (a dark navy rounded bar replaces the tick) and shows a tooltip below with the
 * phase name + an upward beak. Styles matched to the Figma dev code: Recursive
 * 12px white uppercase, #070e2c box, rounded-2px, soft drop shadow.
 *
 * The active tick is chosen by nearest-x to the pointer across the whole track,
 * so you don't have to land exactly on a 1px line.
 */
const PHASES = ['Strategy', 'Branding', 'UX', 'UI', 'Implementation', 'Marketing']

export function HeroTimeline({ className = '' }: { className?: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  const onMove = (e: React.PointerEvent) => {
    const el = track.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / (r.width || 1) // 0..1 across the track
    // nearest of 6 ticks (centres at i/(n-1))
    const n = PHASES.length
    let best = 0
    let bestD = Infinity
    for (let i = 0; i < n; i++) {
      const d = Math.abs(x - i / (n - 1))
      if (d < bestD) { bestD = d; best = i }
    }
    setActive(best)
  }

  return (
    <div
      ref={track}
      className={`relative h-[11px] ${className}`}
      onPointerMove={onMove}
      onPointerLeave={() => setActive(null)}
    >
      {/* the base line (centred vertically) */}
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#070e2c]/35" />

      {/* ticks */}
      {PHASES.map((label, i) => {
        const isActive = active === i
        const left = `${(i / (PHASES.length - 1)) * 100}%`
        return (
          <div key={label} className="absolute top-1/2 -translate-y-1/2" style={{ left }}>
            {/* tick: a 1px vertical line by default; an 8×11 dark rounded bar when active */}
            {isActive ? (
              <div className="h-[11px] w-[8px] -translate-x-1/2 rounded-[2px] bg-[#070e2c]" />
            ) : (
              <div className="h-[5px] w-px -translate-x-1/2 bg-[#070e2c]/45" />
            )}

            {/* tooltip below the active tick */}
            {isActive && (
              <div className="pointer-events-none absolute left-1/2 top-[16px] z-20 -translate-x-1/2">
                {/* beak */}
                <div className="absolute left-1/2 top-[-3px] h-[8px] w-[8px] -translate-x-1/2 rotate-45 rounded-[1px] bg-[#070e2c]" />
                <div
                  className="relative whitespace-nowrap rounded-[2px] bg-[#070e2c] px-[9px] pb-[6px] pt-[7px] uppercase text-white shadow-[0px_1px_2px_rgba(12,12,13,0.1),0px_1px_2px_rgba(12,12,13,0.05)]"
                  style={{ fontFamily: 'var(--font-data)', fontSize: '12px', lineHeight: 1 }}
                >
                  {label}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
