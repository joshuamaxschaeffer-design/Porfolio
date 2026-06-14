import { cookies } from 'next/headers'
import { OverviewSection } from './OverviewSection'
import { ChallengeSection } from './ChallengeSection'
import { ChallengeLockedGate } from './ChallengeLockedGate'
import { ArchitectureSection } from './ArchitectureSection'
import { ProductSystemSection } from './ProductSystemSection'
import { FeatureEcosystemSection } from './FeatureEcosystemSection'
import { DesignSystemsSection } from './DesignSystemsSection'
import { BrandingSection } from './branding/BrandingSection'
import { OutcomesSection } from './OutcomesSection'
import { SectionNav, type SectionNavItem } from './SectionNav'
import { BASERATE_UNLOCK_COOKIE, BASERATE_UNLOCK_VALUE } from '@/lib/baserateGate'

/** The 7 major sections — ids live on each section's root element below. */
const NAV_ITEMS: SectionNavItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'challenge', title: 'The Challenge' },
  { id: 'architecture', title: 'Product Architecture & Strategy' },
  { id: 'product-system', title: 'Building the Product System' },
  { id: 'design-systems', title: 'Design Systems & Implementation' },
  { id: 'branding', title: 'Brand & Marketing' },
  { id: 'outcomes', title: 'Outcomes' },
]

// Everything from "The Challenge" (index 1) down is gated behind the NDA lock.
const LOCKED_FROM = 1

export interface BaserateCaseStudyProps {
  /** Overview overrides */
  dateRange?: string
  lead?: string
  role?: string
  scope?: { label: string }[]
  /** Challenge overrides */
  challengeHeading?: string
  challengeIntro?: string
  /** Section intros */
  architectureIntro?: string
  productSystemIntro?: string
}

/**
 * The full Baserate case study, assembled from its section components.
 * Copy can be overridden via props (from the Payload CMS); anything omitted
 * falls back to the Figma-sourced defaults baked into each section.
 *
 * NDA gate: everything below the Overview is locked until the viewer enters the
 * password. The check is server-side — we read an httpOnly cookie set by the
 * /api/baserate-unlock route. Reading the cookie opts this page into dynamic
 * rendering (intended), so a locked visitor never receives the gated markup at
 * all; it isn't merely hidden with CSS.
 */
export async function BaserateCaseStudy(props: BaserateCaseStudyProps = {}) {
  const cookieStore = await cookies()
  const unlocked = cookieStore.get(BASERATE_UNLOCK_COOKIE)?.value === BASERATE_UNLOCK_VALUE

  return (
    <article className="br-article bg-white">
      {/* Floating numbered rail — scroll-spy + jump-to-section (≥1280px only).
          While locked, stops 2–7 show a padlock instead of a number. */}
      <SectionNav items={NAV_ITEMS} lockedFrom={unlocked ? null : LOCKED_FROM} />
      <OverviewSection
        dateRange={props.dateRange}
        lead={props.lead}
        role={props.role}
        scope={props.scope?.length ? props.scope.map((s) => s.label) : undefined}
      />

      {unlocked ? (
        <>
          <ChallengeSection heading={props.challengeHeading} intro={props.challengeIntro} />
          <ArchitectureSection intro={props.architectureIntro} />
          {/* "Building the Product System" is one continuous grey (#F8F8FB) region:
              the product stage AND all the auto-scrolling feature carousels/columns
              share the same background. */}
          <div id="product-system" className="bg-[var(--br-bg-2)]">
            <ProductSystemSection intro={props.productSystemIntro} />
            <FeatureEcosystemSection />
          </div>
          {/* Dark closing coda — bleeds edge to edge, so no article bottom padding. */}
          <DesignSystemsSection />
          {/* Branding & Marketing — devices, brand showcases, B2B exploration, MCP video. */}
          <BrandingSection />
          {/* Outcomes — count-up stat grid, testimonials, trusted-by logos. */}
          <OutcomesSection />
        </>
      ) : (
        // Locked: the only thing past the Overview is the NDA gate (800px band).
        // The gated sections are not rendered at all for a locked visitor.
        <ChallengeLockedGate heading={props.challengeHeading} intro={props.challengeIntro} />
      )}
    </article>
  )
}
