'use client'

import { Reveal } from '../../../animation/Reveal'
import { PerspectiveDeviceGrid } from '../../shared/PerspectiveDeviceGrid'
import { ImageCompareSlider } from '../../shared/ImageCompareSlider'
import { BluePlaceholder } from '../BluePlaceholder'
import { AnchorHeader, BlueRail, BlueFlowRow, ModuleCaption } from './primitives'

const BLUE = '#5b7fc7'

/** Section 01 — Product & UX work modules (grey section, light tone). */
export function ProductUxModules({ dark = false }: { dark?: boolean }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Anchor A — Mindbody (B2B) */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · B2B"
          title="Mindbody — the system behind the counter"
          role="UI/IXD + Design-Systems Lead"
          blurb="Point-of-sale, payments, checkout, refunds, and reconciliation for a wellness platform — dense workflows that can’t break the power user."
        />
        <Reveal>
          <PerspectiveDeviceGrid accent={BLUE} cols={4} rows={2} caption="Mindbody — POS / retail screens (FPO)" />
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <Reveal>
            <ImageCompareSlider
              before={<BluePlaceholder ratio="wide" rounded={false} dark={dark} label="Original retail checkout" />}
              after={<BluePlaceholder ratio="wide" rounded={false} dark={dark} label="Redesigned checkout" />}
              beforeLabel="Before"
              afterLabel="After"
              ratio="16/9"
            />
            <ModuleCaption dark={dark}>Drag the handle — the retail checkout redesign.</ModuleCaption>
          </Reveal>
          <Reveal delay={80}>
            <BluePlaceholder ratio="wide" dark={dark} label="Analytics dashboard — data-viz (FPO)" />
            <ModuleCaption dark={dark}>Reporting & analytics — dense data, made legible.</ModuleCaption>
          </Reveal>
        </div>
      </div>

      {/* Anchor B — Raising Cane's flow */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · Consumer"
          title="Raising Cane’s"
          role="Lead Designer → Art Director"
          blurb="The full “Caniac” ordering product — web and native — from onboarding through scan-to-earn loyalty and group ordering."
        />
        <BlueFlowRow
          dark={dark}
          steps={['Onboarding', 'Find a location', 'Build the order', 'Customize (PDP)', 'Scan / Caniac Club', 'Reward → checkout']}
          caption="Order → scan → reward — the core flow (FPO)"
        />
      </div>

      {/* Breadth rail — full width */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Breadth"
          title="A dozen more products, four form factors"
          blurb="Beyond the anchors: consumer apps, an investor platform, kiosks, POS, and ordering web across the rest of the roster — including the flagship case-study products."
        />
        <BlueRail
          dark={dark}
          fullBleed
          ratio="phone"
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
        />
      </div>
    </div>
  )
}
