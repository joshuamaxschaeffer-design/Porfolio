import { facts } from './data'

/**
 * Section 2 — "In numbers" on cream paper. Process facts, not vanity metrics:
 * the shipped scope at launch. Store numbers join this grid post-launch.
 */
export function FastFactsSection() {
  return (
    <section
      id="facts"
      className="relative bg-[#fff6e8]"
      style={
        {
          '--br-ink': '#3a342e',
          '--br-body': '#4c453d',
          '--br-muted': '#73685c',
          '--br-muted-2': '#8a7f71',
          '--br-line': 'rgba(58,52,46,0.14)',
        } as React.CSSProperties
      }
    >
      {/* Paper grain wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-multiply"
        style={{ backgroundImage: 'url(/unfold/texture/paper-cream.webp)', backgroundSize: '900px' }}
      />
      <div className="br-container relative z-[2] py-16 md:py-24">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          2. In Numbers
        </h2>
        <p className="mt-3 max-w-[34rem] text-lg text-[var(--br-muted)]">{facts.intro}</p>

        <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--br-line)] bg-[var(--br-line)] sm:grid-cols-2 lg:grid-cols-3">
          {facts.stats.map((s) => (
            <div key={s.label} className="bg-[#fffaf0] p-6 md:p-8">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-[40px] font-medium leading-none tracking-tight text-[var(--uf-green)] md:text-[48px]">
                  {s.value}
                </span>
                <span className="mt-2 block text-[15px] font-medium text-[var(--br-ink)]">{s.label}</span>
                <span className="mt-1 block text-[13px] text-[var(--br-muted)]">{s.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
