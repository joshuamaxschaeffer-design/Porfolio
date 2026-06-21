'use client'

import { Reveal } from '../../../animation/Reveal'
import { BluePlaceholder, type BlueRatio } from '../BluePlaceholder'
import { DragCarousel } from '../../shared/DragCarousel'

/**
 * Shared building blocks for the Capabilities work modules.
 * Composable; each discipline file just arranges them. All visuals are
 * BluePlaceholder (FPO) for now. `dark` adapts every primitive for dark bands.
 */

/** Mini-case / module header: kicker + title + optional role + blurb. */
export function AnchorHeader({
  kicker,
  title,
  role,
  blurb,
  dark = false,
}: {
  kicker?: string
  title: string
  role?: string
  blurb?: string
  dark?: boolean
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
          <h3
            className={`text-[22px] font-medium tracking-[-0.01em] md:text-[30px] ${
              dark ? 'text-white' : 'text-[var(--br-ink)]'
            }`}
          >
            {title}
          </h3>
          {role && (
            <span
              className={`br-data text-[12px] uppercase tracking-[0.08em] ${
                dark ? 'text-white/45' : 'text-[var(--br-muted-2)]'
              }`}
            >
              {role}
            </span>
          )}
        </div>
        {blurb && (
          <p
            className={`mt-3 max-w-[60ch] text-[15px] leading-normal md:text-base ${
              dark ? 'text-white/55' : 'text-[var(--br-muted)]'
            }`}
          >
            {blurb}
          </p>
        )}
      </div>
    </Reveal>
  )
}

/**
 * ModuleCard — a subtle container that groups an anchor mini-case (header +
 * media) into one distinct block so the long scroll reads as discrete cards,
 * not floating content. Tone-aware; light padding so media still breathes.
 */
export function ModuleCard({
  dark = false,
  children,
}: {
  dark?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`rounded-[var(--br-card-radius)] border p-5 md:p-8 ${
        dark ? 'border-white/12 bg-white/[0.03]' : 'border-[var(--br-line)] bg-white/60'
      }`}
    >
      {children}
    </div>
  )
}

/** Small caption under a placeholder. */
export function ModuleCaption({
  children,
  dark = false,
}: {
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <p
      className={`br-data mt-3 text-[11px] uppercase leading-snug tracking-[0.08em] ${
        dark ? 'text-white/40' : 'text-[var(--br-muted-2)]'
      }`}
    >
      {children}
    </p>
  )
}

/**
 * BlueRail — the breadth carousel. Now uses the shared DragCarousel (the exact
 * native-scroll + JS mouse-drag-with-flick-momentum + jump-pills pattern from
 * the Panda / Baserate case studies). Each phone card shows a real screen (when
 * `src`) with a small iOS-style app icon pinned to its bottom-left, plus a
 * caption. Cards without `src` fall back to an FPO placeholder.
 */
export function BlueRail({
  items,
  ratio = 'phone',
  dark = false,
}: {
  items: (string | { label: string; src?: string; icon?: string })[]
  ratio?: BlueRatio
  dark?: boolean
  fullBleed?: boolean
}) {
  const norm = items.map((it) => (typeof it === 'string' ? { label: it } : it))
  const cardW =
    ratio === 'phone' || ratio === 'tall'
      ? 'w-[200px] md:w-[230px]'
      : ratio === 'wide' || ratio === 'video' || ratio === 'ultrawide'
        ? 'w-[300px] md:w-[380px]'
        : 'w-[240px] md:w-[280px]'

  const cards = norm.map((it) => (
    <div key={it.label} className={cardW}>
      {it.src ? (
        <figure className="relative pb-6 pl-6">
          <div
            className={`overflow-hidden rounded-[18px] border bg-white ${
              dark ? 'border-white/10' : 'border-[var(--br-line)]'
            } shadow-[0_8px_24px_rgba(7,14,44,0.10)]`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.src}
              alt={it.label}
              draggable={false}
              className="aspect-[9/19.5] w-full object-cover object-top"
              loading="lazy"
            />
          </div>
          {/* iOS-style app icon — 2× larger, sits OUTSIDE the screen, bottom-left, overlapping */}
          {it.icon && (
            <span className="absolute bottom-0 left-0 flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-[20px] border border-black/10 bg-white p-2.5 shadow-[0_8px_22px_rgba(0,0,0,0.25)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.icon} alt="" draggable={false} className="h-full w-full object-contain" />
            </span>
          )}
          <figcaption
            className={`br-data mt-2 pl-1 text-[11px] uppercase tracking-[0.06em] ${
              dark ? 'text-white/50' : 'text-[var(--br-muted-2)]'
            }`}
          >
            {it.label}
          </figcaption>
        </figure>
      ) : (
        <BluePlaceholder ratio={ratio} label={it.label} dark={dark} />
      )}
    </div>
  ))

  return <DragCarousel items={cards} dark={dark} pills={false} gapClass="gap-8 md:gap-12" />
}

/** A flow step: a label + optional real screen image. */
export interface FlowStep {
  label: string
  src?: string
}

/** Numbered flow as a row of phone screens (real img if `src`, else FPO) + arrows. */
export function BlueFlowRow({
  steps,
  caption,
  dark = false,
}: {
  steps: (string | FlowStep)[]
  caption?: string
  dark?: boolean
}) {
  const norm = steps.map((s) => (typeof s === 'string' ? { label: s } : s))
  return (
    <Reveal>
      <div className="-mx-6 overflow-x-auto px-6 pb-3 md:-mx-10 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-3 md:gap-4" style={{ width: 'max-content' }}>
          {norm.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3 md:gap-4">
              <div className="w-[150px] shrink-0 md:w-[180px]">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`br-data flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-[var(--br-gold)] ${
                      dark ? 'bg-white/10' : 'bg-[var(--br-bg-2)]'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`br-data text-[11px] uppercase tracking-[0.06em] ${
                      dark ? 'text-white/55' : 'text-[var(--br-muted)]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {step.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={step.src}
                    alt={step.label}
                    className="aspect-[9/19.5] w-full rounded-[14px] border border-black/5 object-cover object-top shadow-[0_8px_24px_rgba(7,14,44,0.12)]"
                    loading="lazy"
                  />
                ) : (
                  <BluePlaceholder ratio="phone" dark={dark} />
                )}
              </div>
              {i < norm.length - 1 && (
                <span aria-hidden className={dark ? 'text-white/20' : 'text-[var(--br-line)]'}>
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
      {caption && <ModuleCaption dark={dark}>{caption}</ModuleCaption>}
    </Reveal>
  )
}

/** A labelled grid of FPO boxes (brand boards, AD stills, etc.). */
export function BlueGrid({
  items,
  cols = 3,
  ratio = 'square',
  dark = false,
}: {
  items: string[]
  cols?: 2 | 3 | 4
  ratio?: BlueRatio
  dark?: boolean
}) {
  const colClass =
    cols === 2
      ? 'sm:grid-cols-2'
      : cols === 4
        ? 'grid-cols-2 md:grid-cols-4'
        : 'grid-cols-2 md:grid-cols-3'
  return (
    <Reveal>
      <div className={`grid gap-4 md:gap-5 ${colClass}`}>
        {items.map((label) => (
          <BluePlaceholder key={label} ratio={ratio} label={label} dark={dark} />
        ))}
      </div>
    </Reveal>
  )
}
