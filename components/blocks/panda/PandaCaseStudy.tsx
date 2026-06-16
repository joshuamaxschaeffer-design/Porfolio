import { OverviewSection } from './OverviewSection'
import { ChallengeSection } from './ChallengeSection'
import { ReleasesSection } from './ReleasesSection'
import { MvpFlowSection } from './MvpFlowSection'
import { MvpScatterSection } from './MvpScatterSection'
import { OutcomesSection } from './OutcomesSection'
import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'
import { CaseStudyShowcase } from '../shared/CaseStudyShowcase'

/** The 5 major sections — ids live on each section's root element. */
const NAV_ITEMS: SectionNavItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'challenge', title: 'The Challenge' },
  { id: 'releases', title: 'The Two Releases' },
  { id: 'mvp', title: 'MVP Fast-Launch' },
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
  outcomesIntro?: string
}

/**
 * Panda Express case study:
 * Overview · The Challenge · The Two Releases · MVP Fast-Launch · Outcomes.
 * Section 4 (MVP Fast-Launch) leads with the interactive Core UX flow, followed
 * by the device-scatter band that continues the 2020-Pivot showcase.
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
      <OutcomesSection intro={props.outcomesIntro} />
      <CaseStudyShowcase accent="#D02B2E" current="panda-express" />
    </article>
  )
}
