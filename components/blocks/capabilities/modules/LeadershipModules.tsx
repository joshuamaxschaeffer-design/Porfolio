'use client'

import { AnchorHeader, ModuleCaption } from './primitives'

/** Section 06 — Leadership & How I Work (WHITE section, light tone). Real artifacts. */
export function LeadershipModules({ dark = false }: { dark?: boolean }) {
  const cards = [
    {
      kicker: 'Advocacy',
      title: 'Pitched, not just made',
      blurb: 'The internal deck that sold Mindbody on an illustration program — then the style guide that delivered it.',
      src: '/capabilities/leadership/illo-proposal.webp',
      caption: 'Mindbody — illustration program pitch',
      note: 'Design leadership = selling the idea, then shipping the system.',
    },
    {
      kicker: 'Systems',
      title: 'Built for handoff',
      blurb: 'Toolkits and languages other designers and engineers extend without me in the room.',
      src: '/capabilities/leadership/systems.webp',
      caption: 'Baserate — the system, documented',
      note: 'Lead → Art Director → Head of Design.',
    },
    {
      kicker: 'AI prototyping',
      title: 'Building with models',
      blurb: 'Designing and shipping with AI in the loop — an investor-grade product (Baserate) prototyped live.',
      src: '/capabilities/leadership/ai-prototyping.webp',
      caption: 'Baserate — AI in the product',
      note: 'Prototyped, pressure-tested, and shipped.',
    },
  ]
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
      {cards.map((c) => (
        <div key={c.title}>
          <AnchorHeader dark={dark} kicker={c.kicker} title={c.title} blurb={c.blurb} />
          <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.src} alt={c.caption} className="aspect-[16/10] w-full object-cover object-top" loading="lazy" />
            <figcaption className="br-data px-4 py-3 text-[11px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">
              {c.caption}
            </figcaption>
          </figure>
          <ModuleCaption dark={dark}>{c.note}</ModuleCaption>
        </div>
      ))}
    </div>
  )
}
