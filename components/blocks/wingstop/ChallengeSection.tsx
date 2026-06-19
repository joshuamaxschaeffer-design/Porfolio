'use client'

import { challenge as defaults } from './data'
import { ImageCompareSlider } from '../shared/ImageCompareSlider'

/** Inline glyphs for the three problems (stroke = currentColor). */
function ProblemIcon({ kind }: { kind?: string }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (kind === 'store')
    return (
      <svg {...common}>
        <path d="M4 9.5 5.2 4h13.6L20 9.5" />
        <path d="M4 9.5h16v2a4 4 0 0 1-8 0 4 4 0 0 1-8 0v-2Z" />
        <path d="M5.5 13.8V20h13v-6.2" />
        <path d="M10 20v-4h4v4" />
      </svg>
    )
  if (kind === 'math')
    return (
      <svg {...common}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
        <path d="M7 8h4M9 6v4" />
        <path d="M14 8h3" />
        <path d="M7 15h3M14 14.2l2.4 2.6M16.4 14.2 14 16.8" />
      </svg>
    )
  // default: menu / list overload
  return (
    <svg {...common}>
      <path d="M4 6h10M4 12h16M4 18h12" />
      <circle cx="18.5" cy="6" r="1.4" />
      <circle cx="19" cy="18" r="1.4" />
    </svg>
  )
}

/**
 * Section 3 — The Challenge. Full-bleed Wingstop-GREEN band. Heading + intro
 * forced white (NOT a token override — the white problem cards keep dark text +
 * green tag). Each card gets a glyph; a real Old→New ImageCompareSlider closes
 * the section.
 */
export function ChallengeSection({ intro }: { intro?: string } = {}) {
  const c = defaults.compare
  return (
    <section id="challenge" className="bg-[var(--ws-green)]">
      <div className="br-container pt-16 pb-20 md:pt-20 md:pb-[120px]">
        <h2 className="text-[32px] font-medium uppercase leading-none text-white md:text-[40px]">
          3. {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-white/90 md:text-[22px]">
          {intro ?? defaults.intro}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-3 md:gap-[30px]">
          {defaults.problems.map((p) => (
            <div
              key={p.tag}
              className="flex h-full flex-col rounded-[var(--br-card-radius)] bg-white p-6 [box-shadow:var(--br-card-shadow)] md:p-7"
            >
              <div className="flex items-center gap-3 text-[var(--ws-green)]">
                <ProblemIcon kind={p.icon} />
                <p className="br-data text-[14px] uppercase tracking-[0.12em]">{p.tag}</p>
              </div>
              <h3 className="mt-3 text-[20px] font-semibold leading-snug text-[var(--br-ink)] md:text-[22px]">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {/* Old → New before/after */}
        <div className="mt-14 md:mt-20">
          <p className="br-data text-[14px] uppercase tracking-[0.12em] text-white/80">{c.eyebrow}</p>
          <h3 className="mt-2 text-[24px] font-semibold leading-tight text-white md:text-[28px]">
            {c.title}
          </h3>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-normal text-white/85 md:text-base">
            {c.body}
          </p>
          <div className="mt-6 overflow-hidden rounded-[var(--br-card-radius)] [box-shadow:0_18px_40px_rgba(0,0,0,0.28)]">
            <ImageCompareSlider
              before={c.before}
              after={c.after}
              beforeLabel={c.beforeLabel}
              afterLabel={c.afterLabel}
              ratio="16 / 10"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
