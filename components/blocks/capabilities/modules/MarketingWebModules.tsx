'use client'

import { Reveal } from '../../../animation/Reveal'
import { BluePlaceholder } from '../BluePlaceholder'
import { AnchorHeader, BlueGrid, ModuleCaption } from './primitives'

/** A desktop frame with a phone overlapping its bottom-right — responsive pair. */
function ResponsivePair({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <Reveal>
      <div className="relative pb-10 pr-10 md:pb-12 md:pr-12">
        <BluePlaceholder ratio="wide" dark={dark} label={`${label} — desktop (FPO)`} />
        <div className="absolute bottom-0 right-0 w-[28%] max-w-[150px]">
          <BluePlaceholder ratio="phone" dark={dark} label="mobile" />
        </div>
      </div>
    </Reveal>
  )
}

/** Section 05 — Marketing & Web (BLACK section, dark tone). */
export function MarketingWebModules({ dark = true }: { dark?: boolean }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Responsive pairings */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · Web"
          title="The whole journey, every screen size"
          role="True Food Kitchen — Lead · Blaze — Sole/Lead"
          blurb="Launch and ordering sites designed desktop-down-to-mobile. True Food Kitchen drove 30%+ of off-premise sales through online ordering within a quarter of launch."
        />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          <ResponsivePair dark={dark} label="True Food Kitchen — ordering web" />
          <ResponsivePair dark={dark} label="Blaze — marketing site" />
        </div>
      </div>

      {/* Perspective deck */}
      <div>
        <AnchorHeader dark={dark} kicker="Web · at length" title="Full-page, art-directed" blurb="Full website captures laid on a receding plane — the way to say “I designed the whole page,” not just a hero." />
        <BluePlaceholder ratio="ultrawide" dark={dark} label="Perspective deck — tilted full-page captures (FPO)" />
      </div>

      {/* More web */}
      <div>
        <AnchorHeader dark={dark} kicker="Breadth" title="More launch & product web" blurb="Across QSR, enterprise, and consumer brands." />
        <BlueGrid
          dark={dark}
          cols={3}
          ratio="wide"
          items={['Wingstop — ordering web', 'Panda — marketing site', 'Samsung — enterprise web', 'Chandon — IG Shopping / PDP', 'Pepsi — e-comm / AR', 'PetSmart — brand / campaign', 'KFC — promo pitch']}
        />
      </div>

      {/* CRM / lifecycle */}
      <div>
        <AnchorHeader dark={dark} kicker="Lifecycle · CRM" title="Retention, not one-off mailers" blurb="A full email & lifecycle program for Dairy Queen — monthly campaigns and animated mailers — plus Pepsi email creative." />
        <BlueGrid
          dark={dark}
          cols={4}
          ratio="tall"
          items={['DQ — December mailer', 'DQ — January (animated)', 'DQ — April mailer', 'Pepsi — email']}
        />
        <ModuleCaption dark={dark}>Lifecycle creative — a real program, not one-offs.</ModuleCaption>
      </div>
    </div>
  )
}
