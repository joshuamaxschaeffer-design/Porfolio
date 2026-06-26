'use client'

import Link from 'next/link'
import { useState } from 'react'
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
  const [cardHover, setCardHover] = useState(false)
  return (
    <section
      data-flagship="Baserate"
      className="relative isolate w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden border-t border-[#e6e6ea] bg-white text-[#070e2c]"
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
      {/* The WHOLE section links to the case study (cursor-default), so clicking
          anywhere navigates but only the card opts back into the hand cursor. */}
      <Link href={href} aria-label="Baserate — Full Stack Design — read the case study" className="block cursor-default">
      {/* mobile bottom gets +50px breathing room below the card (Josh,
          2026-06-24); desktop padding unchanged. */}
      <div className="home-container pt-0 pb-[50px] md:pt-28 md:pb-[260px]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-16">
          {/* CARD — logo + FULL STACK DESIGN + gold pills (Figma). The whole
              card links to the case study (text/CTA removed per Josh). */}
          <div className="relative z-20 order-2 lg:order-1">
            <div
              onMouseEnter={() => setCardHover(true)}
              onMouseLeave={() => setCardHover(false)}
              className="group/card mx-auto flex aspect-[480/375] w-full max-w-[480px] origin-center cursor-pointer flex-col justify-center gap-[22px] rounded-[8px] border border-[#d6d6d6] bg-white px-8 py-9 shadow-[0_18px_44px_rgba(7,14,44,0.10)] transition-[transform,box-shadow] duration-[600ms] ease-out will-change-transform hover:scale-[0.965] hover:shadow-[0_28px_64px_rgba(7,14,44,0.14)]"
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
              {/* case study CTA — solid BLACK pill, white text (matches Panda's
                  pill; the whole section is the link so this is just visual). */}
              <span className="inline-flex w-fit self-start items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white">
                Case Study
                <span aria-hidden className="transition-transform group-hover/card:translate-x-1">→</span>
              </span>
            </div>
          </div>

          {/* MEDIA — the case study's "Brand & Marketing" floating scene
              (Journalytic phone + Baserate site device + colour swatches +
              app-icon chips), imported with its full scroll parallax. Sits to
              the right of the card. Devices scaled up ~3x per Josh — the scene
              is enlarged via a transform so its internal layout stays intact;
              the section clips the overflow. */}
          {/* MOBILE scene (compact): swatches/chips shrunk + devices enlarged so
              the cluster keeps its proportions in the narrow column; centered
              horizontally and pulled DOWN with a negative bottom margin so the
              text card (order-2, below) overlaps and covers the device bottoms. */}
          <div className="relative z-10 order-1 -mb-[64px] flex min-h-[300px] items-start justify-center overflow-visible pt-2 lg:hidden">
            <BrandingScene compact devicesOnly hovered={cardHover} className="w-full max-w-none origin-top scale-[1.22]" />
          </div>
          {/* DESKTOP scene — unchanged. */}
          <div className="relative order-1 hidden min-h-[460px] items-center overflow-visible lg:order-2 lg:flex lg:min-h-[620px] lg:justify-start">
            <BrandingScene hovered={cardHover} deviceScale={2} accentScale={0.45} deviceShiftX={-80} className="w-full max-w-none origin-left scale-[1.85]" />
          </div>
        </div>
      </div>
      </Link>
    </section>
  )
}
