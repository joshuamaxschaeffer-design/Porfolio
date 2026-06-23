'use client'

import Link from 'next/link'
import { BaserateLogo } from '../baserate/BaserateLogo'
import { BrandingScene } from '../baserate/branding/BrandingScene'

export interface FlagshipBaserateProps {
  title?: string
  oneLine?: string
  meta?: string
  href?: string
}

/**
 * Home flagship #1 — Baserate (Figma 335-45893). A full-bleed navy field. The
 * Figma frame is just the white "FULL STACK DESIGN" card + gold pills; per the
 * build decision we reuse the Baserate case-study device render as the media so
 * it reads finished. Card sits left, the angled product device floats right
 * with a gentle scroll parallax (disabled under reduced motion).
 */
const PILLS = ['Branding', 'Lead', 'UX', 'UI', 'Strategy']

export function FlagshipBaserate({
  href = '/work/baserate',
}: FlagshipBaserateProps) {
  return (
    <section
      data-flagship="Baserate"
      className="relative isolate w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden bg-white text-[#070e2c]"
    >
      {/* faint light field — a whisper of Baserate navy in the top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(120% 100% at 78% 6%, #f3f6fc 0%, #ffffff 55%)',
        }}
      />
      <div className="home-container py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-16">
          {/* CARD — logo + FULL STACK DESIGN + gold pills (Figma). The whole
              card links to the case study (text/CTA removed per Josh). */}
          <div className="order-2 lg:order-1">
            <Link
              href={href}
              className="group/card flex aspect-[480/375] w-full max-w-[480px] flex-col justify-center gap-[22px] rounded-[8px] border border-[#d6d6d6] bg-white px-8 py-9 shadow-[0_18px_44px_rgba(7,14,44,0.10)] transition-shadow duration-300 hover:shadow-[0_24px_56px_rgba(7,14,44,0.16)]"
            >
              <BaserateLogo className="h-[42px] w-auto" />
              <p
                className="uppercase text-[#070e2c]"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(20px, 2.2vw, 28px)' }}
              >
                Full Stack Design
              </p>
              <ul className="flex flex-wrap gap-3">
                {PILLS.map((p) => (
                  <li
                    key={p}
                    className="rounded-[2px] border border-[#ae7d00] px-2 py-1.5 text-[#ae7d00]"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                  >
                    {p}
                  </li>
                ))}
              </ul>
              {/* case study text + arrow — sits just below the pills (matches Panda) */}
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#070e2c]">
                Read the case study
                <span aria-hidden className="transition-transform group-hover/card:translate-x-1">→</span>
              </span>
            </Link>
          </div>

          {/* MEDIA — the case study's "Brand & Marketing" floating scene
              (Journalytic phone + Baserate site device + colour swatches +
              app-icon chips), imported with its full scroll parallax. Sits to
              the right of the card. Devices scaled up ~3x per Josh — the scene
              is enlarged via a transform so its internal layout stays intact;
              the section clips the overflow. */}
          <div className="relative order-1 flex min-h-[460px] items-center justify-center overflow-visible lg:order-2 lg:min-h-[620px] lg:justify-start">
            <BrandingScene className="w-full max-w-[760px] origin-center scale-[1.55] lg:max-w-none lg:origin-left lg:scale-[1.85]" />
          </div>
        </div>
      </div>
    </section>
  )
}
