'use client'

import { useEffect, useRef } from 'react'

/**
 * BrandShowcase — a brand-identity section for one product (Journalytic or
 * Baserate). Shows the animated wordmark, the app icon, the brand palette, and
 * a framed, slowly auto-scrolling preview of the marketing site.
 *
 * Configurable via props so the same component renders both brands with their
 * own colour, copy and assets.
 */
export interface BrandShowcaseProps {
  eyebrow: string
  title: string
  blurb: string
  /** animated wordmark video (mp4) */
  logoVideo: string
  /** app icon svg */
  appIcon: string
  /** tall marketing-site png that slowly scrolls inside the device frame */
  siteImage: string
  /** brand palette swatches */
  palette: string[]
  /** section background + text theme */
  theme: 'light' | 'dark'
  /** flip the layout (logo left / preview right, or vice-versa) */
  reverse?: boolean
}

export function BrandShowcase({
  eyebrow, title, blurb, logoVideo, appIcon, siteImage, palette, theme, reverse,
}: BrandShowcaseProps) {
  const vref = useRef<HTMLVideoElement>(null)

  // Play the wordmark reveal once when it scrolls in.
  useEffect(() => {
    const v = vref.current
    if (!v) return
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { v.play().catch(() => {}); io.disconnect() }
    }, { threshold: 0.5 })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  const dark = theme === 'dark'

  return (
    <section className={dark ? 'bg-[var(--br-ink)] py-20 md:py-[120px]' : 'bg-white py-20 md:py-[120px]'}>
      <div className={`br-container grid items-center gap-12 md:grid-cols-2 md:gap-16 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
        {/* Left: identity */}
        <div>
          <span
            className="br-data mb-5 inline-block rounded-[var(--br-tag-radius)] border px-3 py-1.5 text-[14px] uppercase"
            style={{ borderColor: 'var(--br-gold)', color: 'var(--br-gold)' }}
          >
            {eyebrow}
          </span>
          <h3 className={`text-[28px] font-semibold uppercase tracking-tight md:text-[40px] ${dark ? 'text-white' : 'text-[var(--br-ink)]'}`}>
            {title}
          </h3>
          <p className={`mt-4 max-w-md md:text-lg ${dark ? 'text-white/70' : 'text-[var(--br-muted)]'}`}>
            {blurb}
          </p>

          {/* Animated wordmark + app icon */}
          <div className="mt-9 flex items-center gap-5">
            <div className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl ${dark ? 'bg-white/5' : 'bg-[var(--br-bg-2)]'} md:h-20 md:w-20`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={appIcon} alt="" className="h-9 w-9 md:h-11 md:w-11" />
            </div>
            <video
              ref={vref}
              className="h-12 w-auto md:h-16"
              muted
              playsInline
              preload="auto"
            >
              <source src={logoVideo} type="video/mp4" />
            </video>
          </div>

          {/* Palette */}
          <div className="mt-8 flex gap-2.5">
            {palette.map((c) => (
              <span
                key={c}
                className="h-9 w-9 rounded-full ring-1 ring-black/10 md:h-10 md:w-10"
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Right: framed auto-scrolling site preview */}
        <div className="relative mx-auto w-full max-w-[420px]">
          <div
            className={`relative aspect-[3/4] overflow-hidden rounded-3xl border ${dark ? 'border-white/10' : 'border-[var(--br-line)]'} shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)]`}
          >
            {/* The tall site image slides slowly up & back via CSS. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteImage}
              alt={`${title} marketing site`}
              className="absolute left-0 top-0 w-full"
              style={{ animation: 'br-site-scroll 26s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
