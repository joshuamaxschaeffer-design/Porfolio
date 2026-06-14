import { OverviewSection } from './OverviewSection'
import { ChallengeSection } from './ChallengeSection'
import { RedesignSection } from './RedesignSection'
import { OutcomesSection } from './OutcomesSection'
import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'
import { CaseStudyShowcase } from '../shared/CaseStudyShowcase'

/** The 4 major sections — ids live on each section's root element. */
const NAV_ITEMS: SectionNavItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'challenge', title: 'The Challenge' },
  { id: 'redesign', title: 'The Flavor-First Redesign' },
  { id: 'outcomes', title: 'Outcomes' },
]

export interface WingstopCaseStudyProps {
  /** Overview overrides */
  dateRange?: string
  lead?: string
  role?: string
  scope?: { label: string }[]
  /** Section intros */
  challengeIntro?: string
  redesignIntro?: string
  outcomesIntro?: string
}

/**
 * Wingstop case study — lean 4-section layout (per Joshua, 2026-06-10):
 * Overview · The Challenge · The Flavor-First Redesign · Outcomes (fully
 * built). Reuses the br-* editorial system with the accent swapped to
 * Wingstop green via --ws-green. Narrative: shipped 2019, a year before
 * COVID, then carried the business when dining rooms closed.
 */
export function WingstopCaseStudy(props: WingstopCaseStudyProps = {}) {
  return (
    <article
      className="br-article bg-white"
      style={{ '--ws-green': '#00843D' } as React.CSSProperties}
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
      <RedesignSection intro={props.redesignIntro} />
      <OutcomesSection intro={props.outcomesIntro} />
      <CaseStudyShowcase accent="#00843D" current="wingstop" />
    </article>
  )
}
