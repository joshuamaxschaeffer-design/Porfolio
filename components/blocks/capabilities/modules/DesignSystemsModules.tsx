'use client'

import { Reveal } from '../../../animation/Reveal'
import { AnchorHeader, ModuleCaption } from './primitives'

/** A real image on a white card (for the navy/dark section). */
function ImgCard({
  src,
  alt,
  caption,
  contain = false,
}: {
  src: string
  alt: string
  caption?: string
  contain?: boolean
}) {
  return (
    <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-white/10 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`w-full ${contain ? 'object-contain p-4' : 'object-cover'}`}
        loading="lazy"
      />
      {caption && (
        <figcaption className="br-data px-4 py-3 text-[11px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** Section 03 — Design Systems & Implementation (NAVY section, dark tone). */
export function DesignSystemsModules({ dark = true }: { dark?: boolean }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Component library hero — real Baserate system sheet */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Scale"
          title="Component libraries, by the thousand"
          blurb="Tokenized libraries built per product — kept consistent across every surface. The Raising Cane’s system alone runs 447 components; this is the system behind Baserate."
        />
        <Reveal>
          <ImgCard src="/capabilities/design-systems/baserate-components.webp" alt="Baserate design-system component sheet" caption="Baserate — color, components, data-viz, icons" />
        </Reveal>
      </div>

      {/* Tokens + scale */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10 md:items-start">
        <div className="md:col-span-5">
          <AnchorHeader dark={dark} kicker="Tokens & UI" title="One system, applied" blurb="Color, type, and spacing as tokens — change once, propagate everywhere." />
          <ImgCard src="/capabilities/design-systems/baserate-ui.webp" alt="Baserate desktop UI built from the system" />
        </div>
        <div className="md:col-span-7">
          <AnchorHeader dark={dark} kicker="Scale" title="Holds across many screens" blurb="The same system, screen after screen." />
          <ImgCard src="/capabilities/design-systems/scalability.webp" alt="Baserate screens at scale" />
        </div>
      </div>

      {/* Design ↔ build */}
      <div>
        <AnchorHeader dark={dark} kicker="Implementation" title="Designed to be built" blurb="Complex flows (like Baserate’s decision builder) designed so engineers extend the system without me in the room." />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <Reveal><ImgCard src="/capabilities/design-systems/baserate-decision.webp" alt="Baserate decision builder" /></Reveal>
          <Reveal delay={80}><ImgCard src="/capabilities/design-systems/baserate-ui.webp" alt="Baserate UI in the product" /></Reveal>
        </div>
      </div>

      {/* Data-viz spotlight — real Mindbody dashboards */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Data-viz · the differentiator"
          title="Dense analytics, made legible"
          role="Mindbody · Baserate"
          blurb="Reporting and analytics with documented data-viz patterns — an executive summary paired with a granular analyst view."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8 md:items-start">
          <div className="md:col-span-7"><ImgCard src="/capabilities/design-systems/mb-dashboard-1.png" alt="Mindbody analytics — sales & retention" caption="Mindbody — analytics & reporting" /></div>
          <div className="md:col-span-5"><ImgCard src="/capabilities/design-systems/mb-dashboard-2.png" alt="Mindbody analytics dashboard, full view" caption="Mindbody — full dashboard" /></div>
        </div>
        <ModuleCaption dark={dark}>A hero chart, then the full dashboard — the white-space differentiator.</ModuleCaption>
      </div>
    </div>
  )
}
