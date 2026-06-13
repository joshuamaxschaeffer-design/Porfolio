import Link from 'next/link'
import {
  intro,
  story,
  capabilities,
  leadership,
  timeline,
  principles,
  personal,
  outro,
} from './data'

/**
 * About page — editorial layout, fully responsive.
 *
 * Reuses the br-* design system from the case-study builds (container metrics,
 * Lexend Deca headings, Noto Sans body, neutral palette, single gold accent)
 * so About reads as the same site as the Baserate / Capabilities pages, not a
 * bolt-on. Structure follows Portfolio-Strategy.md §8.1:
 *
 *   1. Header  — positioning H1 + standfirst + a real photo (placeholder here)
 *   2. Story   — three paragraphs, specific names + outcomes
 *   3. Caps    — capability matrix: what I own / what I partner for
 *   4. Roles   — compact role timeline (NOT a résumé; CV PDF does that)
 *   5. Lead.   — leadership note, framed as function ownership
 *   6. Princ.  — three philosophy lines
 *   7. Outro   — availability CTA → /contact, discreet side-projects link
 *
 * Per Joshua's request, every image is a flat light-grey placeholder box.
 */
export function AboutPage() {
  return (
    <article className="br-article bg-white">
      {/* ── 1. Header ──────────────────────────────────────────── */}
      <header className="br-container grid grid-cols-1 gap-10 pt-16 pb-12 md:pt-24 md:pb-16 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
        <div>
          <p className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--br-gold)] md:text-sm">
            {intro.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl whitespace-pre-line text-[40px] font-medium leading-[1.03] tracking-[-0.01em] text-[var(--br-ink)] md:text-[68px]">
            {intro.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--br-muted)] md:text-[22px]">
            {intro.lead}
          </p>
        </div>

        {/* Photo placeholder — real headshot drops in here (strategy §8.1). */}
        <Placeholder
          className="aspect-[4/5] w-full"
          label="Headshot"
        />
      </header>

      {/* ── 2. Story ───────────────────────────────────────────── */}
      <section
        aria-label="Story"
        className="br-container grid grid-cols-1 gap-x-16 gap-y-6 border-t border-[var(--br-line)] py-14 md:py-20 lg:grid-cols-[0.4fr_1fr]"
      >
        <h2 className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--br-muted-2)] md:text-sm">
          The short version
        </h2>
        <div className="max-w-3xl space-y-6">
          {story.map((para, i) => (
            <p
              key={i}
              className="text-lg leading-relaxed text-[var(--br-body)] md:text-[20px] md:leading-[1.6]"
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* ── 3. Capability matrix ───────────────────────────────── */}
      <section
        aria-label="Capabilities"
        className="br-container border-t border-[var(--br-line)] py-14 md:py-20"
      >
        <p className="max-w-3xl text-lg leading-relaxed text-[var(--br-muted)] md:text-[20px]">
          {capabilities.intro}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-[var(--br-line)] md:grid-cols-2">
          <CapabilityColumn group={capabilities.own} accent />
          <CapabilityColumn group={capabilities.partner} />
        </div>
      </section>

      {/* ── 4. Role timeline ───────────────────────────────────── */}
      <section
        aria-label="Experience"
        className="br-container border-t border-[var(--br-line)] py-14 md:py-20"
      >
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-[0.4fr_1fr]">
          <h2 className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--br-muted-2)] md:text-sm">
            13 years, in brief
          </h2>
          <ul className="max-w-3xl">
            {timeline.map((entry, i) => (
              <li
                key={entry.company}
                className={
                  'grid grid-cols-1 gap-x-8 gap-y-1.5 py-6 sm:grid-cols-[7.5rem_1fr] ' +
                  (i === 0 ? 'pt-0' : 'border-t border-[var(--br-line)]')
                }
              >
                <span className="br-data text-sm text-[var(--br-muted-2)]">
                  {entry.years}
                </span>
                <div>
                  <p className="text-[18px] font-medium leading-tight text-[var(--br-ink)] md:text-[20px]">
                    {entry.company}
                  </p>
                  <p className="mt-0.5 text-[15px] text-[var(--br-gold)]">
                    {entry.role}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--br-muted)] md:text-base">
                    {entry.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 lg:ml-[calc(0.4/1.4*100%)]">
          <a
            href="/resume.pdf"
            className="br-data inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--br-ink)] underline decoration-[var(--br-divider)] underline-offset-4 transition-colors hover:decoration-[var(--br-ink)]"
          >
            Download CV (PDF)
            <span aria-hidden>↓</span>
          </a>
        </p>
      </section>

      {/* ── 5. Leadership ──────────────────────────────────────── */}
      <section
        aria-label="Leadership"
        className="br-container grid grid-cols-1 gap-x-16 gap-y-6 border-t border-[var(--br-line)] py-14 md:py-20 lg:grid-cols-[0.4fr_1fr]"
      >
        <h2 className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--br-muted-2)] md:text-sm">
          {leadership.heading}
        </h2>
        <p className="max-w-3xl text-lg leading-relaxed text-[var(--br-body)] md:text-[20px] md:leading-[1.6]">
          {leadership.body}
        </p>
      </section>

      {/* ── 6. Principles ──────────────────────────────────────── */}
      <section
        aria-label="How I work"
        className="br-container border-t border-[var(--br-line)] py-14 md:py-20"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {principles.map((p) => (
            <div key={p.title}>
              <h3 className="text-[22px] font-medium leading-snug tracking-[-0.01em] text-[var(--br-ink)] md:text-[26px]">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--br-muted)] md:text-base">
                {p.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-12 max-w-2xl text-base text-[var(--br-muted-2)]">
          {personal.body}
        </p>
      </section>

      {/* ── 7. Outro / CTA ─────────────────────────────────────── */}
      <section className="br-container border-t border-[var(--br-line)] py-16 md:py-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-[26px] font-medium leading-snug tracking-[-0.01em] text-[var(--br-ink)] md:text-[34px]">
            {outro.ctaText}
          </p>
          <Link
            href={outro.ctaHref}
            className="br-data inline-flex w-fit shrink-0 items-center gap-2 rounded-[var(--br-tag-radius)] bg-[var(--br-ink)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-90"
          >
            {outro.ctaLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="mt-12 border-t border-[var(--br-line)] pt-6">
          <Link
            href={outro.sideProjectsHref}
            className="br-data text-sm text-[var(--br-muted-2)] underline decoration-[var(--br-line)] underline-offset-4 transition-colors hover:text-[var(--br-body)] hover:decoration-[var(--br-divider)]"
          >
            {outro.sideProjectsLabel} →
          </Link>
        </div>
      </section>
    </article>
  )
}

/** One column of the capability matrix. The "own" column carries the gold tick. */
function CapabilityColumn({
  group,
  accent = false,
}: {
  group: { heading: string; items: string[] }
  accent?: boolean
}) {
  return (
    <div className="bg-white p-7 md:p-10">
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--br-muted-2)]">
        {group.heading}
      </h3>
      <ul className="mt-5 space-y-3">
        {group.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-[16px] leading-snug text-[var(--br-body)] md:text-[17px]"
          >
            <span
              aria-hidden
              className={
                'mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full ' +
                (accent ? 'bg-[var(--br-gold)]' : 'bg-[var(--br-divider)]')
              }
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Flat light-grey placeholder box (per Joshua's request: empty grey boxes for
 * all imagery). A faint centered label says what image belongs here so the
 * page reads cleanly while real assets are pending.
 */
function Placeholder({
  className = '',
  label,
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      className={
        'flex items-center justify-center rounded-[var(--br-card-radius)] bg-[var(--br-grey-card)] ' +
        className
      }
      aria-hidden
    >
      {label && (
        <span className="br-data text-[11px] uppercase tracking-[0.16em] text-[var(--br-muted-2)]">
          {label}
        </span>
      )}
    </div>
  )
}
