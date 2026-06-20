'use client'

import { Reveal } from '../../../animation/Reveal'
import { BluePlaceholder } from '../BluePlaceholder'
import { AnchorHeader, BlueGrid, ModuleCaption } from './primitives'

/** Section 03 — Design Systems & Implementation (NAVY section, dark tone). */
export function DesignSystemsModules({ dark = true }: { dark?: boolean }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Component libraries (scale) */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Scale"
          title="Component libraries, by the thousand"
          blurb="Tokenized libraries built per product — kept consistent across every surface. The Raising Cane’s system alone runs 447 components; Baserate’s is the system behind the investor platform."
        />
        <BlueGrid
          dark={dark}
          cols={4}
          ratio="square"
          items={['Atoms — buttons, fields', 'Molecules — cells, cards', 'Navigation — bars, tabs', 'Modals & overlays', 'Forms & inputs', 'Tags & pills', 'Data tables', 'Icon set (24/32px)']}
        />
        <ModuleCaption dark={dark}>Component sheet (FPO) — real library captures drop in here.</ModuleCaption>
      </div>

      {/* Tokens + scale */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <AnchorHeader dark={dark} kicker="Tokens" title="Decisions, not values" blurb="Color, type, and spacing as tokens — change once, propagate everywhere." />
          <BluePlaceholder ratio="portrait" dark={dark} label="Token → component wiring (FPO)" />
        </div>
        <div className="md:col-span-7">
          <AnchorHeader dark={dark} kicker="Scale" title="One system, many screens" blurb="The receding “zoom-out” of screens that proves a system holds at scale." />
          <BluePlaceholder ratio="wide" dark={dark} label="Scalability timeline — receding screens (FPO)" />
        </div>
      </div>

      {/* Design ↔ code */}
      <div>
        <AnchorHeader dark={dark} kicker="Implementation" title="Design ↔ code handoff" blurb="The component on the left; the code that builds it on the right — so engineers extend the system without me in the room." />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <Reveal><BluePlaceholder ratio="video" dark={dark} label="Live UI component (FPO)" /></Reveal>
          <Reveal delay={80}><BluePlaceholder ratio="video" dark={dark} label="The code behind it (FPO)" /></Reveal>
        </div>
      </div>

      {/* Data-viz spotlight */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Data-viz · the differentiator"
          title="Dense analytics, made legible"
          role="Mindbody · Baserate"
          blurb="Reporting and investor dashboards with documented data-viz pattern sets — an executive summary paired with a granular analyst view."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7"><BluePlaceholder ratio="wide" dark={dark} label="Baserate — investor dashboard, hero chart (FPO)" /></div>
          <div className="md:col-span-5"><BluePlaceholder ratio="wide" dark={dark} label="Mindbody — analytics, zoomed out (FPO)" /></div>
        </div>
      </div>
    </div>
  )
}
