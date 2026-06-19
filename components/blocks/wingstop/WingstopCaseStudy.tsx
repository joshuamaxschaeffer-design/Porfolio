import { OverviewSection } from './OverviewSection'
import { AppFoundationSection } from './AppFoundationSection'
import { ChallengeSection } from './ChallengeSection'
import { FlavorWorldSection } from './FlavorWorldSection'
import { UsabilitySection } from './UsabilitySection'
import { CraftSection } from './CraftSection'
import { MoreWorkSection } from './MoreWorkSection'
import { CovidSection } from './CovidSection'
import { OutcomesSection } from './OutcomesSection'
import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'
import { MagneticCTA } from '../shared/MagneticCTA'
import { cta } from './data'

/** The 9 narrative sections — ids live on each section's root element. */
const NAV_ITEMS: SectionNavItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'app-foundation', title: 'The Full App' },
  { id: 'challenge', title: 'The Challenge' },
  { id: 'flavor-world', title: 'Flavor World' },
  { id: 'usability', title: 'Improved Usability' },
  { id: 'craft', title: 'Range of Craft' },
  { id: 'more-work', title: 'More Work' },
  { id: 'covid', title: 'The Payoff' },
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
 * Wingstop case study — full build (2026-06-19). Joshua led the UX/UI and art
 * direction end to end and mentored the team that scaled it across platforms,
 * campaigns and in-store screens. Bold/cinematic background rhythm cycles
 * BLACK · WHITE · GREEN · LIGHT-GREY (no two adjacent the same):
 *   1 Overview (black) · 2 Full App (white) · 3 Challenge (green) ·
 *   4 Flavor World (black) · 5 Improved Usability (grey) · 6 Range of Craft
 *   (black) · 7 More Work (white) · 8 COVID Payoff (green) · 9 Outcomes (white)
 *   · CTA (ink/black).
 * Reuses the br-* editorial system; accent --ws-green (brightened to #23c265 on
 * the dark bands). Real imagery under /public/wingstop/*.
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
      <AppFoundationSection />
      <ChallengeSection intro={props.challengeIntro} />
      <FlavorWorldSection intro={props.redesignIntro} />
      <UsabilitySection />
      <CraftSection />
      <MoreWorkSection />
      <CovidSection />
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
