import { webNeeds as defaults } from './data'

/**
 * SECTION 8 — ADDITIONAL WEB NEEDS. White field. A grid carousel (Samsung
 * SocialCarousel style) of supporting pages — locations, store finder, careers
 * — each in a square tile.
 */
export function WebNeedsSection() {
  return (
    <section id="web-needs" className="bg-white">
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">8. {defaults.eyebrow}</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] text-[var(--br-ink)] md:text-[40px]">{defaults.heading}</h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{defaults.intro}</p>

        <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:-mx-20 md:mt-14 md:px-20 [scrollbar-width:thin]">
          {defaults.items.map((it) => (
            <figure key={it.src} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
              <div className="aspect-square overflow-hidden rounded-2xl border border-[var(--br-line)] bg-[var(--br-bg-2)] [box-shadow:var(--br-card-shadow)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.src} alt={it.label} loading="lazy" className="h-full w-full object-cover object-top" />
              </div>
              <figcaption className="br-data mt-3 text-[13px] uppercase tracking-[0.1em] text-[var(--br-muted-2)]">
                {it.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
