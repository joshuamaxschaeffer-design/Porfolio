import Link from 'next/link'
import { Appear } from './Appear'
import { Timeline } from './Timeline'
import { intro, differentiators, outro } from './data'

/**
 * About page — minimal, modern, four movements.
 *
 * Rebuilt 2026-06-13 (per Joshua): the old page was a scattered checklist. This
 * is one claim, three differentiators, an animated proof timeline, one close.
 *
 *   1. Hero    — the single claim + one short paragraph  (animates on mount)
 *   2. Three   — the differentiators (the spine of the page)
 *   3. Path    — animated vertical timeline (line + dots, draws on scroll)
 *   4. Close   — availability + one CTA → /contact
 *
 * Entrance polish via <Appear>, which never hides content (resting state is
 * visible; motion only adds an entrance). The hero animates on mount — reliable
 * for above-the-fold content — while lower sections animate on scroll-in.
 *
 * No headshot, no capability matrix, no separate principles, no CV/side-project
 * links. Built on the br-* system so it reads as the same site as the case
 * studies.
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
          <h1 className="mt-5 max-w-4xl whitespace-pre-line text-[44px] font-medium leading-[1.0] tracking-[-0.02em] text-[var(--br-ink)] md:text-[80px]">
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

      {/* ── 3. Animated timeline ───────────────────────────────── */}
      <section
        aria-label="Experience"
        className="br-container border-t border-[var(--br-line)] py-16 md:py-24"
      >
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[0.36fr_1fr] lg:gap-x-16">
          <Appear onView>
            <h2 className="br-data text-xs font-semibold uppercase tracking-[0.2em] text-[var(--br-muted-2)] md:text-sm">
              The path
            </h2>
          </Appear>
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
