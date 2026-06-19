import { OverviewSection } from './OverviewSection'
import { ScopeCarouselSection } from './ScopeCarouselSection'
import { AppSection } from './AppSection'
import { CrmSection } from './CrmSection'
import { FlavorPagesSection } from './FlavorPagesSection'
import { BrandingSection } from './BrandingSection'
import { InStoreSection } from './InStoreSection'
import { UiUxSection } from './UiUxSection'
import { WebNeedsSection } from './WebNeedsSection'
import { OutcomesSection } from './OutcomesSection'
import { AppStoreSection } from './AppStoreSection'
import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'

/**
 * Wingstop case study — full REBUILD per the verbatim spec
 * ("Wingstop Instructions (VERBATIM).md", 2026-06-19). Section order:
 *   Overview · 1 Scope · 2 Wingstop App (green) · 3 CRM · 4 Flavor Pages
 *   (black) · 5 Branding · 6 In-Store · 7 UI/UX Updates · 8 Additional Web ·
 *   9 Outcomes · 10 App Store release.
 */

const NAV_ITEMS: SectionNavItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'scope', title: 'Scope' },
  { id: 'app', title: 'Wingstop App' },
  { id: 'crm', title: 'CRM' },
  { id: 'flavor-pages', title: 'Flavor Pages' },
  { id: 'branding', title: 'Branding' },
  { id: 'in-store', title: 'In-Store' },
  { id: 'ui-ux', title: 'UI/UX Updates' },
  { id: 'web-needs', title: 'Additional Web' },
  { id: 'outcomes', title: 'Outcomes' },
  { id: 'app-store', title: 'App Store' },
]

export interface WingstopCaseStudyProps {
  dateRange?: string
  lead?: string
  role?: string
  scope?: { label: string }[]
  challengeIntro?: string
  redesignIntro?: string
  outcomesIntro?: string
}

export function WingstopCaseStudy(props: WingstopCaseStudyProps = {}) {
  return (
    <article
      className="br-article bg-white"
      style={{ '--ws-green': '#00843D' } as React.CSSProperties}
    >
      <SectionNav items={NAV_ITEMS} />
      <OverviewSection
        dateRange={props.dateRange}
        lead={props.lead}
        role={props.role}
        scope={props.scope?.length ? props.scope.map((s) => s.label) : undefined}
      />
      <ScopeCarouselSection />
      <AppSection />
      <CrmSection />
      <FlavorPagesSection />
      <BrandingSection />
      <InStoreSection />
      <UiUxSection />
      <WebNeedsSection />
      <OutcomesSection intro={props.outcomesIntro} />
      <AppStoreSection />
    </article>
  )
}
