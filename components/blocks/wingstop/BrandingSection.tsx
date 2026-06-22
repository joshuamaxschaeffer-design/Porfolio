'use client'

import { useEffect, useRef, useState } from 'react'
import { branding as defaults } from './data'

/**
 * SECTION 5 — BRANDING. Black field. The flavor icons rendered as dimensional
 * 3D "chips" that rotate subtly (~45°) on scroll, à la the Baserate chips
 * (CSS-3D stand-in for SD-Studio renders), then a flat grid of the full set
 * noting they had to match Wingstop's existing icon style.
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

      {/* 3D chips */}
      <div className="br-container pt-12 md:pt-16" style={{ perspective: '1200px' }}>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3">
          {defaults.chips.map((c, i) => (
            <Chip key={c.name} chip={c} index={i} />
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

/** The chips now render FRONT-FACING (rendered upright in SD Studio), so on
 *  scroll the coins gently PIVOT in 3D around the vertical (Y) axis — like a coin
 *  turning toward/away from you — rather than spinning flat in-plane. Per-chip
 *  baseline Y-rotation (deg) gives the resting set a touch of life; the scroll
 *  drift swings around it. */
const CHIP_BASE_ROT = [-10, 8, -6, 9, -8, 7]

function Chip({ chip, index }: { chip: { src: string; name: string; color: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [drift, setDrift] = useState(0)
  const base = CHIP_BASE_ROT[index % CHIP_BASE_ROT.length]

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDrift(0)
      return
    }
    let raf = 0
    const onScroll = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // center-relative progress: -1 (below) → 0 (centered) → 1 (above)
      const c = (r.top + r.height / 2 - vh / 2) / (vh / 2)
      // gentle 3D Y-axis pivot; alternate direction per chip so adjacent coins
      // turn opposite ways as the section scrolls past.
      setDrift(Math.max(-16, Math.min(16, c * 14 * (index % 2 ? -1 : 1))))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(onScroll)
    }
    onScroll()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [index])

  return (
    <div className="flex flex-col items-center">
      {/* Front-facing 3D coin renders: a subtle scroll-linked 3D pivot around the
          vertical (Y) axis — the coin turns toward/away — kept gentle so the glyph
          stays readable. preserve-3d so the rotateY renders with real depth. */}
      <div ref={ref} className="relative grid aspect-square w-full place-items-center [perspective:900px] will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={chip.src}
          alt={`${chip.name} flavour chip`}
          loading="lazy"
          className="h-[88%] w-[88%] object-contain"
          style={{
            transform: `rotateY(${base + drift}deg)`,
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.5))',
          }}
        />
      </div>
      <span className="br-data mt-3 text-center text-[11px] uppercase leading-tight tracking-[0.08em] text-white/65">
        {chip.name}
      </span>
    </div>
  )
}
