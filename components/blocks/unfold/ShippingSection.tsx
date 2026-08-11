import { shipping } from './data'

/**
 * Section 11 — shipping it: the review-combat timeline and the full store
 * screenshot strip. Cream ground, timeline as a green rail.
 */
export function ShippingSection() {
  return (
    <section
      id="shipping"
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45] mix-blend-multiply"
        style={{ backgroundImage: 'url(/unfold/texture/paper-cream.webp)', backgroundSize: '900px' }}
      />
      <div className="br-container relative z-[2] py-16 md:py-24">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          11. Shipping It
        </h2>
        <p className="mt-3 max-w-[34rem] text-lg text-[var(--br-body)] md:text-[20px]">{shipping.intro}</p>

        <ol className="mt-10 max-w-[42rem] space-y-0">
          {shipping.timeline.map((t, i) => (
            <li key={t.date + i} className="relative flex gap-5 pb-7 last:pb-0">
              {i < shipping.timeline.length - 1 && (
                <span aria-hidden className="absolute left-[7px] top-4 h-full w-[2px] bg-[var(--uf-green)] opacity-30" />
              )}
              <span aria-hidden className="relative mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 border-[var(--uf-green)] bg-[#fff6e8]" />
              <div>
                <p className="br-data text-[13px] uppercase tracking-wide text-[var(--uf-green)]">{t.date}</p>
                <p className="mt-0.5 text-[15px] leading-relaxed text-[var(--br-body)]">{t.event}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-[42rem] text-[15px] leading-relaxed text-[var(--br-muted)]">{shipping.note}</p>

        {/* The store set, as shipped */}
        <p className="br-data mt-12 text-[13px] uppercase tracking-wide text-[var(--br-muted-2)]">
          The App Store set, as shipped
        </p>
        <div className="-mx-2 mt-4 flex gap-3 overflow-x-auto px-2 pb-2 [scrollbar-width:thin]">
          {shipping.storeStrip.map((src, i) => (
            <div key={src} className="w-[132px] shrink-0 overflow-hidden rounded-[14px] shadow-[0_8px_22px_rgba(28,26,23,0.18)] md:w-[150px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`App Store screenshot ${i + 1}`} loading="lazy" className="block h-auto w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
