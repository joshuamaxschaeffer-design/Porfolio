import { outcomes } from './data'

interface OutcomesProps {
  intro?: string
}

/**
 * Section 12 — outcomes at launch + reflection. Dark close, mirroring the
 * hero. Store metrics join this section as they accrue; a testimonial slot
 * is wired and hidden until Neil's quote lands in data.ts.
 */
export function OutcomesSection(props: OutcomesProps) {
  const intro = props.intro ?? outcomes.intro
  return (
    <section
      id="outcomes"
      className="uf-dark relative overflow-hidden bg-[#1c1a17]"
      style={
        {
          '--br-ink': '#f5f2ed',
          '--br-body': '#d9d3ca',
          '--br-muted': '#a8a29e',
          '--br-muted-2': '#8a847e',
          '--br-line': 'rgba(245,242,237,0.13)',
        } as React.CSSProperties
      }
    >
      <div className="br-container relative z-[2] py-16 md:py-24">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          12. Outcomes
        </h2>
        <p className="mt-3 max-w-[34rem] text-lg text-[var(--br-body)] md:text-[20px]">{intro}</p>

        <dl className="mt-10 grid gap-4 md:grid-cols-3">
          {outcomes.atLaunch.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[var(--br-line)] bg-[#262420] p-6">
              <dd className="text-[26px] font-medium leading-tight tracking-tight text-[#7ed3ae] md:text-[30px]">
                {s.value}
              </dd>
              <dt className="mt-2 text-[14px] leading-snug text-[var(--br-muted)]">{s.label}</dt>
            </div>
          ))}
        </dl>
        <p className="br-data mt-4 text-[13px] uppercase tracking-wide text-[var(--br-muted-2)]">{outcomes.placeholders}</p>

        {outcomes.testimonial && (
          <blockquote className="mt-12 max-w-[42rem] border-l-2 border-[var(--uf-green)] pl-6">
            <p className="text-[19px] leading-relaxed text-[var(--br-body)]">“{outcomes.testimonial.quote}”</p>
            <footer className="mt-3 text-[14px] text-[var(--br-muted)]">
              {outcomes.testimonial.name} · {outcomes.testimonial.title}
            </footer>
          </blockquote>
        )}

        <div className="mt-14 max-w-[42rem]">
          {outcomes.reflection.map((p) => (
            <p key={p.slice(0, 24)} className="mt-4 text-[17px] leading-relaxed text-[var(--br-body)] md:text-[19px]">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
