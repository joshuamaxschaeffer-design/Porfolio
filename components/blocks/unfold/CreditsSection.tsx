import { credits } from './data'

const DARK_VARS = {
  '--br-ink': '#f5f2ed',
  '--br-body': '#d9d3ca',
  '--br-muted': '#a8a29e',
  '--br-muted-2': '#8a847e',
  '--br-line': 'rgba(245,242,237,0.13)',
} as React.CSSProperties

/**
 * 7 · Credits and what's next. Precise attribution on purpose: reviewers
 * flag vague ownership, and exact credit reads as confidence.
 */
export function CreditsSection() {
  return (
    <section id="credits" className="uf-dark relative overflow-hidden bg-[#1c1a17]" style={DARK_VARS}>
      <div className="br-container relative z-[2] py-16 md:py-24">
        <h2 className="text-[28px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[34px]">
          {credits.heading}
        </h2>

        <dl className="mt-9 grid gap-4 md:grid-cols-3">
          {credits.roles.map((r) => (
            <div key={r.who} className="rounded-2xl border border-[var(--br-line)] bg-[#262420] p-6">
              <dt className="text-[20px] font-medium text-[#7ed3ae]">{r.who}</dt>
              <dd className="mt-2 text-[14.5px] leading-relaxed text-[var(--br-body)]">{r.did}</dd>
            </div>
          ))}
        </dl>

        <p className="br-data mt-5 text-[12px] uppercase tracking-wide text-[var(--br-muted-2)]">
          {credits.metricsNote}
        </p>

        {credits.testimonial && (
          <blockquote className="mt-10 max-w-[40rem] border-l-2 border-[var(--uf-green)] pl-5">
            <p className="text-[18px] leading-relaxed text-[var(--br-body)]">“{credits.testimonial.quote}”</p>
            <footer className="mt-2 text-[13px] text-[var(--br-muted)]">
              {credits.testimonial.name} · {credits.testimonial.title}
            </footer>
          </blockquote>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <p className="max-w-[34rem] text-[19px] leading-relaxed text-[var(--br-ink)] md:text-[22px]">
            {credits.reflection}
          </p>
          <a
            href={credits.cta.href}
            className="br-data rounded-full bg-[var(--uf-green)] px-6 py-3 text-[14px] uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            {credits.cta.label}
          </a>
        </div>
      </div>
    </section>
  )
}
