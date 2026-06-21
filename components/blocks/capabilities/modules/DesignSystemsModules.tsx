'use client'

import { Reveal } from '../../../animation/Reveal'
import { PageStack } from '../../shared/PageStack'
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
      {/* captions removed per direction — no text beneath media */}
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

      {/* Mindbody NUTool — a major product-management feature (real desktop screens) */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · enterprise tooling"
          title="Defined company-wide systems"
          role="Mindbody · Lead Product Designer"
          blurb="One of my biggest Mindbody builds: the tool studios use to manage their retail catalog — a dense data-table admin, a full add/edit-product flow with a variant matrix, and category taxonomy. Built to stay legible under real operator load."
        />
        <Reveal>
          <ImgCard src="/capabilities/mindbody-new/nutool-1.webp" alt="Mindbody NUTool — product management admin" caption="Retail product management — list + detail panel" />
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          <Reveal><ImgCard src="/capabilities/mindbody-new/nutool-2.webp" alt="Add a product form with variant matrix" caption="Add product · variant matrix" /></Reveal>
          <Reveal delay={60}><ImgCard src="/capabilities/mindbody-new/nutool-4.webp" alt="Edit variant with product imagery" caption="Edit variant · per-location" /></Reveal>
          <Reveal delay={120}><ImgCard src="/capabilities/mindbody-new/nutool-6.webp" alt="Category taxonomy sidebar" caption="Category taxonomy / IA" /></Reveal>
        </div>
        <ModuleCaption dark={dark}>A dense admin tool — designed so power users move fast without errors.</ModuleCaption>
      </div>

      {/* Toolkits & handoff — atomic-design systems across brands */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Handoff"
          title="Atomic systems, documented for handoff"
          blurb="Every product ships a toolkit — atoms → molecules → organisms → templates — so other designers and engineers extend it without me. A few of the documented systems."
        />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {[
            {
              label: 'Raising Cane’s',
              pages: [
                '/capabilities/canes/toolkit-styles.webp',
                '/capabilities/canes/toolkit-atoms.webp',
                '/capabilities/canes/toolkit-molecules.webp',
                '/capabilities/canes/toolkit-spacing.webp',
              ],
            },
            {
              label: 'CBTL',
              pages: [
                '/capabilities/cbtl/toolkit-1.webp',
                '/capabilities/cbtl/toolkit-3.webp',
                '/capabilities/cbtl/toolkit-4.webp',
              ],
            },
            {
              label: 'Trees',
              pages: [
                '/capabilities/trees/toolkit-1.webp',
                '/capabilities/trees/toolkit-2.webp',
                '/capabilities/trees/toolkit-3.webp',
                '/capabilities/trees/toolkit-4.webp',
              ],
            },
            {
              label: 'Mindbody',
              pages: ['/capabilities/mindbody-new/icons-1.webp', '/capabilities/mindbody-new/icons-2.webp'],
            },
          ].map((t) => (
            <PageStack key={t.label} pages={t.pages} label={t.label} dark={dark} />
          ))}
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 md:items-stretch">
          <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-white/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/capabilities/mindbody-new/patterns-1.webp" alt="Mindbody retention-marketing analytics" className="aspect-[4/3] w-full object-cover object-top" loading="lazy" />
          </figure>
          <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-white/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/capabilities/mindbody-new/patterns-3.webp" alt="Mindbody KPI + data-table patterns" className="aspect-[4/3] w-full object-cover object-top" loading="lazy" />
          </figure>
        </div>
      </div>
    </div>
  )
}
