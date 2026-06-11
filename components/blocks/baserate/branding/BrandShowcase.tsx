'use client'

/**
 * BrandShowcase — a brand-identity board, matched to the Figma boards
 * (colors pixel-sampled from _feedback_shots/figma-branding-full.png):
 *
 *   [ wordmark on black (395) ][ icon on black (148) ]   [ palette card ]
 *   [ icon on white (148) ][ wordmark on white (395) ]   [ (spans rows)  ]
 *   (baserate only) [ letter card (312) ][ R4 homepage card (652) ]
 *
 * Joshua (2026-06-10): all cards are SHARP-cornered. The white Journalytic
 * cards use the COLORED logo exports (teal mark #277FA0 + #2E2E32 text), and
 * the gradient band is his "Colored bar" export. The Baserate palette card is
 * ONE BIG BLACK BAR on top, then 4 chips in Figma order
 * (#000000 / #073984 / #B0B0B7 / #F5F5FB) + the serif type specimen.
 *
 * The palette card is aspect-locked at md+ (395:322 == the 2x2 cluster height
 * including its 26px gap) so its bottom edge always lines up with the left
 * cluster — previously its intrinsic content could exceed the stretched flex
 * height and the card hung lower than the cluster.
 */

const GAP = 'gap-3 md:gap-[26px]'

function JournalyticPalette() {
  return (
    <div className="flex h-full flex-col p-5 md:p-[6.6%]">
      {/* gradient swatch band — Joshua's "Colored bar" export (radius baked in) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/baserate/branding/colored-bar.png" alt="" className="h-auto w-full flex-none" />
      {/* chips — exact Figma values */}
      <div className="mt-5 grid flex-none grid-cols-4 gap-3 md:mt-[4.5%] md:h-[19%]">
        {['#000000', '#277FA0', '#E6C45C', '#F4F1EF'].map((c) => (
          <span
            key={c}
            className="rounded-md ring-1 ring-black/5 max-md:aspect-[78/65]"
            style={{ background: c }}
            title={c}
          />
        ))}
      </div>
      {/* type scale — paragraph column starts at 40% (2fr/3fr) per Figma */}
      <div className="mt-6 flex min-h-0 flex-1 flex-col justify-between gap-2 pb-1 md:mt-[5%]">
        <div className="grid grid-cols-[2fr_3fr] items-baseline">
          <span className="text-[19px] font-bold text-[#131722]">Header 1</span>
          <span className="text-[16px] text-[#5c6066]">Paragraph 1</span>
        </div>
        <div className="grid grid-cols-[2fr_3fr] items-baseline">
          <span className="text-[16px] font-bold text-[#131722]">Header 2</span>
          <span className="text-[14px] text-[#5c6066]">Paragraph 2</span>
        </div>
        <div className="grid grid-cols-[2fr_3fr] items-baseline">
          <span className="text-[14px] font-bold text-[#131722]">Header 3</span>
          <span className="text-[12.5px] text-[#5c6066]">Paragraph 3</span>
        </div>
      </div>
    </div>
  )
}

function BaseratePalette() {
  return (
    <div className="flex h-full flex-col p-5 md:p-[6.6%]">
      {/* ONE BIG BLACK BAR on top (per Figma board) */}
      <div className="h-[88px] w-full flex-none rounded-lg bg-black md:h-[26%]" />
      {/* chips — black / royal blue / grey / near-white, in this order */}
      <div className="mt-4 grid flex-none grid-cols-4 gap-3 md:mt-[3.5%] md:h-[20%]">
        {['#000000', '#073984', '#B0B0B7', '#F5F5FB'].map((c) => (
          <span
            key={c}
            className="rounded-md ring-1 ring-black/5 max-md:aspect-[70/58]"
            style={{ background: c }}
            title={c}
          />
        ))}
      </div>
      {/* serif specimen */}
      <h4 className="mt-7 font-serif text-[26px] leading-tight text-[#0b0b0e] md:mt-[10%]">
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
  // White cards: Journalytic uses the colored exports; Baserate stays mono.
  const wordmarkOnWhite = j ? '/baserate/branding/logos/journalytic-colored.svg' : wordmark
  const glyphOnWhite = j ? '/baserate/branding/logos/journalytic-glyph-colored.svg' : glyph

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
        {/* board: left 2x2 cluster + right palette card (sharp corners) */}
        <div className={`flex flex-col md:flex-row ${GAP}`}>
          <div className={`flex flex-col ${GAP}`} style={{ flex: '569 1 0%' }}>
            {/* row 1: wordmark on black + icon on black */}
            <div className={`flex ${GAP}`}>
              <div
                className="flex aspect-[395/148] items-center justify-center bg-black"
                style={{ flex: '395 1 0%' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={wordmark} alt={`${theme} wordmark`} className="h-auto max-h-[58%] w-[70%] object-contain brightness-0 invert" />
              </div>
              <div
                className="flex aspect-square items-center justify-center bg-black"
                style={{ flex: '148 1 0%' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={glyph} alt="" className={`h-[46%] w-[46%] object-contain ${j ? 'brightness-0 invert' : ''}`} />
              </div>
            </div>
            {/* row 2: icon on white + wordmark on white (colored for Journalytic) */}
            <div className={`flex ${GAP}`}>
              <div
                className="flex aspect-square items-center justify-center bg-white"
                style={{ flex: '148 1 0%' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={glyphOnWhite} alt="" className={`h-[46%] w-[46%] object-contain ${j ? '' : 'brightness-0'}`} />
              </div>
              <div
                className="flex aspect-[395/148] items-center justify-center bg-white"
                style={{ flex: '395 1 0%' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={wordmarkOnWhite} alt="" className="h-auto max-h-[58%] w-[70%] object-contain" />
              </div>
            </div>
          </div>
          {/* palette + type card (right, aspect-locked to match cluster height) */}
          <div className="overflow-hidden bg-white md:aspect-[395/322]" style={{ flex: '395 1 0%' }}>
            {j ? <JournalyticPalette /> : <BaseratePalette />}
          </div>
        </div>

        {/* baserate bottom row: letter card + R4 homepage */}
        {!j && (
          /* stays a ROW on mobile too — small square left, long rectangle
             right, mirroring the black-on-white logo row above */
          <div className={`mt-3 flex md:mt-[26px] ${GAP}`}>
            <div
              className="aspect-[312/275] overflow-hidden bg-white"
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
              className="aspect-[652/275] overflow-hidden bg-[#04060c]"
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
