'use client'

import { branding as defaults } from './data'

/**
 * SECTION 5 — BRANDING. Black field. The flavor icons rendered as dimensional
 * 3D "chips" (SD-Studio renders) — shown as static coins on a slight 3/4 angle.
 * Then a flat grid of the full set, noting they had to match Wingstop's
 * existing icon style.
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

      {/* 3D chips — static front-facing renders */}
      <div className="br-container pt-12 md:pt-16">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3">
          {defaults.chips.map((c) => (
            <Chip key={c.name} chip={c} />
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
 * A single static flavour chip — the SD-Studio render frozen on its resting
 * 3/4 pose (frame index {@link CHIP_REST_FRAME}). No scroll/rotation: just the
 * dimensional coin with a soft drop shadow.
 */
const CHIP_REST_FRAME = 2 // pleasant 3/4 angle (matches the set's resting pose)

function Chip({ chip }: { chip: { slug: string; name: string; color: string } }) {
  const src = `/wingstop/flavor-chips/turntable/${chip.slug}-${CHIP_REST_FRAME}.webp`
  return (
    <div className="flex flex-col items-center">
      <div className="relative grid aspect-square w-full place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`${chip.name} flavour chip`}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-[88%] w-[88%] object-contain"
          style={{ filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.5))' }}
        />
      </div>
      <span className="br-data mt-3 text-center text-[11px] uppercase leading-tight tracking-[0.08em] text-white/65">
        {chip.name}
      </span>
    </div>
  )
}
