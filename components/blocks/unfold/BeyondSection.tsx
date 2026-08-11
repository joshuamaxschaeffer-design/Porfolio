import { beyond } from './data'

/**
 * Section 10 — beyond the core: notes, editor, iPad, home, plus two
 * text-only cards (weekly rhythm, backends). Bento-ish grid on white.
 */
export function BeyondSection() {
  return (
    <section
      id="beyond"
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
          10. Beyond the Core
        </h2>
        <p className="mt-3 max-w-[34rem] text-lg text-[var(--br-body)] md:text-[20px]">{beyond.intro}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {beyond.items.map((item) => (
            <figure
              key={item.title}
              className={`overflow-hidden rounded-2xl border border-[var(--br-line)] bg-[#fffaf0] ${item.wide ? 'sm:col-span-2' : ''}`}
            >
              <div className={`overflow-hidden ${item.wide ? 'aspect-[16/10]' : 'aspect-[3/4]'} bg-[#efe7d9]`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.title} loading="lazy" className="block h-full w-full object-cover object-top" />
              </div>
              <figcaption className="p-5">
                <p className="text-[16px] font-medium text-[var(--br-ink)]">{item.title}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--br-muted)]">{item.body}</p>
              </figcaption>
            </figure>
          ))}
          {beyond.textItems.map((item) => (
            <div key={item.title} className="rounded-2xl border border-dashed border-[var(--br-line)] p-5">
              <p className="br-data text-[12px] uppercase tracking-wide text-[var(--uf-green)]">Designed & staged</p>
              <p className="mt-1.5 text-[16px] font-medium text-[var(--br-ink)]">{item.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--br-muted)]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
