import { OverviewSection } from './OverviewSection'
import { ChallengeSection } from './ChallengeSection'
import { ReleasesSection } from './ReleasesSection'
import { MvpFlowSection } from './MvpFlowSection'
import { MvpScatterSection } from './MvpScatterSection'
import { MvpLaunchBento } from './MvpLaunchBento'
import { PremiumRewardsSection } from './PremiumRewardsSection'
import { LoyaltyQrSection } from './LoyaltyQrSection'
import { OutcomesSection } from './OutcomesSection'
import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'

/** The 5 major sections — ids live on each section's root element. */
const NAV_ITEMS: SectionNavItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'challenge', title: 'The Challenge' },
  { id: 'releases', title: 'The Two Releases' },
  { id: 'mvp', title: 'MVP Fast-Launch' },
  { id: 'premium-rewards', title: 'Premium Rewards' },
  { id: 'loyalty-qr', title: 'Loyalty QR' },
  { id: 'outcomes', title: 'Outcomes' },
]

export interface PandaCaseStudyProps {
  /** Overview overrides */
  dateRange?: string
  lead?: string
  role?: string
  scope?: { label: string }[]
  /** Section intros */
  challengeIntro?: string
  releasesIntro?: string
  mvpIntro?: string
  premiumRewardsIntro?: string
  loyaltyQrIntro?: string
  outcomesIntro?: string
}

/**
 * Panda Express case study:
 * Overview · The Challenge · The Two Releases · MVP Fast-Launch · Outcomes.
 * Section 4 (MVP Fast-Launch) leads with the interactive Core UX flow, with the
 * Component Libraries panel nested below the chart; the device-scatter band
 * follows it, continuing the 2020-Pivot showcase.
 * Reuses the br-* editorial system (container metrics, type, neutrals) from
 * the Baserate build, with the accent swapped to Panda red via --px-red.
 */
export function PandaCaseStudy(props: PandaCaseStudyProps = {}) {
  return (
    <article
      className="br-article bg-white"
      style={{ '--px-red': '#D02B2E' } as React.CSSProperties}
    >
      {/* Floating numbered rail — scroll-spy + jump-to-section (≥1280px only). */}
      <SectionNav items={NAV_ITEMS} />
      <OverviewSection
        dateRange={props.dateRange}
        lead={props.lead}
        role={props.role}
        scope={props.scope?.length ? props.scope.map((s) => s.label) : undefined}
      />
      <ChallengeSection intro={props.challengeIntro} />
      <ReleasesSection intro={props.releasesIntro} />
      <MvpFlowSection intro={props.mvpIntro} />
      <MvpScatterSection />
      {/* Closing module of the MVP group — fast launch + cross-platform.
          Sits AFTER the Seamless Reordering scatter band (its own red band),
          as the last section before Outcomes. */}
      <MvpLaunchBento />
      {/* Opens the rewards chapter — full-bleed red hero with the scaled-up
          two-phone mockup + animated gold sparkles/fireworks. */}
      <PremiumRewardsSection intro={props.premiumRewardsIntro} />
      {/* Loyalty QR enrollment — red "blueprint" band: the branching receipt-QR
          userflow + the Cache→Azure→mParticle→Punchh backend handoff. Verified
          against the Figma prototype graph (REST API). */}
      <LoyaltyQrSection intro={props.loyaltyQrIntro} />
      <OutcomesSection intro={props.outcomesIntro} />
    </article>
  )
}
