import { business } from './data'
import { PhoneFrame } from './PhoneFrame'
import { VisualPlaceholder } from './VisualPlaceholder'

const LIGHT_VARS = {
  '--br-ink': '#3a342e',
  '--br-body': '#4c453d',
  '--br-muted': '#73685c',
  '--br-muted-2': '#8a7f71',
  '--br-line': 'rgba(58,52,46,0.14)',
} as React.CSSProperties

/** 6 · The business layer. Three sentences, four chips, two visuals. */
export function BusinessSection() {
  return (
    <section id="business" className="bg-white" style={LIGHT_VARS}>
      <div className="br-container grid items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div>
          <h2 className="text-[28px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[34px]">
            {business.heading}
          </h2>
          <p className="mt-4 max-w-[30rem] text-[17px] leading-relaxed text-[var(--br-body)]">{business.intro}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {business.tiers.map((t) => (
              <li
                key={t}
                className="br-data rounded-full border border-[var(--br-line)] bg-[#fffaf0] px-4 py-1.5 text-[13px] uppercase tracking-wide text-[var(--br-muted)]"
              >
                {t}
              </li>
            ))}
          </ul>

          <VisualPlaceholder label={business.roundsPlaceholder} aspect="16 / 7" className="mt-7 max-w-[30rem]" />
        </div>

        <figure className="mx-auto w-full max-w-[280px] md:max-w-[320px]">
          <PhoneFrame src={business.screenshot} alt={business.screenshotAlt} />
          <figcaption className="mt-3 text-center text-[13px] leading-snug text-[var(--br-muted)]">
            {business.caption}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
