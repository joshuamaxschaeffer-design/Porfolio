import { OverviewSection } from './OverviewSection'
import { ScopeCarouselSection } from './ScopeCarouselSection'
import { OutcomesSection } from './OutcomesSection'
import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'
import { MagneticCTA } from '../shared/MagneticCTA'
import { cta } from './data'

/**
 * Wingstop case study — REBUILD in progress (2026-06-19, per the verbatim spec
 * "Wingstop Instructions (VERBATIM).md"). Being rebuilt section by section:
 *   1 Overview · 2 Scope carousel (draggable, jump-pills) · … · Outcomes ·
 *   App Store release.
 * Sections 2–8 (Wingstop App / CRM / Flavor Pages / Branding / In-Store /
 * UI-UX / Web Needs) land incrementally. Outcomes + a closing CTA bookend for
 * now so the page is always shippable.
 */

const NAV_ITEMS: SectionNavItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'scope', title: 'Scope' },
  { id: 'outcomes', title: 'Outcomes' },
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
      <OutcomesSection intro={props.outcomesIntro} />
      <MagneticCTA
        eyebrow={cta.eyebrow}
        headline={cta.headline}
        ctaLabel={cta.ctaLabel}
        ctaHref={cta.ctaHref}
        links={cta.links}
        tone="ink"
      />
    </article>
  )
}
