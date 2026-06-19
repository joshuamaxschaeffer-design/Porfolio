'use client'

import { usability as defaults } from './data'
import { CraveSlider } from './CraveSlider'

/** Hunger scale (snacky → starving) — the Wing Calculator™ input, real UI. */
const HUNGER_COLORS = ['#23c265', '#86c23a', '#f1b228', '#ef7a23', '#df3a23', '#c4151c']
const HUNGER_LABELS = ['Snacky', 'Peckish', 'Hungry', 'Very Hungry', 'Starving', 'Famished']

/**
 * Section 5 — IMPROVED USABILITY. LIGHT-GREY band. The build-your-meal flow as
 * a native scroll-snap rail of step screens (no Motion scroll-hijack — avoids
 * the Lenis useScroll freeze), plus the Wing Calculator™ hunger slider
 * (CraveSlider) on a dark card so the teardrop pin reads.
 */
export function UsabilitySection({ intro }: { intro?: string } = {}) {
  const calc = defaults.calculator
  return (
    <section id="usability" className="bg-[var(--br-bg-2)]">
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
          {defaults.eyebrow}
        </p>
        <h2 className="mt-3 text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          5. {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">
          {intro ?? defaults.intro}
        </p>

        {/* Wing Calculator™ — hunger slider on a dark card. */}
        <div className="mt-12 grid grid-cols-1 items-center gap-8 md:mt-16 md:grid-cols-[1fr_minmax(0,420px)] md:gap-[60px]">
          <div>
            <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
              {calc.eyebrow}
            </p>
            <h3 className="mt-3 text-[24px] font-semibold leading-tight text-[var(--br-ink)] md:text-[28px]">
              {calc.title}
            </h3>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
              {calc.body}
            </p>
          </div>
          <div className="rounded-[var(--br-card-radius)] bg-[#0c0d0d] px-4 [box-shadow:0_18px_40px_rgba(0,0,0,0.18)]">
            <CraveSlider colors={HUNGER_COLORS} labels={HUNGER_LABELS} start={2} caption="Crew is:" />
          </div>
        </div>

        {/* Step rail — native horizontal scroll-snap (touch-friendly, no hijack). */}
        <div className="mt-14 md:mt-20">
          <div
            className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:-mx-20 md:px-20 [scrollbar-width:thin]"
            style={{ scrollPaddingLeft: '1.5rem' }}
          >
            {defaults.steps.map((s, i) => (
              <figure
                key={s.title}
                className="w-[260px] shrink-0 snap-start sm:w-[300px]"
              >
                <div className="overflow-hidden rounded-[18px] bg-white [box-shadow:var(--br-card-shadow)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.src}
                    alt={s.title}
                    loading="lazy"
                    className="block w-full"
                  />
                </div>
                <figcaption className="mt-4">
                  <p className="br-data text-[13px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
                    Step {i + 1}
                  </p>
                  <p className="mt-1 text-[16px] font-semibold text-[var(--br-ink)]">{s.title}</p>
                  <p className="mt-1 text-[14px] leading-snug text-[var(--br-muted)]">{s.body}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
