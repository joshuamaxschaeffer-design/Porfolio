import { OverviewSection } from './OverviewSection'
import { BriefSection } from './BriefSection'
import { WorkSection } from './WorkSection'
import { OutcomesSection } from './OutcomesSection'
import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'
import { CaseStudyShowcase } from '../shared/CaseStudyShowcase'

/** The 4 major sections — ids live on each section's root element. */
const NAV_ITEMS: SectionNavItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'brief', title: 'The Brief' },
  { id: 'work', title: 'The Work' },
  { id: 'outcomes', title: 'Outcomes' },
]

export interface SamsungCaseStudyProps {
  /** Overview overrides */
  dateRange?: string
  lead?: string
  role?: string
  scope?: { label: string }[]
  /** Section intros */
  briefIntro?: string
  workIntro?: string
  outcomesIntro?: string
}

/**
 * Samsung case study — lean 4-section layout: Overview · The Brief · The Work ·
 * What I Took Away. Joshua's FIRST design job, at Razorfish on the Samsung
 * Mobile account (2013–17), framed as a learning experience (per Joshua,
 * 2026-06-19 — do NOT exaggerate outcomes). The Work shows the REAL assets at
 * native aspect ratios: product/landing pages, the in-store experience UI he
 * helped build, and a draggable bento carousel of the social mockups (a sample
 * of the hundreds produced). Reuses the br-* editorial system with the accent
 * swapped to Samsung blue via --sg-blue.
 */
export function SamsungCaseStudy(props: SamsungCaseStudyProps = {}) {
  return (
    <article
      className="br-article bg-white"
      style={{ '--sg-blue': '#1428A0' } as React.CSSProperties}
    >
      {/* Floating numbered rail — scroll-spy + jump-to-section (≥1280px only). */}
      <SectionNav items={NAV_ITEMS} />
      <OverviewSection
        dateRange={props.dateRange}
        lead={props.lead}
        role={props.role}
        scope={props.scope?.length ? props.scope.map((s) => s.label) : undefined}
      />
      <BriefSection intro={props.briefIntro} />
      <WorkSection intro={props.workIntro} />
      <OutcomesSection intro={props.outcomesIntro} />
      <CaseStudyShowcase accent="#1428A0" current="samsung" />
    </article>
  )
}
