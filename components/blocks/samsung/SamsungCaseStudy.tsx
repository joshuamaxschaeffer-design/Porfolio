import { OverviewSection } from './OverviewSection'
import { BriefSection } from './BriefSection'
import { WorkSection } from './WorkSection'
import { OutcomesSection } from './OutcomesSection'
import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'

const NAV_ITEMS: SectionNavItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'brief', title: 'The Brief' },
  { id: 'work', title: 'The Work' },
  { id: 'outcomes', title: 'Outcomes' },
]

export interface SamsungCaseStudyProps {
  dateRange?: string
  lead?: string
  role?: string
  scope?: { label: string }[]
  briefIntro?: string
  workIntro?: string
  outcomesIntro?: string
}

/**
 * Samsung case study — DARK / CINEMATIC rebuild (per Joshua, 2026-06-19),
 * modelled on his original Behance comp: a charcoal page, the real white
 * Samsung wordmark up top, skewed/perspective device mockups, diagonal
 * compositions, and the multi-color blurred gradient wash behind the product
 * work. Joshua's FIRST design job (Razorfish/Rosetta, Samsung Mobile, 2013–16),
 * framed honestly as a learning experience — outcomes not exaggerated.
 *
 * The whole article is dark-themed via scoped `--sg-*` tokens that ALSO
 * override the inherited `br-*` editorial vars, so shared bits (SectionNav,
 * tag pills) pick up the dark palette automatically.
 */
export function SamsungCaseStudy(props: SamsungCaseStudyProps = {}) {
  return (
    <article
      className="sg-dark relative"
      style={
        {
          // dark palette
          '--sg-bg': '#202328',
          '--sg-bg-2': '#1a1d22',
          '--sg-ink': '#f5f6f8',
          '--sg-muted': '#aeb3bd',
          '--sg-muted-2': '#7c828d',
          '--sg-line': 'rgba(255,255,255,0.12)',
          '--sg-blue': '#2f9be0',
          // override inherited br-* so SectionNav + shared chrome go dark
          '--br-ink': '#f5f6f8',
          '--br-body': '#cdd1d9',
          '--br-muted': '#aeb3bd',
          '--br-muted-2': '#7c828d',
          '--br-line': 'rgba(255,255,255,0.12)',
          '--br-bg-2': '#1a1d22',
          backgroundColor: 'var(--sg-bg)',
          color: 'var(--sg-ink)',
        } as React.CSSProperties
      }
    >
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
    </article>
  )
}
