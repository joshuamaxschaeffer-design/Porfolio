import { appStore as defaults } from './data'

/**
 * SECTION 10 — APP STORE RELEASE. Black field. The release with a download
 * link, and the "Group 12" mockup on the right. Closes the case study.
 */
export function AppStoreSection() {
  return (
    <section
      id="app-store"
      className="ws-dark relative w-full overflow-hidden bg-[#0c0d0d] text-white"
      style={{ '--ws-green': '#23c265' } as React.CSSProperties}
    >
      <div className="br-container grid grid-cols-1 items-center gap-10 py-20 md:py-[120px] lg:grid-cols-[1fr_minmax(0,440px)] lg:gap-[60px]">
        <div>
          <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">10. {defaults.eyebrow}</p>
          <h2 className="mt-3 text-[34px] font-medium leading-[1.02] text-white md:text-[52px]">{defaults.heading}</h2>
          <p className="mt-4 max-w-[52ch] text-lg text-white/80 md:text-[20px]">{defaults.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={defaults.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="br-data inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.06em] text-[#0c0d0d] transition-colors hover:bg-[var(--ws-green)] hover:text-white"
            >
              Download on the App Store
              <span aria-hidden className="text-lg">→</span>
            </a>
            <a
              href={defaults.googlePlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="br-data text-sm uppercase tracking-[0.08em] text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              Google Play
            </a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[420px] lg:ml-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={defaults.mockup}
            alt="Wingstop app on the App Store"
            loading="lazy"
            className="block w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
          />
        </div>
      </div>
    </section>
  )
}
