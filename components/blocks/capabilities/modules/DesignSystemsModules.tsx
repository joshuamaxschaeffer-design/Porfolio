'use client'

import { Reveal } from '../../../animation/Reveal'
import { BluePlaceholder } from '../BluePlaceholder'
import { DarkBand } from '../DarkBand'
import { AnchorHeader, BlueGrid, ModuleCaption } from './primitives'

/**
 * Section 03 — Design Systems & Implementation work modules.
 *
 * - Component libraries (scale) — light grid.
 * - DARK band: the "system at scale" + design↔code + data-viz spotlight, the
 *   cinematic, technical peak (the enterprise/B2B proof).
 */
export function DesignSystemsModules() {
  return (
    <div className="space-y-16 md:space-y-20">
      {/* ── Component libraries (scale) ─────────────────────── */}
      <div>
        <AnchorHeader
          kicker="Scale"
          title="Component libraries, by the thousand"
          blurb="Tokenized libraries built per product — buttons, fields, cells, nav, modals — kept consistent across every surface. The Raising Cane’s system alone runs 447 components; Baserate’s is the system behind the investor platform."
        />
        <BlueGrid
          cols={4}
          ratio="square"
          items={[
            'Atoms — buttons, fields',
            'Molecules — cells, cards',
            'Navigation — bars, tabs',
            'Modals & overlays',
            'Forms & inputs',
            'Tags & pills',
            'Data tables',
            'Icon set (24/32px)',
          ]}
        />
        <ModuleCaption>Component sheet (FPO) — real library captures drop in here.</ModuleCaption>
      </div>

      {/* ── DARK band: scale + design↔code + data-viz ───────── */}
      <DarkBand
        eyebrow="The system at scale"
        title="Tokens, handoff, and dense data"
        blurb="Decisions as tokens — change once, propagate everywhere. The component paired with the code that builds it. And the data-viz patterns behind analytics and investor dashboards."
      >
        {/* tokens + scale timeline */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <BluePlaceholder ratio="portrait" dark label="Token → component wiring (FPO)" />
            <ModuleCaption dark>Color · type · spacing as tokens — no visual drift.</ModuleCaption>
          </div>
          <div className="md:col-span-7">
            <BluePlaceholder ratio="wide" dark label="Scalability timeline — receding screens (FPO)" />
            <ModuleCaption dark>One system holds across many screens.</ModuleCaption>
          </div>
        </div>

        {/* design ↔ code */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <Reveal>
            <BluePlaceholder ratio="video" dark label="Live UI component (FPO)" />
          </Reveal>
          <Reveal delay={80}>
            <BluePlaceholder ratio="video" dark label="The code behind it (FPO)" />
          </Reveal>
        </div>
        <ModuleCaption dark>Design ↔ code — built so engineers extend the system without me.</ModuleCaption>

        {/* data-viz spotlight */}
        <div className="mt-12 border-t border-white/10 pt-12">
          <AnchorHeader
            dark
            kicker="Data-viz · the differentiator"
            title="Dense analytics, made legible"
            role="Mindbody · Baserate"
            blurb="Reporting and investor dashboards with documented data-viz pattern sets — an executive summary paired with a granular analyst view."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7">
              <BluePlaceholder ratio="wide" dark label="Baserate — investor dashboard, hero chart (FPO)" />
            </div>
            <div className="md:col-span-5">
              <BluePlaceholder ratio="wide" dark label="Mindbody — analytics, zoomed out (FPO)" />
            </div>
          </div>
        </div>
      </DarkBand>
    </div>
  )
}
