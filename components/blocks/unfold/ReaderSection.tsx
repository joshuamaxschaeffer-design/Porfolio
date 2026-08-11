import { reader } from './data'
import { PhoneFrame } from './PhoneFrame'

/**
 * Section 6 — the core UX. Three screens in a staggered rail over white,
 * features as a numbered list beside them.
 */
export function ReaderSection() {
  return (
    <section
      id="reader"
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
      <div className="br-container py-16 md:py-24">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          6. The Reader
        </h2>
        <p className="mt-3 max-w-[34rem] text-lg text-[var(--br-body)] md:text-[20px]">{reader.intro}</p>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <ol className="space-y-7">
            {reader.features.map((f, i) => (
              <li key={f.title} className="max-w-[30rem]">
                <p className="br-data text-[13px] text-[var(--uf-green)]">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 text-[19px] font-medium text-[var(--br-ink)]">{f.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--br-muted)]">{f.body}</p>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-2 gap-4 md:gap-5">
            <div className="pt-10">
              <PhoneFrame src={reader.screens[0].src} alt={reader.screens[0].alt} />
            </div>
            <PhoneFrame src={reader.screens[1].src} alt={reader.screens[1].alt} />
            <div className="col-span-2 mx-auto w-1/2 min-w-[180px] -mt-6 md:-mt-10">
              <PhoneFrame src={reader.screens[2].src} alt={reader.screens[2].alt} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
