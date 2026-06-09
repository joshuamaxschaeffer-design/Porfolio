'use client'

/**
 * BrandShowcase — a brand-identity BOARD for one product (Journalytic / Baserate),
 * shown as a GRID of white cards (logos, app icons, palette + type, a UI shot)
 * floating on the section background. No scrolling UI here.
 *
 * Layout mirrors the Figma brand boards:
 *   [ wordmark on black ........ ] [ icon on black ]   [ palette + type (tall) ]
 *   [ icon on white ] [ wordmark on white ........... ] [ ............(same).... ]
 *   [ UI / hero shot (wide) .................................................. ]
 */
export interface BrandShowcaseProps {
  eyebrow: string
  title: string
  blurb: string
  /** wordmark svg (dark-on-light version) */
  wordmark: string
  /** app icon svg */
  appIcon: string
  /** wide UI / marketing shot for the bottom card */
  uiShot: string
  /** object-position for the UI shot crop, e.g. 'center top' */
  uiCrop?: string
  /** brand palette swatches (hex) */
  palette: string[]
  /** section theme + background */
  theme: 'journalytic' | 'baserate'
}

export function BrandShowcase({
  eyebrow, title, blurb, wordmark, appIcon, uiShot, uiCrop = 'center top', palette, theme,
}: BrandShowcaseProps) {
  const journalytic = theme === 'journalytic'

  // Section background: Journalytic = blue gradient; Baserate = grey-bg image.
  const sectionStyle = journalytic
    ? { background: 'linear-gradient(180deg, #2f6db5 0%, #2a5e9c 100%)' }
    : { backgroundImage: 'url(/baserate/branding/grey-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }

  return (
    <section className="py-20 md:py-[120px]" style={sectionStyle}>
      <div className="br-container">
        {/* Centered heading */}
        <div className="mb-12 text-center md:mb-16">
          <span className="br-data mb-5 inline-block rounded-[var(--br-tag-radius)] border border-white/40 px-3 py-1.5 text-[14px] uppercase text-white">
            {eyebrow}
          </span>
          <h3 className="text-[28px] font-semibold uppercase tracking-tight text-white md:text-[40px]">{title}</h3>
          <p className="mx-auto mt-3 max-w-2xl text-white/80 md:text-lg">{blurb}</p>
        </div>

        {/* Brand board grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-5">
          {/* wordmark on black — wide */}
          <div className="col-span-2 flex aspect-[16/7] items-center justify-center rounded-xl bg-black p-8 md:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={wordmark} alt={`${title} wordmark`} className="max-h-full max-w-[80%] object-contain brightness-0 invert" />
          </div>
          {/* icon on black */}
          <div className="col-span-1 flex aspect-square items-center justify-center rounded-xl bg-black p-7 md:col-span-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={appIcon} alt="" className="max-h-[55%] max-w-[55%] object-contain brightness-0 invert" />
          </div>
          {/* palette + type — tall, spans both rows on desktop */}
          <div className="col-span-2 row-span-2 rounded-xl bg-white p-6 md:col-span-4 md:row-span-2">
            <div className="flex gap-2">
              {palette.map((c) => (
                <span key={c} className="h-12 flex-1 rounded-md ring-1 ring-black/5" style={{ background: c }} title={c} />
              ))}
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-[var(--br-ink)]">Header 1</span>
                <span className="text-sm text-[var(--br-muted)]">Paragraph 1</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-bold text-[var(--br-ink)]">Header 2</span>
                <span className="text-sm text-[var(--br-muted)]">Paragraph 2</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-[var(--br-ink)]">Header 3</span>
                <span className="text-xs text-[var(--br-muted)]">Paragraph 3</span>
              </div>
            </div>
          </div>
          {/* icon on white */}
          <div className="col-span-1 flex aspect-square items-center justify-center rounded-xl bg-white p-7 md:col-span-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={appIcon} alt="" className="max-h-[55%] max-w-[55%] object-contain" />
          </div>
          {/* wordmark on white — wide */}
          <div className="col-span-1 flex aspect-[16/7] items-center justify-center rounded-xl bg-white p-8 md:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={wordmark} alt="" className="max-h-full max-w-[80%] object-contain" />
          </div>
          {/* UI / hero shot — full-width bottom card */}
          <div className="col-span-2 overflow-hidden rounded-xl bg-white md:col-span-12">
            <div className="aspect-[21/8] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={uiShot} alt={`${title} marketing`} className="h-full w-full object-cover" style={{ objectPosition: uiCrop }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
