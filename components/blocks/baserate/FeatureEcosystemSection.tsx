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

// Shared pill styling (desktop sizes via md: prefixes).
const PILL_CLASS =
  'br-data inline-flex items-center gap-2.5 rounded-[var(--br-tag-radius)] border border-[var(--br-stroke)] px-4 py-2 text-[14px] uppercase text-[var(--br-muted)]'
// Mobile pill is smaller; same base.
const PILL_CLASS_M =
  'br-data inline-flex items-center gap-1.5 whitespace-nowrap rounded-[var(--br-tag-radius)] border border-[var(--br-stroke)] px-2.5 py-1.5 text-[11px] uppercase text-[var(--br-muted)] shrink-0'

// Estimate a mobile pill's rendered width (px): icon(12) + gaps + h-padding(20)
// + ~6.2px per uppercase char at 11px.
function estWidth(label: string) {
  return 12 + 6 + 20 + 8 + label.length * 6.2
}

// Split features into two rows so the rows' total widths are as balanced as
// possible, preserving order. Greedy: add to whichever row is currently shorter.
function splitRows(features: Feature[]): [Feature[], Feature[]] {
  const r0: Feature[] = []
  const r1: Feature[] = []
  let w0 = 0
  let w1 = 0
  for (const f of features) {
    const w = estWidth(f.label)
    if (w0 <= w1) {
      r0.push(f)
      w0 += w
    } else {
      r1.push(f)
      w1 += w
    }
  }
  return [r0, r1]
}

function Pill({ f }: { f: Feature }) {
  return (
    <li className={PILL_CLASS_M}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/baserate/icons/${f.icon}.svg`} alt="" aria-hidden className="h-3 w-3 shrink-0" />
      {f.label}
    </li>
  )
}

// Two natural-width rows inside one horizontal scroller; only this block scrolls
// (the page never does — overflow is contained here). The scroller FULL-BLEEDS
// to the screen edges: -mx-6 cancels the .br-container 1.5rem gutter so pills
// clip at the physical edge of the screen, while px-6 keeps the resting
// content aligned with the column text.
function PillRows({ features }: { features: Feature[] }) {
  const [row0, row1] = splitRows(features)
  return (
    <div className="br-noscrollbar -mx-6 mt-4 overflow-x-auto px-6" style={{ touchAction: 'pan-x pan-y' }}>
      <div className="flex w-max flex-col gap-1.5">
        <ul className="flex gap-1.5">
          {row0.map((f) => (
            <Pill key={f.label} f={f} />
          ))}
        </ul>
        <ul className="flex gap-1.5">
          {row1.map((f) => (
            <Pill key={f.label} f={f} />
          ))}
        </ul>
      </div>
    </div>
  )
}

function FeatureColumn({ section }: { section: FeatureSection }) {
  return (
    <div className="min-w-0">
      {/* number badge (26px circle, Recursive ExtraBold 16) + title (24px Lexend SemiBold uppercase) */}
      <div className="flex items-center gap-2">
        <span className="br-data flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[var(--br-ink)] text-[16px] font-extrabold leading-none text-white">
          {section.number}
        </span>
        <h3 className="min-w-0 text-[24px] font-semibold uppercase leading-[26px] text-[var(--br-ink)]">{section.title}</h3>
      </div>
      <p className="mt-2 text-[16px] leading-snug text-[var(--br-muted)]">{section.body}</p>
      {/* pills: Recursive 14px UPPERCASE, border #d6d6d6, px16 py8, gap10 icon↔text */}
      {/* Mobile: TWO rows that keep each pill's natural (text-based) width and run
          off the right edge inside a single horizontal scroller (swipe to see the
          rest). Pills are split between the two rows by estimated width so the
          rows are roughly balanced. Desktop: the usual wrapping flow. */}
      <div className="md:hidden">
        <PillRows features={section.features} />
      </div>
      <ul className="mt-4 hidden flex-wrap gap-x-3 gap-y-4 md:flex">
        {section.features.map((f) => (
          <li key={f.label} className={PILL_CLASS}>
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
