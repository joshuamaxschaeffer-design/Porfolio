'use client'

import { Reveal } from '../../../animation/Reveal'
import { PerspectiveDeviceGrid } from '../../shared/PerspectiveDeviceGrid'
import { ImageCompareSlider } from '../../shared/ImageCompareSlider'
import { BluePlaceholder } from '../BluePlaceholder'
import { DarkBand } from '../DarkBand'
import { AnchorHeader, BlueRail, BlueFlowRow, ModuleCaption } from './primitives'

/** FPO accent for the bluescale pass (recede glow on the perspective grid). */
const BLUE = '#5b7fc7'

/**
 * Section 01 — Product & UX work modules.
 *
 * Anchor A: Mindbody (B2B) — a DARK cinematic band w/ perspective device grid +
 * before/after slider + data-viz. Anchor B: Raising Cane's flow. Breadth rail.
 */
export function ProductUxModules() {
  return (
    <div className="space-y-16 md:space-y-20">
      {/* ── Anchor A — Mindbody (dark cinematic feature band) ── */}
      <DarkBand
        eyebrow="Anchor · B2B"
        title="Mindbody — the system behind the counter"
        blurb="Point-of-sale, payments, checkout, refunds, and reconciliation for a wellness platform — dense workflows that can’t break the power user. UI/IXD + Design-Systems Lead."
      >
        <Reveal>
          <PerspectiveDeviceGrid accent={BLUE} cols={4} rows={2} caption="Mindbody — POS / retail screens (FPO)" />
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <Reveal>
            <ImageCompareSlider
              before={<BluePlaceholder ratio="wide" rounded={false} dark label="Original retail checkout" />}
              after={<BluePlaceholder ratio="wide" rounded={false} dark label="Redesigned checkout" />}
              beforeLabel="Before"
              afterLabel="After"
              ratio="16/9"
            />
            <ModuleCaption dark>Drag the handle — the retail checkout redesign.</ModuleCaption>
          </Reveal>
          <Reveal delay={80}>
            <BluePlaceholder ratio="wide" dark label="Analytics dashboard — data-viz (FPO)" />
            <ModuleCaption dark>Reporting & analytics — dense data, made legible.</ModuleCaption>
          </Reveal>
        </div>
      </DarkBand>

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
