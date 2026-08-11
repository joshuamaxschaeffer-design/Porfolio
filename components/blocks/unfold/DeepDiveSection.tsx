import { deepdive } from './data'
import { PhoneFrame } from './PhoneFrame'

/**
 * Section 9 — Deep Dive, the content platform. Dark section: the θεός screen,
 * four platform stats, and how the library was actually produced.
 */
export function DeepDiveSection() {
  return (
    <section
      id="deepdive"
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{ backgroundImage: 'url(/unfold/texture/paper-charcoal.webp)', backgroundSize: '900px' }}
      />
      <div className="br-container relative z-[2] py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
              9. Deep Dive
            </h2>
            <p className="mt-3 max-w-[34rem] text-lg text-[var(--br-body)] md:text-[20px]">{deepdive.intro}</p>

            <dl className="mt-8 grid max-w-[34rem] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--br-line)] bg-[var(--br-line)]">
              {deepdive.stats.map((s) => (
                <div key={s.label} className="bg-[#262420] p-5">
                  <dd className="text-[30px] font-medium leading-none tracking-tight text-[#7ed3ae] md:text-[34px]">
                    {s.value}
                  </dd>
                  <dt className="mt-1.5 text-[13px] text-[var(--br-muted)]">{s.label}</dt>
                </div>
              ))}
            </dl>

            {deepdive.body.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 max-w-[34rem] text-[15px] leading-relaxed text-[var(--br-muted)]">
                {p}
              </p>
            ))}
          </div>

          <div className="mx-auto w-full max-w-[300px] md:max-w-[360px]">
            <PhoneFrame src={deepdive.screenshot} alt={deepdive.screenshotAlt} />
            <p className="mt-3 text-center text-[13px] text-[var(--br-muted)]">{deepdive.screenshotAlt}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
