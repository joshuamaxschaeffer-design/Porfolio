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
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
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
              className="flex aspect-square items-center justify-center rounded-xl border border-white/12 bg-white/[0.06]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-9 w-9 object-contain" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** One dimensional chip; tilts toward ~45° as the section scrolls through view. */
function Chip({ chip, index }: { chip: { src: string; name: string; color: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [rot, setRot] = useState(-18)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setRot(0)
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
      setRot(Math.max(-45, Math.min(45, c * 42)))
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
  }, [])

  return (
    <div className="flex flex-col items-center gap-3" style={{ perspective: '900px' }}>
      <div
        ref={ref}
        className="relative grid aspect-square w-full place-items-center rounded-[22px] will-change-transform"
        style={{
          // physical chip: tinted body, beveled bright top edge, dark base edge
          background: `linear-gradient(160deg, ${chip.color}40 0%, #1a1b1f 55%, #0e0f12 100%)`,
          border: `1px solid ${chip.color}66`,
          // combine a gentle fixed X-tilt with the scroll-driven Y-rotation so it
          // reads dimensional like the Baserate chips
          transform: `rotateX(12deg) rotateY(${rot}deg)`,
          transformStyle: 'preserve-3d',
          boxShadow: `0 24px 46px rgba(0,0,0,0.55), inset 0 2px 1px ${chip.color}66, inset 0 -3px 6px rgba(0,0,0,0.6)`,
        }}
      >
        {/* glossy top sheen */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[22px]"
          style={{ background: 'linear-gradient(150deg, rgba(255,255,255,0.18), transparent 42%)', transform: 'translateZ(6px)' }}
        />
        {/* The flavor SVGs are a green disc + white glyph; render as-is (no
            invert) so the glyph stays legible. Lifted forward for 3D depth. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={chip.src}
          alt={chip.name}
          className="h-[56%] w-[56%] object-contain [filter:drop-shadow(0_4px_7px_rgba(0,0,0,0.6))]"
          style={{ transform: 'translateZ(26px)' }}
        />
      </div>
      <span className="br-data text-center text-[11px] uppercase leading-tight tracking-[0.08em] text-white/65">
        {chip.name}
      </span>
    </div>
  )
}
