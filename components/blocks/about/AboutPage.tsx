import Link from 'next/link'
import { Appear } from './Appear'
import { Timeline } from './Timeline'
import { intro, outro } from './data'

// The three value cards (mirrors the home closing band): iso illustration +
// number + title + body, in bordered white cards.
const VALUE_CARDS = [
  {
    n: '01',
    title: 'Strategic Planning',
    body: 'Research and user needs always inform product strategy.',
    img: '/home/about/strategic-planning.webp',
  },
  {
    n: '02',
    title: 'Product Clarity',
    body: 'Long-term thinking, scalable architecture, clear leadership.',
    img: '/home/about/product-clarity.webp',
  },
  {
    n: '03',
    title: 'Full System Design',
    body: 'UX, UI, and Branding all form one complete product system.',
    img: '/home/about/full-system-design.webp',
  },
]

/**
 * About page — minimal, modern, value-first.
 *
 *   1. Hero    — the positioning claim + one short paragraph  (renders plainly)
 *   2. Three   — the differentiators, framed as value to the buyer
 *   3. Path    — card timeline (left) + the availability close (right, sticky on
 *                desktop; stacks below on mobile/tablet)
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

      {/* ── 2. Three value cards (iso illustrations) ───────────── */}
      <section
        aria-label="What sets the work apart"
        className="br-container border-t border-[var(--br-line)] py-16 md:py-24"
      >
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 md:gap-y-10 lg:grid-cols-3">
          {VALUE_CARDS.map((c, i) => (
            <Appear key={c.n} onView delay={i * 90} className="h-full">
              <div className="relative flex h-full flex-col items-center rounded-[8px] border border-[#e3e3e6] bg-white p-7 pt-12 text-center">
                {/* number — pinned to the card's inner top-left corner */}
                <span className="br-data absolute left-7 top-6 text-sm font-semibold text-[#7e7f88]">{c.n}</span>
                {/* iso illustration — centered */}
                <div className="mb-5 flex aspect-square w-1/3 max-w-[120px] items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt="" aria-hidden className="h-full w-full object-contain" />
                </div>
                <h2 className="text-[16px] font-medium uppercase leading-snug tracking-[0.01em] text-[var(--br-ink)]">
                  {c.title}
                </h2>
                <p className="mt-3 max-w-[300px] text-[15px] leading-relaxed text-[var(--br-muted)] md:text-base">
                  {c.body}
                </p>
              </div>
            </Appear>
          ))}
        </div>
      </section>

      {/* ── 3. Card timeline + availability close ──────────────── */}
      <section
        aria-label="Experience"
        className="br-container border-t border-[var(--br-line)] py-16 md:py-24"
      >
        <Appear onView>
          <h2 className="mb-10 text-[26px] font-medium leading-tight tracking-[-0.01em] text-[var(--br-ink)] md:mb-14 md:text-[34px]">
            Thirteen years, four chapters.
          </h2>
        </Appear>

        {/* Desktop: timeline left, close sticky-centered right. Mobile/tablet:
            timeline, then the close stacked below. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,640px)_1fr] lg:gap-x-16 xl:gap-x-24">
          <div>
            <Timeline />
          </div>

          {/* Close — its own movement, pulled up beside the timeline on desktop.
              Matches the home CTA treatment: the faint logo-sketches photo is the
              panel background under a white overlay, with the text on its own
              white card centered over it. On desktop the column stretches
              (`self-stretch`) so the panel fills the timeline's height. Mobile:
              stacks below. */}
          <div className="mt-16 lg:mt-0 lg:self-stretch">
            <Appear onView className="lg:h-full">
              <div className="relative isolate flex h-full min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-lg bg-[var(--br-bg-2)] px-6 py-16 text-center md:px-8">
                {/* faint sketches photo — the same logo image used on the home
                    page. It IS the panel background (no solid fill above it). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/home/about/cta-sketches.webp"
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
                />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-white/55" />

                {/* white card carrying the text, centered over the sketches */}
                <div className="relative z-10 w-full max-w-md rounded-lg border border-black/5 bg-white px-8 py-12 shadow-[0_24px_60px_rgba(7,14,44,0.10)]">
                  <p className="text-[28px] font-medium leading-snug tracking-[-0.015em] text-[var(--br-ink)] md:text-[34px]">
                    {outro.line}
                  </p>
                  <Link
                    href={outro.ctaHref}
                    className="br-data mt-7 inline-flex w-fit items-center gap-2 rounded-[var(--br-tag-radius)] bg-[var(--br-ink)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-90"
                  >
                    {outro.ctaLabel}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </Appear>
          </div>
        </div>
      </section>

    </article>
  )
}
