'use client'

/**
 * BrandShowcase — a brand-identity board, matched to the Figma boards:
 *
 *   [ wordmark on black (395) ][ icon on black (148) ]   [ palette card ]
 *   [ icon on white (148) ][ wordmark on white (395) ]   [ (spans rows)  ]
 *   (baserate only) [ letter card (312) ][ R4 homepage card (652) ]
 *
 * Journalytic: sits directly on the parent's blue gradient, NO heading of its
 * own (the hero's "B2C Brand Exploration" label introduces it).
 * Baserate: "Baserate Brand" heading, on the "Grey BG" image.
 */

const GAP = 'gap-3 md:gap-[26px]'

function JournalyticPalette() {
  return (
    <div className="flex h-full flex-col p-5 md:p-[26px]">
      {/* gradient swatch band */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/baserate/branding/palette-band-journalytic.png"
        alt=""
        className="h-[88px] w-full rounded-lg object-cover md:h-[31%]"
      />
      {/* chips */}
      <div className="mt-5 grid grid-cols-4 gap-3 md:mt-[7%]">
        {['#050608', '#26798F', '#E5C45C', '#F0EEEC'].map((c) => (
          <span
            key={c}
            className="aspect-[78/65] rounded-lg ring-1 ring-black/5"
            style={{ background: c }}
            title={c}
          />
        ))}
      </div>
      {/* type scale */}
      <div className="mt-6 flex flex-1 flex-col justify-between gap-2 pb-1 md:mt-[8%]">
        <div className="grid grid-cols-2 items-baseline">
          <span className="text-[19px] font-bold text-[#131722]">Header 1</span>
          <span className="text-[16px] text-[#5c6066]">Paragraph 1</span>
        </div>
        <div className="grid grid-cols-2 items-baseline">
          <span className="text-[16px] font-bold text-[#131722]">Header 2</span>
          <span className="text-[14px] text-[#5c6066]">Paragraph 2</span>
        </div>
        <div className="grid grid-cols-2 items-baseline">
          <span className="text-[14px] font-bold text-[#131722]">Header 3</span>
          <span className="text-[12.5px] text-[#5c6066]">Paragraph 3</span>
        </div>
      </div>
    </div>
  )
}

function BaseratePalette() {
  return (
    <div className="flex h-full flex-col p-5 md:p-[26px]">
      {/* chips */}
      <div className="grid grid-cols-5 gap-2.5">
        {['#070e2c', '#ae7d00', '#2f6db5', '#f1f1f4', '#3f4147'].map((c) => (
          <span
            key={c}
            className="aspect-[70/58] rounded-md ring-1 ring-black/5"
            style={{ background: c }}
            title={c}
          />
        ))}
      </div>
      {/* serif specimen */}
      <h4 className="mt-7 font-serif text-[26px] leading-tight text-[#16181d] md:mt-[12%]">
        Header Text
      </h4>
      <p className="mt-2.5 text-[14px] leading-snug text-[#5c6066]">
        Lorem ipsum dolor sit amet adipscing consecteteur dem elit sed euismod.
      </p>
    </div>
  )
}

export function BrandShowcase({ theme }: { theme: 'journalytic' | 'baserate' }) {
  const j = theme === 'journalytic'
  const wordmark = `/baserate/branding/logos/${theme}-logo.svg`
  const glyph = `/baserate/branding/logos/${theme}-glyph.svg`

  return (
    <section
      className={j ? 'pb-24 md:pb-[110px]' : 'py-20 md:py-[100px]'}
      style={
        j
          ? undefined
          : {
              backgroundImage: 'url(/baserate/branding/grey-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
      }
    >
      {!j && (
        <div className="mx-auto mb-12 max-w-[760px] px-6 text-center md:mb-16">
          <h3 className="text-[19px] font-semibold uppercase tracking-[0.05em] text-white md:text-[24px]">
            Baserate Brand
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-white/85 md:text-[17px]">
            Our professional product, Baserate needed to communicate high value corporate software.
          </p>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1042px] px-6">
        {/* board: left 2×2 cluster + right palette card */}
        <div className={`flex flex-col md:flex-row ${GAP}`}>
          <div className={`flex flex-col ${GAP}`} style={{ flex: '569 1 0%' }}>
            {/* row 1: wordmark on black + icon on black */}
            <div className={`flex ${GAP}`}>
              <div
                className="flex aspect-[395/148] items-center justify-center rounded-xl bg-black"
                style={{ flex: '395 1 0%' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={wordmark} alt={`${theme} wordmark`} className="h-auto max-h-[58%] w-[70%] object-contain brightness-0 invert" />
              </div>
              <div
                className="flex aspect-square items-center justify-center rounded-xl bg-black"
                style={{ flex: '148 1 0%' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={glyph} alt="" className={`h-[52%] w-[52%] object-contain ${j ? 'brightness-0 invert' : ''}`} />
              </div>
            </div>
            {/* row 2: icon on white + wordmark on white */}
            <div className={`flex ${GAP}`}>
              <div
                className="flex aspect-square items-center justify-center rounded-xl bg-white"
                style={{ flex: '148 1 0%' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={glyph} alt="" className={`h-[52%] w-[52%] object-contain ${j ? '' : 'brightness-0'}`} />
              </div>
              <div
                className="flex aspect-[395/148] items-center justify-center rounded-xl bg-white"
                style={{ flex: '395 1 0%' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={wordmark} alt="" className="h-auto max-h-[58%] w-[70%] object-contain" />
              </div>
            </div>
          </div>
          {/* palette + type card (right, spans both rows) */}
          <div className="rounded-xl bg-white" style={{ flex: '395 1 0%' }}>
            {j ? <JournalyticPalette /> : <BaseratePalette />}
          </div>
        </div>

        {/* baserate bottom row: letter card + R4 homepage */}
        {!j && (
          <div className={`mt-3 flex flex-col md:mt-[26px] md:flex-row ${GAP}`}>
            <div
              className="aspect-[312/275] overflow-hidden rounded-xl bg-white"
              style={{ flex: '312 1 0%' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/baserate/branding/letter-card.png"
                alt="Baserate annual letter UI"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div
              className="aspect-[652/275] overflow-hidden rounded-xl bg-[#04060c]"
              style={{ flex: '652 1 0%' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/baserate/branding/r4-homepage.png"
                alt="Baserate marketing homepage"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
