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
      <div className="br-container pt-16 md:pt-24">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">6. {defaults.eyebrow}</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] text-[var(--br-ink)] md:text-[40px]">{defaults.heading}</h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{defaults.intro}</p>
        <p className="br-data mt-4 text-[13px] uppercase tracking-[0.1em] text-[var(--br-muted-2)]">
          Implemented on screens in restaurants
        </p>
      </div>

      {/* The boards are 9:16 menu screens — shown LARGE (≈3× the old size) and
          edge-to-edge, each glowing like a lit in-store display (a soft
          red/white/green halo bleeds from behind the screen). The container
          matches the tall 9:16 ratio so nothing is boxed/cropped. */}
      <div className="mx-auto mt-12 grid w-full max-w-[1500px] grid-cols-1 gap-16 px-6 pb-24 sm:grid-cols-2 sm:gap-10 md:mt-16 md:px-12 md:pb-[120px]">
        {defaults.boards.map((b) => (
          <figure key={b.src} className="relative">
            {/* glowing-display halo (Wingstop red/white/green) */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-0 rounded-[44px] blur-[55px] opacity-90"
              style={{
                background:
                  'radial-gradient(60% 50% at 30% 22%, rgba(209,40,46,0.55) 0%, rgba(209,40,46,0) 70%), radial-gradient(55% 45% at 72% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 68%), radial-gradient(70% 60% at 50% 88%, rgba(0,105,56,0.6) 0%, rgba(0,105,56,0) 72%)',
              }}
            />
            <div className="relative z-[1] overflow-hidden rounded-[20px] border border-white/12 bg-black ring-1 ring-white/5 [box-shadow:0_30px_80px_rgba(0,0,0,0.6)]">
              <div className="aspect-[9/16] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.label} loading="lazy" className="block h-full w-full object-cover" />
              </div>
            </div>
            <figcaption className="br-data relative z-[1] mt-4 text-[13px] uppercase tracking-[0.1em] text-[var(--br-muted-2)]">
              {b.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
