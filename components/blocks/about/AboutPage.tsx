import Link from 'next/link'
import { Appear } from './Appear'
import { Timeline } from './Timeline'
import { intro, differentiators, outro } from './data'

/**
 * About page — minimal, modern, value-first. Four movements.
 *
 *   1. Hero    — the positioning claim + one short paragraph  (renders plainly)
 *   2. Three   — the differentiators, framed as value to the buyer
 *   3. Path    — card timeline (dots centered to cards, caret per card)
 *   4. Close   — availability + one CTA → /contact
 *
 * Voice is value-first and near-pronoun-less (not a personal blog). Entrance
 * polish via <Appear> (never hides content); the hero is plain so the first
 * paint is unconditional. Built on the br-* system to match the case studies.
 */
export function AboutPage() {
  return (
    <article className="br-article bg-white">
      {/* ── 1. Hero ────────────────────────────────────────────── */}
      <header className="br-container pt-24 pb-16 md:pt-36 md:pb-24">
        <Appear>
          <p className="br-data text-xs font-semibold uppercase tracking-[0.2em] text-[var(--br-gold)] md:text-sm">
            {intro.eyebrow}
          </p>
        </Appear>
        <Appear delay={80}>
          <h1 className="mt-5 max-w-4xl whitespace-pre-line text-[44px] font-medium leading-[1.0] tracking-[-0.02em] text-[var(--br-ink)] md:text-[78px]">
            {intro.heading}
          </h1>
        </Appear>
        <Appear delay={160}>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--br-muted)] md:text-[22px]">
            {intro.lead}
          </p>
        </Appear>
      </header>

      {/* ── 2. Three differentiators ───────────────────────────── */}
      <section
        aria-label="What sets the work apart"
        className="br-container border-t border-[var(--br-line)] py-16 md:py-24"
      >
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-3 md:gap-y-0">
          {differentiators.map((d, i) => (
            <Appear key={d.num} onView delay={i * 90}>
              <div className="flex h-full flex-col">
                <span className="br-data text-sm font-semibold text-[var(--br-gold)]">
                  {d.num}
                </span>
                <h2 className="mt-4 text-[24px] font-medium leading-snug tracking-[-0.01em] text-[var(--br-ink)] md:text-[27px]">
                  {d.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--br-muted)] md:text-base">
                  {d.body}
                </p>
              </div>
            </Appear>
          ))}
        </div>
      </section>

      {/* ── 3. Card timeline ───────────────────────────────────── */}
      <section
        aria-label="Experience"
        className="br-container border-t border-[var(--br-line)] py-16 md:py-24"
      >
        <Appear onView>
          <h2 className="mb-10 text-[26px] font-medium leading-tight tracking-[-0.01em] text-[var(--br-ink)] md:mb-14 md:text-[34px]">
            Thirteen years, four chapters.
          </h2>
        </Appear>
        {/* Left-aligned to the header (no mx-auto). */}
        <div className="max-w-3xl">
          <Timeline />
        </div>
      </section>

      {/* ── 4. Close ───────────────────────────────────────────── */}
      <section className="br-container border-t border-[var(--br-line)] py-20 md:py-28">
        <Appear onView>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-[28px] font-medium leading-snug tracking-[-0.015em] text-[var(--br-ink)] md:text-[38px]">
              {outro.line}
            </p>
            <Link
              href={outro.ctaHref}
              className="br-data inline-flex w-fit shrink-0 items-center gap-2 rounded-[var(--br-tag-radius)] bg-[var(--br-ink)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-90"
            >
              {outro.ctaLabel}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Appear>
      </section>
    </article>
  )
}
