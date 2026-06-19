import { appFoundation as defaults } from './data'
import { PerspectiveDeviceGrid } from '../shared/PerspectiveDeviceGrid'

/**
 * Section 2 — "The Full App, Across Platforms" (foundational; built first per
 * Joshua). WHITE band. Real product/cart/checkout screens laid down in the
 * shared perspective device grid. Establishes that he owned the whole product
 * across mobile + desktop before the flavor work.
 */
export function AppFoundationSection({ intro }: { intro?: string } = {}) {
  return (
    <section id="app-foundation" className="bg-white">
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
          {defaults.eyebrow}
        </p>
        <h2 className="mt-3 text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">
          {intro ?? defaults.intro}
        </p>

        <div className="mt-12 md:mt-16">
          <PerspectiveDeviceGrid
            screens={defaults.screens}
            accent="#00843D"
            caption={defaults.caption}
          />
        </div>
      </div>
    </section>
  )
}
