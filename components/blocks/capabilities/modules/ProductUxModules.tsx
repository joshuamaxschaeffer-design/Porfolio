'use client'

import { Reveal } from '../../../animation/Reveal'
import { PerspectiveDeviceGrid } from '../../shared/PerspectiveDeviceGrid'
import { ImageCompareSlider } from '../../shared/ImageCompareSlider'
import { BluePlaceholder } from '../BluePlaceholder'
import { AnchorHeader, BlueRail, BlueFlowRow, ModuleCaption } from './primitives'

/** FPO accent for the bluescale pass (recede glow on the perspective grid). */
const BLUE = '#3f66b5'

/**
 * Section 01 — Product & UX work modules (bluescale FPO, real layouts).
 *
 * Anchor A: Mindbody (B2B) — perspective device grid + a before/after slider.
 * Anchor B: Raising Cane's (consumer) — order→scan→reward flow row.
 * Breadth rail: the other product brands as a draggable-style rail of screens.
 */
export function ProductUxModules() {
  return (
    <div className="space-y-20 md:space-y-28">
      {/* ── Anchor A — Mindbody (B2B depth) ─────────────────── */}
      <div>
        <AnchorHeader
          kicker="Anchor · B2B"
          title="Mindbody"
          role="UI/IXD + Design-Systems Lead"
          blurb="The point-of-sale, payments, checkout, refunds, and reconciliation behind a wellness platform — dense workflows that can’t break the power user behind the counter."
        />
        <Reveal>
          <PerspectiveDeviceGrid accent={BLUE} cols={4} rows={2} caption="Mindbody — POS / retail screens (FPO)" />
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <Reveal>
            <ImageCompareSlider
              before={<BluePlaceholder ratio="wide" rounded={false} label="Original retail checkout (before)" />}
              after={<BluePlaceholder ratio="wide" rounded={false} label="Redesigned checkout (after)" />}
              beforeLabel="Before"
              afterLabel="After"
              ratio="16/9"
            />
            <ModuleCaption>Before / after — the retail checkout redesign.</ModuleCaption>
          </Reveal>
          <Reveal delay={80}>
            <BluePlaceholder ratio="wide" label="Analytics dashboard — data-viz (FPO)" />
            <ModuleCaption>Reporting & analytics — dense data made legible.</ModuleCaption>
          </Reveal>
        </div>
      </div>

      {/* ── Anchor B — Raising Cane's (consumer richness) ───── */}
      <div>
        <AnchorHeader
          kicker="Anchor · Consumer"
          title="Raising Cane’s"
          role="Lead Designer → Art Director"
          blurb="The full “Caniac” ordering product — web and native — from onboarding through scan-to-earn loyalty and group ordering."
        />
        <BlueFlowRow
          steps={[
            'Onboarding',
            'Find a location',
            'Build the order',
            'Customize (PDP)',
            'Scan / Caniac Club',
            'Reward → checkout',
          ]}
          caption="Order → scan → reward — the core flow (FPO)"
        />
      </div>

      {/* ── Breadth rail — the rest of the product work ─────── */}
      <div>
        <AnchorHeader
          kicker="Breadth"
          title="A dozen more products, four form factors"
          blurb="Beyond the anchors: consumer apps, an investor platform, kiosks, POS, and ordering web across the rest of the roster — including the flagship case-study products."
        />
        <BlueRail
          items={[
            'Panda Express — app',
            'Baserate — investor platform',
            'Wingstop — ordering app + web',
            'CBTL — iOS app',
            'Dave & Buster’s — kiosk',
            'Dave & Buster’s — mobile',
            'True Food Kitchen — web',
            'VF Corp — Work Authority LMS',
            'Blaze — consumer app',
            'Blaze — budtender POS',
            'Trees / Ipse — app',
            'Noodles & Co. — ordering',
          ]}
          ratio="phone"
        />
      </div>
    </div>
  )
}
