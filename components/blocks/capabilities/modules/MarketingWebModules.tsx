'use client'

import { Reveal } from '../../../animation/Reveal'
import { BluePlaceholder } from '../BluePlaceholder'
import { AnchorHeader, BlueGrid, ModuleCaption } from './primitives'

/**
 * Section 05 — Marketing & Web work modules (bluescale FPO).
 *
 * - Desktop + mobile responsive pairings (the convention: wide desktop frame
 *   with the mobile screen overlapping a corner) — proves responsive range.
 * - The tilted full-page "perspective deck" (Joshua's own technique) for the
 *   anchor sites.
 * - CRM / lifecycle sub-row (Dairy Queen mailer program, Pepsi email).
 */

/** A desktop frame with a phone overlapping its bottom-right — responsive pair. */
function ResponsivePair({ label }: { label: string }) {
  return (
    <Reveal>
      <div className="relative pb-10 pr-10 md:pb-12 md:pr-12">
        <BluePlaceholder ratio="wide" label={`${label} — desktop (FPO)`} />
        <div className="absolute bottom-0 right-0 w-[28%] max-w-[150px]">
          <BluePlaceholder ratio="phone" label="mobile" />
        </div>
      </div>
    </Reveal>
  )
}

export function MarketingWebModules() {
  return (
    <div className="space-y-20 md:space-y-28">
      {/* ── Anchor pairings — responsive web ────────────────── */}
      <div>
        <AnchorHeader
          kicker="Anchor · Web"
          title="The whole journey, every screen size"
          role="True Food Kitchen — Lead · Blaze — Sole/Lead"
          blurb="Launch and ordering sites designed desktop-down-to-mobile. True Food Kitchen drove 30%+ of off-premise sales through online ordering within a quarter of launch."
        />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          <ResponsivePair label="True Food Kitchen — ordering web" />
          <ResponsivePair label="Blaze — marketing site" />
        </div>
      </div>

      {/* ── Perspective deck (full-page scroll capture) ─────── */}
      <div>
        <AnchorHeader
          kicker="Web · at length"
          title="Full-page, art-directed"
          blurb="The tilted “perspective deck” of full website captures laid on a receding plane — the way to say “I designed the whole page,” not just a hero."
        />
        <BluePlaceholder ratio="ultrawide" label="Perspective deck — tilted full-page captures (FPO)" />
        <ModuleCaption>Real build = the angled MarketingSection deck on black.</ModuleCaption>
      </div>

      {/* ── More web work ──────────────────────────────────── */}
      <div>
        <AnchorHeader
          kicker="Breadth"
          title="More launch & product web"
          blurb="Across QSR, enterprise, and consumer brands."
        />
        <BlueGrid
          cols={3}
          ratio="wide"
          items={[
            'Wingstop — ordering web',
            'Panda — marketing site',
            'Samsung — enterprise web',
            'Chandon — IG Shopping / PDP',
            'Pepsi — e-comm / AR',
            'PetSmart — brand / campaign',
            'KFC — promo pitch',
          ]}
        />
      </div>

      {/* ── CRM / lifecycle sub-row ─────────────────────────── */}
      <div>
        <AnchorHeader
          kicker="Lifecycle · CRM"
          title="Retention, not one-off mailers"
          blurb="A full email & lifecycle program for Dairy Queen — monthly campaigns and animated mailers — plus Pepsi email creative."
        />
        <BlueGrid
          cols={4}
          ratio="tall"
          items={[
            'DQ — December mailer',
            'DQ — January (animated)',
            'DQ — April mailer',
            'Pepsi — email',
          ]}
        />
      </div>
    </div>
  )
}
