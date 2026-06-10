import { OverviewSection } from './OverviewSection'
import { ChallengeSection } from './ChallengeSection'
import { ReleasesSection } from './ReleasesSection'
import { OutcomesSection } from './OutcomesSection'

export interface PandaCaseStudyProps {
  /** Overview overrides */
  dateRange?: string
  lead?: string
  role?: string
  scope?: { label: string }[]
  /** Section intros */
  challengeIntro?: string
  releasesIntro?: string
  outcomesIntro?: string
}

/**
 * Panda Express case study — lean 4-section layout (per Joshua, 2026-06-10):
 * Overview · The Challenge · The Two Releases · Outcomes (fully built).
 * Reuses the br-* editorial system (container metrics, type, neutrals) from
 * the Baserate build, with the accent swapped to Panda red via --px-red.
 */
export function PandaCaseStudy(props: PandaCaseStudyProps = {}) {
  return (
    <article
      className="br-article bg-white"
      style={{ '--px-red': '#D02B2E' } as React.CSSProperties}
    >
      <OverviewSection
        dateRange={props.dateRange}
        lead={props.lead}
        role={props.role}
        scope={props.scope?.length ? props.scope.map((s) => s.label) : undefined}
      />
      <ChallengeSection intro={props.challengeIntro} />
      <ReleasesSection intro={props.releasesIntro} />
      <OutcomesSection intro={props.outcomesIntro} />
    </article>
  )
}
