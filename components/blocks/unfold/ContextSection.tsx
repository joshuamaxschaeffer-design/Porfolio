import { context as defaults } from './data'
import { PhoneFrame } from './PhoneFrame'

interface ContextProps {
  intro?: string
}

/**
 * Section 3 — what I inherited, and how "help with the UX" became "own all of
 * it." Copy left, a single framed screen right.
 */
export function ContextSection(props: ContextProps) {
  const intro = props.intro ?? defaults.intro
  return (
    <section
      id="context"
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
            3. Context
          </h2>
          <p className="mt-3 max-w-[34rem] text-lg text-[var(--br-body)] md:text-[20px]">{intro}</p>
          {defaults.body.map((p) => (
            <p key={p.slice(0, 24)} className="mt-5 max-w-[34rem] text-base leading-relaxed text-[var(--br-muted)]">
              {p}
            </p>
          ))}
          <p className="br-data mt-7 inline-block rounded-full border border-[var(--uf-green)] px-4 py-1.5 text-[13px] uppercase tracking-wide text-[var(--uf-green)]">
            Brief: UX help → own everything
          </p>
        </div>
        <div className="mx-auto w-full max-w-[300px] md:max-w-[340px]">
          <PhoneFrame src={defaults.screenshot} alt={defaults.screenshotAlt} />
          <p className="mt-3 text-center text-[13px] text-[var(--br-muted)]">{defaults.screenshotAlt}</p>
        </div>
      </div>
    </section>
  )
}
