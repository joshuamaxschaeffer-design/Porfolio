import { inStoreSection as defaults } from './data'

/**
 * SECTION 6 — IN-STORE SCREENS. Dark/black field. The two vertical menu boards
 * shown very tall, side by side, framed and lifted off the field, with a note
 * that they were physically implemented on restaurant screens.
 */
export function InStoreSection() {
  return (
    <section
      id="in-store"
      className="ws-dark bg-[#0c0d0d]"
      style={
        {
          '--br-ink': '#f6f7f8',
          '--br-body': '#d4d7dd',
          '--br-muted': '#9aa0aa',
          '--br-muted-2': '#7c828d',
          '--ws-green': '#23c265',
        } as React.CSSProperties
      }
    >
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">6. {defaults.eyebrow}</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] text-[var(--br-ink)] md:text-[40px]">{defaults.heading}</h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{defaults.intro}</p>
        <p className="br-data mt-4 text-[13px] uppercase tracking-[0.1em] text-[var(--br-muted-2)]">
          Implemented on screens in restaurants
        </p>

        <div className="mt-12 grid grid-cols-2 gap-6 md:mt-16 md:gap-10">
          {defaults.boards.map((b) => (
            <figure key={b.src}>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black [box-shadow:0_24px_60px_rgba(0,0,0,0.5)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.label} loading="lazy" className="block w-full" />
              </div>
              <figcaption className="br-data mt-4 text-[13px] uppercase tracking-[0.1em] text-[var(--br-muted-2)]">
                {b.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
