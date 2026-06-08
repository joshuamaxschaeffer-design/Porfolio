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
      <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-4">
        {section.features.map((f) => (
          <li
            key={f.label}
            className="br-data inline-flex items-center gap-2.5 rounded-[var(--br-tag-radius)] border border-[var(--br-stroke)] px-4 py-2 text-[14px] uppercase text-[var(--br-muted)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/baserate/icons/${f.icon}.svg`} alt="" aria-hidden className="h-4 w-4 shrink-0" />
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
    <section className="pb-20 pt-[120px] md:pb-[160px] md:pt-[120px]">
      {pairs.map((pair, p) => {
        const carousel = carousels[p]
        return (
          <div key={p} className={p > 0 ? 'mt-20 md:mt-28' : ''}>
            {/* Carousel bleeds full-width; staggered by its offset. The
                component manages its own overflow (clipped marquee on desktop,
                native scroll-snap on mobile). EdgeFadeBlur dissolves the left &
                right edges into the white page bg with a progressive blur. */}
            {carousel && (
              <EdgeFadeBlur bg="#ffffff">
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
