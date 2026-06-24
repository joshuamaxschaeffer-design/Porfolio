'use client'

import Link from 'next/link'
import { useState } from 'react'
import { RewardsStage } from '../panda/PremiumRewardsSection'
import { Sparkles } from '../panda/Sparkles'

export interface FlagshipPandaProps {
  title?: string
  oneLine?: string
  meta?: string
  href?: string
}

const PILLS = ['Lead Design', 'Art Director', 'UX', 'UI']

/**
 * Home flagship #2 — Panda Express. Reuses the case study's exact "FULL REWARDS
 * APP" hero composition (PremiumRewardsSection → RewardsStage): the radial
 * firework + the two real reward phones (520 Panda Points + premium-entrée
 * upgrade) from /public/panda/pivot, with the same scroll fly-in, plus the
 * case-study gold Sparkles over the band. The phones are the dominant
 * centerpiece (scaled up); the Panda label card floats top-right, left-aligned.
 */
export function FlagshipPanda({
  href = '/work/panda-express',
}: FlagshipPandaProps) {
  const [cardHover, setCardHover] = useState(false)
  return (
    <section
      data-flagship="Panda Express"
      className="relative isolate w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden border-y border-white/20 bg-[var(--px-red)] text-white"
      style={{ '--px-red': '#D02B2E' } as React.CSSProperties}
    >
      {/* gold sparkles + fireworks across the band (imported from the case study) */}
      <Sparkles />

      <div className="home-container pt-0 pb-20 md:py-24">
        {/* big phones centerpiece, with the label card floated right over open
            red space. The stage is scaled up ~3x and pushed DOWN per Josh; the
            section is tall + overflow-hidden so the enlarged phones are contained
            and the bottoms run off the section edge. */}
        <div className="relative min-h-[520px] lg:min-h-[720px]">
          {/* the EXACT case-study rewards stage — scaled UP + moved down. Card
              hover passes `hovered` into RewardsStage, which explodes only the
              two PHONES apart individually (radial stays put), shadows tracking. */}
          <RewardsStage hovered={cardHover} className="relative z-10 mx-auto mt-[160px] w-full max-w-[1060px] origin-top scale-[1.8] lg:mx-0 lg:mt-0 lg:max-w-[58%] lg:origin-[40%_top] lg:translate-y-[60px] lg:scale-[1.325]" />

          {/* label card — floats right (upper) on desktop; stacks under on mobile.
              Content LEFT-aligned; no meta line. */}
          <div
            className="relative z-20 mt-8 w-full max-w-[480px] lg:absolute lg:right-0 lg:top-[42%] lg:mt-0 lg:-translate-y-1/2"
            onMouseEnter={() => setCardHover(true)}
            onMouseLeave={() => setCardHover(false)}
          >
            <div className="flex aspect-[480/375] origin-center flex-col items-start justify-center gap-5 rounded-[8px] border border-white/35 bg-[#c0282c] px-8 py-8 text-left shadow-[0_24px_60px_rgba(0,0,0,0.25)] transition-transform duration-[600ms] ease-out will-change-transform hover:scale-[0.965]">
              <span className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-white shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/panda/panda-logo.svg" alt="Panda Express" className="h-[62px] w-[62px] object-contain" />
              </span>
              <p
                className="uppercase"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(20px, 2vw, 28px)' }}
              >
                Panda Express App
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {PILLS.map((t) => (
                  <li
                    key={t}
                    className="rounded-[2px] border border-white px-2 py-1.5"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '15px' }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
              {/* case study text + arrow — sits just below the pills */}
              <Link
                href={href}
                className="group inline-flex items-center gap-2 text-sm font-medium text-white"
              >
                Read the case study
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
