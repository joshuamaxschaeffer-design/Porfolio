'use client'

import { Reveal } from '../../animation/Reveal'

/**
 * DarkBand — a full-bleed, near-black cinematic band for the showcase moments
 * (perspective grid, motion reel, data-viz, brand sequence). Breaks the light
 * editorial scroll with depth + contrast: deep background, soft gold glow, white
 * type. Children render on top. Use sparingly for the "peaks."
 *
 * Full-bleed: pulls out of the br-container using 50vw margins, then re-pads.
 */
export function DarkBand({
  eyebrow,
  title,
  blurb,
  glow = true,
  children,
}: {
  eyebrow?: string
  title?: string
  blurb?: string
  glow?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-[#0b0d12]">
      {/* soft gold glow */}
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-1/3 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full opacity-[0.07] blur-[120px]"
          style={{ background: 'var(--br-gold)' }}
        />
      )}
      {/* faint grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="br-container relative py-20 md:py-28">
        {(eyebrow || title || blurb) && (
          <Reveal>
            <div className="mb-10 md:mb-14 md:max-w-3xl">
              {eyebrow && (
                <p className="br-data text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--br-gold)]">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h3 className="mt-3 text-[26px] font-medium leading-tight tracking-[-0.01em] text-white md:text-[38px]">
                  {title}
                </h3>
              )}
              {blurb && (
                <p className="mt-4 max-w-[60ch] text-[15px] leading-normal text-white/55 md:text-[17px]">
                  {blurb}
                </p>
              )}
            </div>
          </Reveal>
        )}
        {children}
      </div>
    </div>
  )
}
