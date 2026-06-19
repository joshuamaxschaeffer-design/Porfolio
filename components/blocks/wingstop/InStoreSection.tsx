import { inStoreSection as defaults } from './data'

/**
 * SECTION 6 — IN-STORE SCREENS. Light-grey field. The two vertical menu boards
 * shown very tall, side by side, with an explanation.
 */
export function InStoreSection() {
  return (
    <section id="in-store" className="bg-[var(--br-bg-2)]">
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">6. {defaults.eyebrow}</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] text-[var(--br-ink)] md:text-[40px]">{defaults.heading}</h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{defaults.intro}</p>

        <div className="mt-10 grid grid-cols-2 gap-5 md:mt-16 md:gap-8">
          {defaults.boards.map((b) => (
            <figure key={b.src}>
              <div className="overflow-hidden rounded-2xl border border-[var(--br-line)] bg-white [box-shadow:var(--br-card-shadow)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.label} loading="lazy" className="block w-full" />
              </div>
              <figcaption className="br-data mt-3 text-[13px] uppercase tracking-[0.1em] text-[var(--br-muted-2)]">
                {b.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
