import { featureSections as defaultSections, featureCarousels as defaultCarousels, type Feature } from './data'
import { AutoScrollCarousel, type CarouselRow } from './AutoScrollCarousel'

interface FeatureSection {
  number: number
  title: string
  body: string
  features: Feature[]
}

interface FeatureEcosystemProps {
  sections?: FeatureSection[]
  carousels?: CarouselRow[]
}

function FeatureColumn({ section }: { section: FeatureSection }) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--br-ink)] text-[11px] font-semibold text-white">
          {section.number}
        </span>
        <h3 className="text-base font-bold tracking-tight text-[var(--br-ink)] md:text-lg">{section.title}</h3>
      </div>
      <p className="mt-2 max-w-md text-sm leading-snug text-neutral-500">{section.body}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {section.features.map((f) => (
          <li
            key={f.label}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--br-line)] bg-white px-2.5 py-1.5 text-xs text-neutral-700"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/baserate/icons/${f.icon}.svg`} alt="" aria-hidden className="h-3.5 w-3.5 text-neutral-500" />
            {f.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FeatureEcosystemSection(props: FeatureEcosystemProps) {
  const sections = props.sections ?? defaultSections
  const carousels = props.carousels ?? defaultCarousels

  // Pair sections into rows of two; each pair gets a carousel above it.
  const pairs: FeatureSection[][] = []
  for (let i = 0; i < sections.length; i += 2) pairs.push(sections.slice(i, i + 2))

  return (
    <section className="mt-28 md:mt-40">
      {pairs.map((pair, p) => {
        const carousel = carousels[p]
        return (
          <div key={p} className={p > 0 ? 'mt-20 md:mt-28' : ''}>
            {/* Carousel bleeds full-width; staggered by its offset */}
            {carousel && (
              <div className="overflow-hidden">
                <AutoScrollCarousel row={carousel} startOffset={carousel.offset ?? 0} />
              </div>
            )}
            {/* Feature columns */}
            <div className="br-container mt-10">
              <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
                {pair.map((section) => (
                  <FeatureColumn key={section.number} section={section} />
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
