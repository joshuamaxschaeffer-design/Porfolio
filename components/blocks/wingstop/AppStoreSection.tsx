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
      <div className="br-container grid grid-cols-1 items-center gap-10 py-20 md:py-[120px] lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-[60px]">
        <div>
          <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">10. {defaults.eyebrow}</p>
          <h2 className="mt-3 text-[34px] font-medium leading-[1.02] text-white md:text-[52px]">{defaults.heading}</h2>
          <p className="mt-4 max-w-[52ch] text-lg text-white/80 md:text-[20px]">{defaults.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={defaults.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the App Store"
              className="group inline-flex w-[180px] items-center gap-2.5 rounded-xl border border-white/40 bg-black px-4 py-2.5 text-white transition-colors hover:border-white hover:bg-[#1a1b1b]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-7 w-7 shrink-0">
                <path d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.16-.47 7.84 1.3 10.41.86 1.26 1.89 2.67 3.24 2.62 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.02 2.29-1.28 3.15-2.55.99-1.46 1.4-2.87 1.42-2.94-.03-.01-2.73-1.05-2.76-4.15zM14.6 4.84c.72-.87 1.2-2.08 1.07-3.28-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.59 3.03-1.46z" />
              </svg>
              <span className="flex flex-col leading-none">
                <span className="text-[10px] font-normal tracking-tight text-white/85">Download on the</span>
                <span className="mt-0.5 text-[19px] font-semibold leading-tight tracking-tight">App Store</span>
              </span>
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
        <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
          {/* soft radial glow so the dark food composite separates from pure black */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(35,194,101,0.18),transparent_70%)] blur-2xl"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={defaults.mockup}
            alt="Wingstop app on the App Store"
            loading="lazy"
            className="block w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
          />
        </div>
      </div>
    </section>
  )
}
