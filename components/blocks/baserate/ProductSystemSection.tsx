import { productSystem as defaults } from './data'
import { BaserateBadge, BaserateWordmark, JournalyticBadge, JournalyticWordmark } from './BaserateLogo'

interface ProductSystemProps {
  heading?: string
  intro?: string
  pills?: string[]
  productsHeading?: string
  productsIntro?: string
  baserate?: typeof defaults.baserate
  journalytic?: typeof defaults.journalytic
}

export function ProductSystemSection(props: ProductSystemProps) {
  const heading = props.heading ?? defaults.heading
  const intro = props.intro ?? defaults.intro
  const pills = props.pills ?? defaults.pills
  const productsHeading = props.productsHeading ?? defaults.productsHeading
  const productsIntro = props.productsIntro ?? defaults.productsIntro
  const baserate = props.baserate ?? defaults.baserate
  const journalytic = props.journalytic ?? defaults.journalytic

  return (
    <section className="pt-20 md:pt-[160px]">
      <div className="br-container">
      <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
        {heading}
      </h2>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--br-ink)] md:text-[22px]">{intro}</p>

      <ul className="mt-6 flex flex-wrap gap-4">
        {pills.map((p) => (
          <li
            key={p}
            className="br-data rounded-[var(--br-tag-radius)] border border-[var(--br-gold)] px-5 py-3 text-[20px] leading-[26px] text-[var(--br-gold)]"
          >
            {p}
          </li>
        ))}
      </ul>

      {/* Devices + product cards — a "stage" that reproduces the Figma's exact
          1283×689 absolute placement, scaled to the column width. The "2 PRODUCTS"
          heading sits INSIDE the stage at the top-left (as in Figma), occupying
          the band above the devices instead of stacking a separate block above
          it (which doubled the empty space). */}
      <ProductStage
        baserate={baserate}
        journalytic={journalytic}
        productsHeading={productsHeading}
        productsIntro={productsIntro}
      />
      {/* 150px of breathing room below the 2 PRODUCTS block for impact */}
      <div aria-hidden className="h-[150px]" />
      </div>
    </section>
  )
}

/**
 * Pixel-accurate device/card stage. Native coordinate space is 1283×689 (from
 * Figma); we place children by percentage so the whole thing scales fluidly.
 * Hidden on narrow screens in favour of a simple stacked fallback.
 */
function ProductStage({
  baserate,
  journalytic,
  productsHeading,
  productsIntro,
}: {
  baserate: typeof defaults.baserate
  journalytic: typeof defaults.journalytic
  productsHeading: string
  productsIntro: string
}) {
  return (
    <>
      {/* Desktop / wide: the exact absolute stage. The "2 PRODUCTS" heading
          overlays the empty top band (above the first device), as in Figma. */}
      <div className="relative mt-8 hidden w-full md:block" style={{ aspectRatio: '1283 / 689' }}>
        {/* "2 PRODUCTS" heading — overlays the empty top band of the stage,
            left-aligned, exactly as in Figma (rather than a separate block above). */}
        <div className="absolute left-0 top-0 z-10 w-full">
          <h3 className="text-[24px] font-semibold uppercase leading-tight text-[var(--br-ink)]">{productsHeading}</h3>
          <p className="mt-2 text-base text-[var(--br-muted)] md:whitespace-nowrap">{productsIntro}</p>
        </div>
        {/* Desktop UI screenshot (overlaps Baserate card) */}
        <div
          className="absolute overflow-hidden rounded-[4px] border border-[var(--br-stroke)] bg-white shadow-[6px_14px_14px_rgba(0,0,0,0.1)]"
          style={{ left: '5.14%', top: '16.3%', width: '42.8%', height: '49.8%' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={baserate.screenshot} alt="Baserate product" className="h-full w-full object-cover object-left-top" />
        </div>

        {/* Phone 1 (left, upright) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={journalytic.phones[0]}
          alt=""
          aria-hidden
          className="absolute object-contain drop-shadow-xl"
          style={{ left: '65.5%', top: '27%', width: '15%', height: '56.6%' }}
        />
        {/* Phone 2 (right, larger, lower) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={journalytic.phones[1]}
          alt=""
          aria-hidden
          className="absolute object-contain drop-shadow-xl"
          style={{ left: '76%', top: '29.2%', width: '20.4%', height: '58.7%' }}
        />

        {/* Baserate card — taller, lower, gold border */}
        <div
          className="absolute flex flex-col items-center gap-4 rounded-[8px] border-2 border-[var(--br-gold)] bg-white px-[6%] text-center"
          style={{ left: '0%', top: '70.8%', width: '53.1%', height: '38.2%', paddingTop: '6%', paddingBottom: '6%' }}
        >
          {'badge' in baserate && baserate.badge && (
            <span className="br-body absolute left-[1.5%] top-[5%] rounded-[var(--br-tag-radius)] bg-[var(--br-gold)] px-4 py-1.5 text-[clamp(11px,1vw,16px)] text-white">
              {baserate.badge}
            </span>
          )}
          <BaserateBadge className="absolute left-1/2 top-0 aspect-square w-[15%] -translate-x-1/2 -translate-y-1/2" />
          <BaserateWordmark className="mt-[2%] h-auto w-[40%]" />
          <p className="text-[clamp(12px,1.4vw,18px)] text-[var(--br-ink)]">{baserate.tagline}</p>
          <p className="text-[clamp(12px,1.4vw,18px)] italic text-[var(--br-muted)] opacity-50">{baserate.sub}</p>
        </div>

        {/* Journalytic card — shorter, higher, plain border */}
        <div
          className="absolute flex flex-col items-center gap-4 rounded-[8px] border border-[var(--br-stroke)] bg-white px-[5%] text-center"
          style={{ left: '55.3%', top: '72.4%', width: '44.7%', height: '33.4%', paddingTop: '5.5%', paddingBottom: '5.5%' }}
        >
          <JournalyticBadge className="absolute left-1/2 top-0 aspect-square w-[17%] -translate-x-1/2 -translate-y-1/2" />
          <JournalyticWordmark className="mt-[1%] h-auto w-[52%]" />
          <p className="whitespace-nowrap text-[clamp(11px,1.32vw,18px)] text-[var(--br-ink)]">{journalytic.tagline}</p>
          <p className="whitespace-nowrap text-[clamp(11px,1.32vw,18px)] italic text-[var(--br-muted)] opacity-50">{journalytic.sub}</p>
        </div>
      </div>

      {/* Mobile fallback: simple stacked cards */}
      <div className="mt-24 flex flex-col gap-16 md:hidden">
        <div className="relative">
          <div className="absolute -top-16 left-1/2 w-[88%] -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--br-line)] bg-white shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={baserate.screenshot} alt="Baserate product" className="w-full" />
          </div>
          <div className="relative flex flex-col items-center gap-4 rounded-[8px] border-2 border-[var(--br-gold)] bg-white px-6 pb-8 pt-14 text-center">
            {'badge' in baserate && baserate.badge && (
              <span className="br-body absolute left-2 top-2 rounded-[var(--br-tag-radius)] bg-[var(--br-gold)] px-3 py-1.5 text-sm text-white">
                {baserate.badge}
              </span>
            )}
            <BaserateBadge className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2" />
            <BaserateWordmark className="h-8 w-auto" />
            <p className="text-base text-[var(--br-ink)]">{baserate.tagline}</p>
            <p className="text-base italic text-[var(--br-muted)] opacity-50">{baserate.sub}</p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-14 left-1/2 flex w-[60%] -translate-x-1/2 justify-center gap-2">
            {journalytic.phones.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" aria-hidden className={`w-1/2 drop-shadow-xl ${i === 0 ? 'mt-3' : ''}`} />
            ))}
          </div>
          <div className="relative flex flex-col items-center gap-4 rounded-[8px] border border-[var(--br-stroke)] bg-white px-6 pb-8 pt-14 text-center">
            <JournalyticBadge className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2" />
            <JournalyticWordmark className="h-8 w-auto" />
            <p className="text-base text-[var(--br-ink)]">{journalytic.tagline}</p>
            <p className="text-base italic text-[var(--br-muted)] opacity-50">{journalytic.sub}</p>
          </div>
        </div>
      </div>
    </>
  )
}
