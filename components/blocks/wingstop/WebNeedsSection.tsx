'use client'

import { webNeeds as defaults } from './data'
import { DragCarousel } from '../shared/DragCarousel'

/**
 * SECTION 8 — ADDITIONAL WEB NEEDS. White field. The supporting pages on the
 * SHARED draggable rail (DragCarousel: native scroll + mouse drag + flick
 * momentum, full-bleed to the screen edge). Each page is a screen sitting on a
 * raised browser-style card, so the row reads as real shipped pages you can
 * drag through edge to edge.
 */
export function WebNeedsSection() {
  const items = defaults.items.map((it) => <PageCard key={it.src} src={it.src} label={it.label} />)

  return (
    <section id="web-needs" className="bg-white">
      <div className="br-container pt-16 md:pt-24">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">8. {defaults.eyebrow}</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] text-[var(--br-ink)] md:text-[40px]">{defaults.heading}</h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{defaults.intro}</p>
      </div>

      <div className="mt-10 pb-20 md:mt-14 md:pb-[120px]">
        <DragCarousel items={items} pills={false} />
      </div>
    </section>
  )
}

/** A supporting page shown as a screen raised on a browser-chrome card. */
function PageCard({ src, label }: { src: string; label: string }) {
  return (
    <figure className="w-[80vw] max-w-[680px] sm:w-[58vw] lg:w-[620px]">
      <div className="overflow-hidden rounded-2xl border border-[var(--br-line)] bg-white [box-shadow:0_24px_55px_-18px_rgba(0,0,0,0.35)]">
        {/* browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#f3f3f5] px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
        </div>
        <div className="aspect-[16/10] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={label} loading="lazy" draggable={false} className="block w-full object-cover object-top" />
        </div>
      </div>
      <figcaption className="br-data mt-3 text-[13px] uppercase tracking-[0.1em] text-[var(--br-muted-2)]">{label}</figcaption>
    </figure>
  )
}
