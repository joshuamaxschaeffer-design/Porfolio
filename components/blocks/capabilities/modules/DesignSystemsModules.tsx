'use client'

import { Reveal } from '../../../animation/Reveal'
import { BluePlaceholder } from '../BluePlaceholder'
import { AnchorHeader, BlueGrid, ModuleCaption } from './primitives'

/**
 * Section 03 — Design Systems & Implementation work modules (bluescale FPO).
 *
 * - Scale-as-wow: a component-library grid + a "by the numbers" line.
 * - Design ↔ code: side-by-side UI and the code that builds it (handoff).
 * - Data-viz spotlight (the differentiator): hero chart → zoomed dashboard →
 *   outcome, all FPO for now.
 *
 * (Real build swaps in the live component sheets + the 3D ScalabilityTimeline +
 * the hover-swap CodeBox.)
 */
export function DesignSystemsModules() {
  return (
    <div className="space-y-20 md:space-y-28">
      {/* ── Component libraries (scale) ─────────────────────── */}
      <div>
        <AnchorHeader
          kicker="Scale"
          title="Component libraries, by the thousand"
          blurb="Tokenized libraries built per product — buttons, fields, cells, nav, modals — kept consistent across every surface. The Raising Cane’s system alone runs 447 components."
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

      {/* ── Tokens + scale timeline ─────────────────────────── */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <AnchorHeader kicker="Tokens" title="Decisions, not values" blurb="Color, type, and spacing as tokens — change once, propagate everywhere. No visual drift." />
          <BluePlaceholder ratio="portrait" label="Token → component wiring (FPO)" />
        </div>
        <div className="md:col-span-7">
          <AnchorHeader kicker="Scale" title="One system, many screens" blurb="The receding “zoom-out” of screens that proves a system holds at scale." />
          <BluePlaceholder ratio="wide" label="Scalability timeline — receding screens (FPO)" />
          <ModuleCaption>Real build = the 3D ScalabilityTimeline component.</ModuleCaption>
        </div>
      </div>

      {/* ── Design ↔ code (handoff) ─────────────────────────── */}
      <div>
        <AnchorHeader
          kicker="Implementation"
          title="Design ↔ code handoff"
          blurb="The component on the left; the code that builds it on the right. Built so engineers can extend the system without me in the room."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <Reveal>
            <BluePlaceholder ratio="video" label="Live UI component (FPO)" />
          </Reveal>
          <Reveal delay={80}>
            <BluePlaceholder ratio="video" label="The code behind it (FPO)" />
          </Reveal>
        </div>
        <ModuleCaption>Real build = hover-swap CodeBox pairing UI with its source.</ModuleCaption>
      </div>

      {/* ── Data-viz spotlight (differentiator) ─────────────── */}
      <div>
        <AnchorHeader
          kicker="Data-viz · the differentiator"
          title="Dense analytics, made legible"
          role="Mindbody — UI/IXD + Design-Systems Lead"
          blurb="A reporting system with a documented data-viz pattern set — an executive summary view paired with a granular analyst view."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <BluePlaceholder ratio="wide" label="Hero chart — the single insight (FPO)" />
          </div>
          <div className="md:col-span-5">
            <BluePlaceholder ratio="wide" label="Full dashboard — zoomed out (FPO)" />
          </div>
        </div>
        <ModuleCaption>Lead with one beautiful chart, then the full dashboard + the outcome.</ModuleCaption>
      </div>
    </div>
  )
}
