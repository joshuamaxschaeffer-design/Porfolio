import { OverviewSection } from './OverviewSection'
import { FastFactsSection } from './FastFactsSection'
import { ContextSection } from './ContextSection'
import { OperatingModelSection } from './OperatingModelSection'
import { RebrandSection } from './RebrandSection'
import { ReaderSection } from './ReaderSection'
import { OnboardingSection } from './OnboardingSection'
import { BusinessSection } from './BusinessSection'
import { DeepDiveSection } from './DeepDiveSection'
import { BeyondSection } from './BeyondSection'
import { ShippingSection } from './ShippingSection'
import { OutcomesSection } from './OutcomesSection'
import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'

/**
 * Unfold case study — the end-to-end "designed, built, and shipped it" story.
 * Section order mirrors the structure doc (Dropbox: "Unfold Case Study —
 * Structure (2026-08-10).md"):
 *   Overview · Facts · Context · Operating Model · Rebrand · Reader ·
 *   Onboarding · Business · Deep Dive · Beyond · Shipping · Outcomes.
 *
 * Brand: flat green #349c72 on cream #fff6e8; warm charcoal darks. The site's
 * br-* typography system carries through; --uf-green is the accent var.
 */

const NAV_ITEMS: SectionNavItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'facts', title: 'In Numbers' },
  { id: 'context', title: 'Context' },
  { id: 'model', title: 'Operating Model' },
  { id: 'rebrand', title: 'Rebrand' },
  { id: 'reader', title: 'The Reader' },
  { id: 'onboarding', title: 'Onboarding' },
  { id: 'business', title: 'Business Layer' },
  { id: 'deepdive', title: 'Deep Dive' },
  { id: 'beyond', title: 'Beyond the Core' },
  { id: 'shipping', title: 'Shipping It' },
  { id: 'outcomes', title: 'Outcomes' },
]

export interface UnfoldCaseStudyProps {
  dateRange?: string
  lead?: string
  role?: string
  scope?: { label: string }[]
  contextIntro?: string
  outcomesIntro?: string
}

export function UnfoldCaseStudy(props: UnfoldCaseStudyProps = {}) {
  return (
    <article
      className="br-article bg-[#fff6e8]"
      style={{ '--uf-green': '#349c72', '--uf-cream': '#fff6e8', '--uf-charcoal': '#1c1a17' } as React.CSSProperties}
    >
      <SectionNav items={NAV_ITEMS} />
      <OverviewSection
        dateRange={props.dateRange}
        lead={props.lead}
        role={props.role}
        scope={props.scope?.length ? props.scope.map((s) => s.label) : undefined}
      />
      <FastFactsSection />
      <ContextSection intro={props.contextIntro} />
      <OperatingModelSection />
      <RebrandSection />
      <ReaderSection />
      <OnboardingSection />
      <BusinessSection />
      <DeepDiveSection />
      <BeyondSection />
      <ShippingSection />
      <OutcomesSection intro={props.outcomesIntro} />
    </article>
  )
}
