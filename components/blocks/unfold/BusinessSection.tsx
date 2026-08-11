import { business } from './data'
import { PhoneFrame } from './PhoneFrame'

/**
 * Section 8 — the business layer: paywall, pricing architecture, growth
 * mechanics. Tier cards + the paywall screen.
 */
export function BusinessSection() {
  return (
    <section
      id="business"
      className="bg-white"
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
      <div className="br-container grid items-center gap-12 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
        <div>
          <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
            8. The Business Layer
          </h2>
          <p className="mt-3 max-w-[34rem] text-lg text-[var(--br-body)] md:text-[20px]">{business.intro}</p>

          <ul className="mt-8 grid max-w-[34rem] grid-cols-2 gap-3">
            {business.tiers.map((t) => (
              <li key={t.name} className="rounded-xl border border-[var(--br-line)] bg-[#fffaf0] px-4 py-3">
                <p className="text-[15px] font-medium text-[var(--br-ink)]">{t.name}</p>
                <p className="br-data mt-0.5 text-[12px] uppercase tracking-wide text-[var(--br-muted)]">{t.note}</p>
              </li>
            ))}
          </ul>
          <p className="br-data mt-4 inline-block rounded-full border border-[var(--uf-green)] px-4 py-1.5 text-[13px] uppercase tracking-wide text-[var(--uf-green)]">
            14-day free trial on every subscription
          </p>

          {business.body.map((p) => (
            <p key={p.slice(0, 24)} className="mt-5 max-w-[34rem] text-[15px] leading-relaxed text-[var(--br-muted)]">
              {p}
            </p>
          ))}
        </div>
        <div className="mx-auto w-full max-w-[300px] md:max-w-[340px]">
          <PhoneFrame src={business.screenshot} alt={business.screenshotAlt} />
          <p className="mt-3 text-center text-[13px] text-[var(--br-muted)]">{business.screenshotAlt}</p>
        </div>
      </div>
    </section>
  )
}
