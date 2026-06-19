'use client'

import { flavorWorld as defaults } from './data'
import { PerspectiveDeviceGrid } from '../shared/PerspectiveDeviceGrid'
import { MarqueeStrip } from '../shared/MarqueeStrip'
import { CraveSlider } from './CraveSlider'

/** Heat-scale gradient (sweet green → blazing red) + labels — real shipped UI. */
const HEAT_COLORS = ['#23c265', '#7bbf3a', '#c7c531', '#f1b228', '#f08a21', '#e85d1f', '#df3a23', '#c4151c']
const HEAT_LABELS = ['No Heat', 'Mild', 'Medium', 'Zesty', 'Hot', 'Fiery', 'Scorching', 'Blazing Hot']

/**
 * Section 4 — FLAVOR WORLD. The dark, photography-forward showpiece.
 * BLACK band: real flavor screens in the perspective device grid, the real
 * Heat-Scale slider recreated (CraveSlider), a flavor-icon system grid, and a
 * flavor-name marquee. Brightened green accent on black.
 */
export function FlavorWorldSection({ intro }: { intro?: string } = {}) {
  return (
    <section
      id="flavor-world"
      className="ws-dark relative overflow-hidden bg-[#0c0d0d]"
      style={
        {
          '--br-ink': '#f6f7f8',
          '--br-body': '#d4d7dd',
          '--br-muted': '#9aa0aa',
          '--br-muted-2': '#7c828d',
          '--br-line': 'rgba(255,255,255,0.14)',
          '--ws-green': '#23c265',
        } as React.CSSProperties
      }
    >
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
          {defaults.eyebrow}
        </p>
        <h2 className="mt-3 text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          4. {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">
          {intro ?? defaults.intro}
        </p>

        {/* Real flavor screens, laid down in perspective. */}
        <div className="mt-12 md:mt-16">
          <PerspectiveDeviceGrid screens={defaults.screens} accent="#23c265" rows={2} />
        </div>

        {/* Heat scale (real shipped slider) + flavor icon system, side by side on desktop. */}
        <div className="mt-16 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-2 md:gap-[60px]">
          {/* Heat scale */}
          <div>
            <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
              {defaults.heat.eyebrow}
            </p>
            <h3 className="mt-3 text-[24px] font-semibold leading-tight text-[var(--br-ink)] md:text-[28px]">
              {defaults.heat.title}
            </h3>
            <p className="mt-3 max-w-[48ch] text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
              {defaults.heat.body}
            </p>
            <div className="mt-6 rounded-[var(--br-card-radius)] border border-white/10 bg-white/[0.04] px-3 backdrop-blur-sm">
              <CraveSlider colors={HEAT_COLORS} labels={HEAT_LABELS} start={2} caption="Heat:" />
            </div>
          </div>

          {/* Flavor icon system */}
          <div>
            <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
              {defaults.iconsEyebrow}
            </p>
            <h3 className="mt-3 text-[24px] font-semibold leading-tight text-[var(--br-ink)] md:text-[28px]">
              Every flavor, one glyph
            </h3>
            <p className="mt-3 max-w-[48ch] text-[15px] leading-normal text-[var(--br-muted)] md:text-base">
              {defaults.iconsNote}
            </p>
            <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {defaults.icons.map((ic) => (
                <li
                  key={ic.name}
                  className="group flex flex-col items-center gap-2 rounded-[12px] border border-white/10 bg-white/[0.04] px-2 py-4 text-center transition-colors hover:border-[var(--ws-green)]/50 hover:bg-white/[0.07]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ic.src}
                    alt={ic.name}
                    className="h-9 w-9 object-contain opacity-90 [filter:brightness(0)_invert(1)] transition-opacity group-hover:opacity-100"
                  />
                  <span className="br-data text-[10px] uppercase leading-tight tracking-[0.06em] text-[var(--br-muted-2)]">
                    {ic.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Flavor-name marquee — full bleed across the black band. */}
      <div
        className="border-y border-white/10 py-6 text-[22px] font-semibold uppercase tracking-[0.04em] text-[var(--ws-green)] md:text-[30px]"
        style={{ fontFamily: 'var(--br-font-heading)' }}
      >
        <MarqueeStrip items={defaults.marquee} baseVelocity={28} separator="•" />
      </div>
    </section>
  )
}
