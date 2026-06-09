import { featureSections as defaultSections, featureCarousels as defaultCarousels, type Feature } from './data'
import { AutoScrollCarousel, type CarouselRow } from './AutoScrollCarousel'
import { EdgeFadeBlur } from './EdgeFadeBlur'

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
      {/* number badge (26px circle, Recursive ExtraBold 16) + title (24px Lexend SemiBold uppercase) */}
      <div className="flex items-center gap-2">
        <span className="br-data flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[var(--br-ink)] text-[16px] font-extrabold leading-none text-white">
          {section.number}
        </span>
        <h3 className="text-[24px] font-semibold uppercase leading-[26px] text-[var(--br-ink)]">{section.title}</h3>
      </div>
      <p className="mt-2 text-[16px] leading-snug text-[var(--br-muted)]">{section.body}</p>
      {/* pills: Recursive 14px UPPERCASE, border #d6d6d6, px16 py8, gap10 icon↔text */}
      {/* Mobile: a 2-ROW grid that flows into columns running off the RIGHT
          screen edge; the whole block is one horizontal scroller (swipe to see
          the rest). Desktop: the usual wrapping flow. */}
      <ul className="br-noscrollbar -mr-6 mt-4 grid grid-flow-col grid-rows-2 auto-cols-max gap-x-1.5 gap-y-1.5 overflow-x-auto pr-6 md:mr-0 md:flex md:flex-wrap md:gap-x-3 md:gap-y-4 md:overflow-visible md:pr-0" style={{ touchAction: 'pan-x' }}>
        {section.features.map((f) => (
          <li
            key={f.label}
            className="br-data inline-flex items-center gap-1.5 whitespace-nowrap rounded-[var(--br-tag-radius)] border border-[var(--br-stroke)] px-2.5 py-1.5 text-[11px] uppercase text-[var(--br-muted)] md:gap-2.5 md:px-4 md:py-2 md:text-[14px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/baserate/icons/${f.icon}.svg`} alt="" aria-hidden className="h-3 w-3 shrink-0 md:h-4 md:w-4" />
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
    <section className="pb-20 pt-[60px] md:pb-[160px] md:pt-[120px]">
      {pairs.map((pair, p) => {
        const carousel = carousels[p]
        return (
          <div key={p} className={p > 0 ? 'mt-20 md:mt-28' : ''}>
            {/* Carousel bleeds full-width; staggered by its offset. The
                component manages its own overflow (clipped marquee on desktop,
                native scroll-snap on mobile). EdgeFadeBlur dissolves the left &
                right edges into the white page bg with a progressive blur. */}
            {carousel && (
              <EdgeFadeBlur bg="var(--br-bg-2)">
                <AutoScrollCarousel row={carousel} startOffset={carousel.offset ?? 0} />
              </EdgeFadeBlur>
            )}
            {/* Feature columns. Figma: outer gutters 80px, inner gutter ~40px
                (left col pr-20 + right col pl-20). br-container already pads 80px. */}
            <div className="br-container mt-12">
              <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
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
