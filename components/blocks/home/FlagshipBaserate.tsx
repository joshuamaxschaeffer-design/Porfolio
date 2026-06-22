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
  oneLine = 'The investment operating system for family offices — brand, UI, and marketing site, designed end to end. 70+ features.',
  meta = 'Lead Product & Brand Designer · 2022–2024',
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
          {/* CARD — logo + FULL STACK DESIGN + gold pills (Figma) */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex w-full max-w-[440px] flex-col gap-[22px] rounded-[8px] border border-[#d6d6d6] bg-white px-8 py-10 shadow-[0_18px_44px_rgba(7,14,44,0.10)]">
              <BaserateLogo className="h-[42px] w-auto" />
              <div className="flex flex-col gap-5">
                <p
                  className="uppercase text-[#070e2c]"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 500,
                    fontSize: 'clamp(20px, 2.2vw, 28px)',
                  }}
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
              </div>
            </div>

            {/* one-line + meta + link, under the card */}
            <p
              className="mt-8 max-w-md text-[#3a4159]"
              style={{ fontFamily: 'var(--font-body)', fontSize: '17px', lineHeight: 1.5 }}
            >
              {oneLine}
            </p>
            <p
              className="mt-4 uppercase tracking-[0.12em] text-[#9a9eb0]"
              style={{ fontFamily: 'var(--font-data)', fontSize: '12px' }}
            >
              {meta}
            </p>
            <Link
              href={href}
              className="group mt-7 inline-flex items-center gap-2 rounded-full border border-[#070e2c]/30 px-6 py-3 text-sm font-medium text-[#070e2c] transition-colors hover:bg-[#070e2c] hover:text-white"
            >
              Read the case study
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          {/* MEDIA — the case study's "Brand & Marketing" floating scene
              (Journalytic phone + Baserate site device + colour swatches +
              app-icon chips), imported with its full scroll parallax. Sits to
              the right of the card. */}
          <div className="relative order-1 lg:order-2">
            <BrandingScene className="mx-auto w-full max-w-[760px] lg:max-w-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
