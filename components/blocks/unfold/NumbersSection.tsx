import { numbers } from './data'

const LIGHT_VARS = {
  '--br-ink': '#3a342e',
  '--br-body': '#4c453d',
  '--br-muted': '#73685c',
  '--br-muted-2': '#8a7f71',
  '--br-line': 'rgba(58,52,46,0.14)',
} as React.CSSProperties

/** 2 · In numbers. One scannable row. No prose. */
export function NumbersSection() {
  return (
    <section id="numbers" className="relative bg-[#fff6e8]" style={LIGHT_VARS}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-multiply"
        style={{ backgroundImage: 'url(/unfold/texture/paper-cream.webp)', backgroundSize: '900px' }}
      />
      <div className="br-container relative z-[2] py-14 md:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[28px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[34px]">
            {numbers.heading}
          </h2>
          <p className="br-data text-[12px] uppercase tracking-wide text-[var(--br-muted-2)]">{numbers.note}</p>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--br-line)] bg-[var(--br-line)] sm:grid-cols-3 lg:grid-cols-5">
          {numbers.stats.map((s) => (
            <div key={s.label} className="bg-[#fffaf0] p-5 md:p-6">
              <dd className="text-[32px] font-medium leading-none tracking-tight text-[var(--uf-green)] md:text-[38px]">
                {s.value}
              </dd>
              <dt className="mt-2 text-[13px] leading-snug text-[var(--br-muted)]">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
