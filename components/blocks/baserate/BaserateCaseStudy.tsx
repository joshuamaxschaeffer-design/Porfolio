import { OverviewSection } from './OverviewSection'
import { ChallengeSection } from './ChallengeSection'
import { ArchitectureSection } from './ArchitectureSection'
import { ProductSystemSection } from './ProductSystemSection'
import { FeatureEcosystemSection } from './FeatureEcosystemSection'

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
    <article className="br-article bg-white pb-32">
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
      <div className="bg-[var(--br-bg-2)]">
        <ProductSystemSection intro={props.productSystemIntro} />
        <FeatureEcosystemSection />
      </div>
    </article>
  )
}
