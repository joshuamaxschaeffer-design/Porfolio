import { OverviewSection } from './OverviewSection'
import { ChallengeSection } from './ChallengeSection'
import { ArchitectureSection } from './ArchitectureSection'
import { ProductSystemSection } from './ProductSystemSection'
import { FeatureEcosystemSection } from './FeatureEcosystemSection'
import { DesignSystemsSection } from './DesignSystemsSection'
import { BrandingSection } from './branding/BrandingSection'
import { OutcomesSection } from './OutcomesSection'
import { SectionNav, type SectionNavItem } from './SectionNav'

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
 */
export function BaserateCaseStudy(props: BaserateCaseStudyProps = {}) {
  return (
    <article className="br-article bg-white">
      {/* Floating numbered rail — scroll-spy + jump-to-section (≥1920px only). */}
      <SectionNav items={NAV_ITEMS} />
      <OverviewSection
        dateRange={props.dateRange}
        lead={props.lead}
        role={props.role}
        scope={props.scope?.length ? props.scope.map((s) => s.label) : undefined}
      />
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
    </article>
  )
}
