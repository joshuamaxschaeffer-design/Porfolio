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
    <section className="br-container mt-28 md:mt-40">
      <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
        {heading}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--br-muted)] md:text-[22px]">{intro}</p>

      <ul className="mt-7 flex flex-wrap gap-4">
        {pills.map((p) => (
          <li
            key={p}
            className="br-data rounded-[var(--br-tag-radius)] border border-[var(--br-gold)] px-5 py-3 text-[18px] text-[var(--br-gold)]"
          >
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-16">
        <h3 className="text-[24px] font-semibold uppercase leading-tight text-[var(--br-ink)]">{productsHeading}</h3>
        <p className="mt-2 max-w-xl text-base text-[var(--br-muted)]">{productsIntro}</p>
      </div>

      {/* Two products. Baserate gets more visual weight: wider column, gold
          border + Premium badge, larger floating desktop shot. Extra top
          margin leaves room for the floating screenshots above each card. */}
      <div className="mt-28 grid gap-16 md:mt-32 md:grid-cols-[1.15fr_0.85fr] md:gap-8 md:items-end">
        {/* Baserate — emphasized */}
        <div className="relative">
          {/* floating desktop screenshot */}
          <div className="absolute -top-20 left-1/2 w-[88%] -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--br-line)] bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)] md:-top-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={baserate.screenshot} alt="Baserate product" className="w-full" />
          </div>
          <div className="relative flex flex-col items-center gap-4 rounded-[8px] border-2 border-[var(--br-gold)] bg-white px-10 pb-10 pt-16 text-center md:pt-20">
            {'badge' in baserate && baserate.badge && (
              <span className="br-body absolute left-2 top-2 rounded-[var(--br-tag-radius)] bg-[var(--br-gold)] px-4 py-2 text-[16px] text-white">
                {baserate.badge}
              </span>
            )}
            <BaserateBadge className="absolute left-1/2 top-0 h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 md:h-[100px] md:w-[100px]" />
            <BaserateWordmark className="h-9 w-auto" />
            <p className="text-[18px] text-[var(--br-ink)]">{baserate.tagline}</p>
            <p className="text-[18px] italic text-[var(--br-muted)] opacity-50">{baserate.sub}</p>
          </div>
        </div>

        {/* Journalytic — de-emphasized */}
        <div className="relative">
          <div className="absolute -top-16 left-1/2 flex w-[70%] -translate-x-1/2 justify-center gap-2 md:-top-20">
            {journalytic.phones.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt="Journalytic mobile"
                className={`w-1/2 drop-shadow-xl ${i === 0 ? 'mt-4' : ''}`}
              />
            ))}
          </div>
          <div className="relative flex flex-col items-center gap-4 rounded-[8px] border border-[var(--br-stroke)] bg-white px-10 pb-10 pt-16 text-center md:pt-20">
            <JournalyticBadge className="absolute left-1/2 top-0 h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 md:h-[100px] md:w-[100px]" />
            <JournalyticWordmark className="h-9 w-auto" />
            <p className="text-[18px] text-[var(--br-ink)]">{journalytic.tagline}</p>
            <p className="text-[18px] italic text-[var(--br-muted)] opacity-50">{journalytic.sub}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
