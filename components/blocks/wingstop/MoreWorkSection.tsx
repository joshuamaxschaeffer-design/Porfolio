'use client'

import { moreWork as defaults } from './data'

/**
 * Section 7 — MORE WORK. WHITE band. A light, lower-priority carousel of the
 * supporting surfaces (store-finder / location pages). Native scroll-snap rail
 * in the spirit of the Panda rewards carousel, kept deliberately understated.
 */
export function MoreWorkSection({ intro }: { intro?: string } = {}) {
  return (
    <section id="more-work" className="bg-white">
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">
          {defaults.eyebrow}
        </p>
        <h2 className="mt-3 text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          7. {defaults.heading}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">
          {intro ?? defaults.intro}
        </p>

        <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:-mx-20 md:mt-14 md:px-20 [scrollbar-width:thin]">
          {defaults.items.map((it) => (
            <figure key={it.src} className="w-[300px] shrink-0 snap-start sm:w-[360px]">
              <div className="overflow-hidden rounded-[16px] border border-[var(--br-line)] bg-[var(--br-bg-2)] [box-shadow:var(--br-card-shadow)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.src} alt={it.title} loading="lazy" className="block w-full" />
              </div>
              <figcaption className="mt-3">
                <p className="text-[15px] font-semibold text-[var(--br-ink)]">{it.title}</p>
                <p className="mt-0.5 text-[14px] text-[var(--br-muted)]">{it.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
