import { library } from './data'
import { PhoneFrame } from './PhoneFrame'
import { VisualPlaceholder } from './VisualPlaceholder'

const DARK_VARS = {
  '--br-ink': '#f5f2ed',
  '--br-body': '#d9d3ca',
  '--br-muted': '#a8a29e',
  '--br-muted-2': '#8a847e',
  '--br-line': 'rgba(245,242,237,0.13)',
} as React.CSSProperties

/** 4 · The study library. The moat, in four stats and three sentences. */
export function LibrarySection() {
  return (
    <section id="library" className="uf-dark relative overflow-hidden bg-[#1c1a17]" style={DARK_VARS}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{ backgroundImage: 'url(/unfold/texture/paper-charcoal.webp)', backgroundSize: '900px' }}
      />
      <div className="br-container relative z-[2] py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-[28px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[34px]">
              {library.heading}
            </h2>
            <p className="mt-4 max-w-[32rem] text-[17px] leading-relaxed text-[var(--br-body)] md:text-[19px]">
              {library.intro}
            </p>

            <dl className="mt-8 grid max-w-[32rem] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--br-line)] bg-[var(--br-line)]">
              {library.stats.map((s) => (
                <div key={s.label} className="bg-[#262420] p-5">
                  <dd className="text-[28px] font-medium leading-none tracking-tight text-[#7ed3ae] md:text-[32px]">
                    {s.value}
                  </dd>
                  <dt className="mt-1.5 text-[13px] text-[var(--br-muted)]">{s.label}</dt>
                </div>
              ))}
            </dl>

            <VisualPlaceholder label={library.systemMapPlaceholder} aspect="16 / 8" className="mt-6 max-w-[32rem]" />
          </div>

          <figure className="mx-auto w-full max-w-[300px] md:max-w-[340px]">
            <PhoneFrame src={library.screenshot} alt={library.screenshotAlt} />
            <figcaption className="mt-3 text-center text-[13px] leading-snug text-[var(--br-muted)]">
              {library.caption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
