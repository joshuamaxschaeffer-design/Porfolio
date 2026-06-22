import Link from 'next/link'
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
  oneLine = 'The rewards app came in two phases. First, a better, more native version of the launch app. Then a full rewards program: planned, designed, tested, and rolled out to every location.',
  href = '/work/panda-express',
}: FlagshipPandaProps) {
  return (
    <section
      data-flagship="Panda Express"
      className="relative isolate w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden border-y border-white/20 bg-[var(--px-red)] text-white"
      style={{ '--px-red': '#D02B2E' } as React.CSSProperties}
    >
      {/* gold sparkles + fireworks across the band (imported from the case study) */}
      <Sparkles />

      <div className="home-container py-16 md:py-20">
        {/* heading + intro, top-left (mirrors the case-study band) */}
        <div className="relative z-20 max-w-[60ch]">
          <h2
            className="font-heading uppercase leading-none tracking-wide text-white"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'clamp(30px, 4.4vw, 52px)' }}
          >
            Full Rewards App
          </h2>
          <p
            className="mt-5 max-w-[58ch] text-white/90"
            style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 1.6vw, 22px)', lineHeight: 1.4 }}
          >
            {oneLine}
          </p>
        </div>

        {/* big phones centerpiece, with the label card floated right over open
            red space. On desktop the stage is pulled left (max-w + mr-auto) so
            the right phone clears the floating card. */}
        <div className="relative mt-2">
          {/* the EXACT case-study rewards stage — scaled UP (was max-w-820) */}
          <RewardsStage className="relative z-10 mx-auto w-full max-w-[1060px] lg:mx-0 lg:max-w-[64%]" />

          {/* label card — floats right (upper) on desktop; stacks under on mobile.
              Content LEFT-aligned; no meta line. */}
          <div className="relative z-20 mt-8 w-full max-w-[360px] lg:absolute lg:right-0 lg:top-[42%] lg:mt-0 lg:-translate-y-1/2">
            <div className="flex flex-col items-start gap-5 rounded-[8px] border border-white/35 bg-[#c0282c] px-7 py-8 text-left shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
              <span className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-white shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/panda/panda-logo.svg" alt="Panda Express" className="h-[68px] w-[68px] object-contain" />
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
              <Link
                href={href}
                className="group mt-1 inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[var(--px-red,#c81f25)]"
              >
                Read the case study
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
