import { webNeeds as defaults } from './data'
import { DragGrid } from './DragGrid'

/**
 * SECTION 8 — ADDITIONAL WEB NEEDS. White field. A draggable grid carousel
 * (Samsung SocialCarousel signature: drag + inertia + arrow controls) of
 * supporting pages: locations, store finder, careers.
 */
export function WebNeedsSection() {
  return (
    <section id="web-needs" className="bg-white">
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">8. {defaults.eyebrow}</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] text-[var(--br-ink)] md:text-[40px]">{defaults.heading}</h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{defaults.intro}</p>

        <div className="mt-10 md:mt-14">
          <DragGrid items={defaults.items} tone="light" />
        </div>
      </div>
    </section>
  )
}
