'use client'

import { useEffect, useRef, useState } from 'react'
import { branding as defaults } from './data'

/**
 * SECTION 5 — BRANDING. Black field. The flavor icons rendered as dimensional
 * 3D "chips" — each a real SD-Studio turntable (7 frames, 0–6) that scrubs
 * forward/back as the section scrolls past, so the coins genuinely rotate in 3D
 * rather than CSS-faking a pivot. Then a flat grid of the full set, noting they
 * had to match Wingstop's existing icon style.
 */
export function BrandingSection() {
  return (
    <section
      id="branding"
      className="ws-dark relative w-full overflow-hidden bg-[#0c0d0d] text-white"
      style={
        {
          '--br-ink': '#f6f7f8',
          '--br-body': '#d4d7dd',
          '--br-muted': '#9aa0aa',
          '--br-muted-2': '#7c828d',
          '--ws-green': '#23c265',
        } as React.CSSProperties
      }
    >
      <div className="br-container pt-16 md:pt-24">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">5. {defaults.eyebrow}</p>
        <h2 className="mt-3 max-w-[22ch] text-[32px] font-medium leading-[1.05] text-white md:text-[40px]">
          {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-white/80 md:text-[22px]">{defaults.intro}</p>
      </div>

      {/* 3D turntable chips */}
      <div className="br-container pt-12 md:pt-16">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3">
          {defaults.chips.map((c, i) => (
            <TurntableChip key={c.name} chip={c} index={i} frameCount={defaults.chipFrameCount} />
          ))}
        </div>
      </div>

      {/* flat grid — matched to the brand */}
      <div className="br-container pb-20 pt-14 md:pb-[120px] md:pt-20">
        <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
          {defaults.gridEyebrow}
        </span>
        <p className="mt-2 max-w-[60ch] text-[15px] text-white/80 sm:text-base">{defaults.gridNote}</p>
        <ul className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-12">
          {defaults.grid.map((src, i) => (
            <li
              key={src + i}
              className="flex aspect-square items-center justify-center rounded-xl border border-white/12 bg-white/[0.06] p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-10 w-10 object-contain" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * A single turntable chip. All `frameCount` frames are rendered stacked and
 * preloaded; only the active frame is opaque, so scrubbing never swaps `src`
 * (no decode flicker). The active frame is driven by the chip's center-relative
 * scroll progress: as the section travels from below the viewport to above it,
 * the turntable plays through a little over one full rotation. Alternate chips
 * spin opposite directions and start on a staggered frame so the set feels alive
 * rather than locked in sync. Reduced-motion users get a fixed 3/4 frame.
 */
const REST_FRAME = (count: number) => Math.floor(count * 0.4) // pleasant 3/4 resting pose

function TurntableChip({
  chip,
  index,
  frameCount,
}: {
  chip: { slug: string; name: string; color: string }
  index: number
  frameCount: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState(() => REST_FRAME(frameCount))

  const frames = Array.from({ length: frameCount }, (_, n) => `/wingstop/flavor-chips/turntable/${chip.slug}-${n}.webp`)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setFrame(REST_FRAME(frameCount))
      return
    }
    const dir = index % 2 ? -1 : 1 // alternate spin direction per chip
    const offset = index * 0.6 // stagger so adjacent chips aren't synced
    const turns = 1.15 // a little over one full turn across the travel

    // Drive from a continuous rAF loop that re-reads getBoundingClientRect each
    // frame. This is intentional: the site runs Lenis smooth-scroll, which moves
    // a transform rather than emitting reliable native `scroll` events — a plain
    // scroll listener gets frozen. Reading the rect every frame tracks the chip
    // regardless of how the scroll is driven. The loop idles (no setState) while
    // the chip is well off-screen, so it stays cheap.
    let raf = 0
    let lastIdx = -1
    const tick = () => {
      const el = ref.current
      if (el) {
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        // Guard against a collapsed/unlaid-out box (height 0) — hold the rest
        // pose rather than computing a garbage frame.
        const onScreen = r.height > 0 && r.bottom > -vh * 0.25 && r.top < vh * 1.25
        if (onScreen) {
          // progress: 0 as the chip enters from the bottom, 1 as it exits the top
          const p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)))
          const raw = p * turns * dir + offset
          const idx = ((Math.round(raw * frameCount) % frameCount) + frameCount) % frameCount
          if (idx !== lastIdx) {
            lastIdx = idx
            setFrame(idx)
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [index, frameCount])

  return (
    <div className="flex flex-col items-center">
      <div ref={ref} className="relative grid aspect-square w-full place-items-center will-change-contents">
        {frames.map((src, n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={n === 0 ? `${chip.name} flavour chip` : ''}
            aria-hidden={n !== 0}
            loading={n <= REST_FRAME(frameCount) ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            className="col-start-1 row-start-1 h-[88%] w-[88%] object-contain"
            style={{
              opacity: n === frame ? 1 : 0,
              filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.5))',
            }}
          />
        ))}
      </div>
      <span className="br-data mt-3 text-center text-[11px] uppercase leading-tight tracking-[0.08em] text-white/65">
        {chip.name}
      </span>
    </div>
  )
}
