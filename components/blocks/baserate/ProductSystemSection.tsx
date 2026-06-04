import { productSystem as defaults } from './data'
import { BaserateBadge, BaserateWordmark, JournalyticBadge } from './BaserateLogo'

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
      <h2 className="text-3xl font-bold tracking-tight text-[var(--br-ink)] md:text-4xl">{heading}</h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">{intro}</p>

      <ul className="mt-7 flex flex-wrap gap-2.5">
        {pills.map((p) => (
          <li key={p} className="rounded-md border border-[var(--br-gold)] px-3 py-1.5 text-sm text-[var(--br-gold)]">
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-16">
        <h3 className="text-lg font-bold tracking-tight text-[var(--br-ink)]">{productsHeading}</h3>
        <p className="mt-1.5 max-w-xl text-sm text-neutral-600">{productsIntro}</p>
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
          <div className="relative rounded-[var(--br-card-radius)] border-2 border-[var(--br-gold)] bg-white px-6 pb-8 pt-20 text-center md:pt-24">
            {'badge' in baserate && baserate.badge && (
              <span className="absolute left-5 top-5 rounded-md bg-[var(--br-gold)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                {baserate.badge}
              </span>
            )}
            <BaserateBadge className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2" />
            <BaserateWordmark className="text-2xl text-[var(--br-ink)] md:text-3xl" />
            <p className="mt-4 text-sm font-semibold text-[var(--br-ink)] md:text-base">{baserate.tagline}</p>
            <p className="mt-1.5 text-sm italic text-neutral-400">{baserate.sub}</p>
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
          <div className="relative rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-white px-6 pb-7 pt-16 text-center md:pt-20">
            <JournalyticBadge className="absolute left-1/2 top-0 h-14 w-14 -translate-x-1/2 -translate-y-1/2" />
            <span className="inline-flex items-center gap-2 text-xl font-semibold text-[var(--br-ink)] md:text-2xl">
              <JournalyticBadge className="h-7 w-7 shadow-none ring-0" />
              Journalytic
            </span>
            <p className="mt-3 text-sm font-medium text-[var(--br-ink)]">{journalytic.tagline}</p>
            <p className="mt-1.5 text-sm italic text-neutral-400">{journalytic.sub}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
