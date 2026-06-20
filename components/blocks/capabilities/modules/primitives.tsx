'use client'

import { Reveal } from '../../../animation/Reveal'
import { BluePlaceholder, type BlueRatio } from '../BluePlaceholder'

/**
 * Shared building blocks for the Capabilities work modules (bluescale FPO pass).
 * Kept deliberately small + composable so each discipline file just arranges
 * them. All visuals are BluePlaceholder so the page reads as "structure first."
 */

/** Mini-case / module header: kicker + title + optional role + blurb. */
export function AnchorHeader({
  kicker,
  title,
  role,
  blurb,
}: {
  kicker?: string
  title: string
  role?: string
  blurb?: string
}) {
  return (
    <Reveal>
      <div className="mb-7 md:mb-9">
        {kicker && (
          <p className="br-data text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--br-gold)]">
            {kicker}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="text-[22px] font-medium tracking-[-0.01em] text-[var(--br-ink)] md:text-[30px]">
            {title}
          </h3>
          {role && (
            <span className="br-data text-[12px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">
              {role}
            </span>
          )}
        </div>
        {blurb && (
          <p className="mt-3 max-w-[60ch] text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
            {blurb}
          </p>
        )}
      </div>
    </Reveal>
  )
}

/** Small caption under a placeholder. */
export function ModuleCaption({ children }: { children: React.ReactNode }) {
  return (
    <p className="br-data mt-3 text-[11px] uppercase leading-snug tracking-[0.08em] text-[var(--br-muted-2)]">
      {children}
    </p>
  )
}

/**
 * BlueRail — a horizontally scrollable rail of FPO cards (the "browse the work"
 * breadth rail). Native horizontal scroll with snap; each card is a labelled
 * BluePlaceholder. (Real version later swaps to DragGallery with real images.)
 */
export function BlueRail({
  items,
  ratio = 'phone',
}: {
  items: string[]
  ratio?: BlueRatio
}) {
  // card width by aspect: phone screens narrower, wide cards broader
  const cardW =
    ratio === 'phone' || ratio === 'tall'
      ? 'w-[180px] md:w-[210px]'
      : ratio === 'wide' || ratio === 'video' || ratio === 'ultrawide'
        ? 'w-[300px] md:w-[380px]'
        : 'w-[240px] md:w-[280px]'
  return (
    <Reveal>
      <div className="-mx-6 overflow-x-auto px-6 pb-3 md:-mx-10 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4 md:gap-5" style={{ width: 'max-content' }}>
          {items.map((label) => (
            <div key={label} className={`${cardW} shrink-0 snap-start`}>
              <BluePlaceholder ratio={ratio} label={label} />
            </div>
          ))}
        </div>
      </div>
      <ModuleCaption>← Scroll · {items.length} items (FPO — real screens drop in here)</ModuleCaption>
    </Reveal>
  )
}

/**
 * BlueFlowRow — a numbered flow as a row of FPO phone screens with arrows
 * between them (e.g. order → scan → reward). Scrolls horizontally on narrow.
 */
export function BlueFlowRow({
  steps,
  caption,
}: {
  steps: string[]
  caption?: string
}) {
  return (
    <Reveal>
      <div className="-mx-6 overflow-x-auto px-6 pb-3 md:-mx-10 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-3 md:gap-4" style={{ width: 'max-content' }}>
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-3 md:gap-4">
              <div className="w-[150px] shrink-0 md:w-[180px]">
                <div className="mb-2 flex items-center gap-2">
                  <span className="br-data flex h-5 w-5 items-center justify-center rounded-full bg-[var(--br-bg-2)] text-[10px] font-semibold text-[var(--br-gold)]">
                    {i + 1}
                  </span>
                  <span className="br-data text-[11px] uppercase tracking-[0.06em] text-[var(--br-muted)]">
                    {step}
                  </span>
                </div>
                <BluePlaceholder ratio="phone" />
              </div>
              {i < steps.length - 1 && (
                <span aria-hidden className="text-[var(--br-line)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {caption && <ModuleCaption>{caption}</ModuleCaption>}
    </Reveal>
  )
}

/** A simple labelled grid of FPO boxes (e.g. brand boards, AD stills). */
export function BlueGrid({
  items,
  cols = 3,
  ratio = 'square',
}: {
  items: string[]
  cols?: 2 | 3 | 4
  ratio?: BlueRatio
}) {
  const colClass =
    cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'
  return (
    <Reveal>
      <div className={`grid gap-4 md:gap-5 ${colClass}`}>
        {items.map((label) => (
          <BluePlaceholder key={label} ratio={ratio} label={label} />
        ))}
      </div>
    </Reveal>
  )
}
