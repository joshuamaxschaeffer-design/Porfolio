import {
  overview as overviewDefaults,
  sections as sectionDefaults,
  note as noteDefault,
  type CapabilitySection,
  type MediaSlot,
} from './data'
import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'
import { ComponentShowcase } from '../shared/ComponentShowcase'
import { ComponentShowcaseTwo } from '../shared/ComponentShowcaseTwo'

export interface CapabilitiesPageProps {
  /** Header overrides */
  eyebrow?: string
  heading?: string
  lead?: string
  note?: string
  /** Optional CMS override of the discipline sections; falls back to defaults */
  sections?: CapabilitySection[]
}

/* aspect ratio token → tailwind class */
const RATIO: Record<NonNullable<MediaSlot['ratio']>, string> = {
  wide: 'aspect-[16/9]',
  video: 'aspect-[16/10]',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  tall: 'aspect-[9/16]',
}

/** Neutral dashed frame holding the spot for real imagery (FPO). */
function PlaceholderFrame({ slot }: { slot: MediaSlot }) {
  return (
    <div
      className={`flex w-full items-center justify-center rounded-[var(--br-card-radius)] border border-dashed border-[var(--br-divider)] bg-[var(--br-grey-card)] ${
        RATIO[slot.ratio ?? 'video']
      }`}
    >
      <p className="br-data px-6 text-center text-[12px] uppercase leading-relaxed tracking-[0.14em] text-[var(--br-muted-2)]">
        {slot.label}
      </p>
    </div>
  )
}

/** Grey chip standing in for a client logo (FPO). */
function LogoRow({ clients }: { clients: string[] }) {
  if (!clients?.length) return null
  return (
    <div className="mt-7 flex flex-wrap items-center gap-2.5">
      {clients.map((c) => (
        <span
          key={c}
          className="br-data flex h-9 items-center rounded-[6px] border border-dashed border-[var(--br-line)] bg-[var(--br-bg-2)] px-3 text-[12px] uppercase tracking-[0.06em] text-[var(--br-muted-2)]"
        >
          {c}
        </span>
      ))}
    </div>
  )
}

/** The copy column for a discipline (heading + intro + logos). */
function DisciplineCopy({ section }: { section: CapabilitySection }) {
  return (
    <div>
      <h2 className="text-[28px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
        {section.num}. {section.title}
      </h2>
      <p className="mt-4 max-w-[52ch] text-[15px] leading-normal text-[var(--br-muted)] md:text-lg">
        {section.intro}
      </p>
      <LogoRow clients={section.clients} />
    </div>
  )
}

/** One discipline section — alternates layout so the scroll stays varied. */
function DisciplineSection({ section }: { section: CapabilitySection }) {
  const { id, layout, media } = section

  // alternating shaded background for rhythm on even sections
  const shaded = Number(section.num) % 2 === 0

  return (
    <section id={id} className={shaded ? 'bg-[var(--br-bg-2)]' : 'bg-white'}>
      <div className="br-container py-16 md:py-24">
        {layout === 'mediaRight' && (
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-[60px]">
            <DisciplineCopy section={section} />
            <PlaceholderFrame slot={media[0]} />
          </div>
        )}

        {layout === 'mediaLeft' && (
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-[60px]">
            <div className="md:order-2">
              <DisciplineCopy section={section} />
            </div>
            <div className="md:order-1">
              <PlaceholderFrame slot={media[0]} />
            </div>
          </div>
        )}

        {layout === 'stack' && (
          <div>
            <DisciplineCopy section={section} />
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7">
              {media.map((m, i) => (
                <PlaceholderFrame key={i} slot={m} />
              ))}
            </div>
          </div>
        )}

        {layout === 'trio' && (
          <div>
            <DisciplineCopy section={section} />
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {media.map((m, i) => (
                <PlaceholderFrame key={i} slot={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/** Hero / overview — wordmark, title, lead, role, scope pills, wide media. */
function OverviewSection({
  eyebrow,
  heading,
  lead,
  note,
  scope,
  role,
  heroMedia,
}: {
  eyebrow: string
  heading: string
  lead: string
  note: string
  scope: string[]
  role: string
  heroMedia: string
}) {
  return (
    <section id="overview" className="bg-white">
      <div className="br-container pt-16 pb-12 md:pt-24 md:pb-16">
        <p className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--br-gold)] md:text-sm">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl whitespace-pre-line text-[40px] font-medium leading-[1.04] tracking-[-0.01em] text-[var(--br-ink)] md:text-[68px]">
          {heading}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--br-muted)] md:text-[22px]">
          {lead}
        </p>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--br-muted-2)]">
            Role
          </p>
          <p className="mt-1.5 max-w-3xl text-base text-[var(--br-body)]">{role}</p>
        </div>

        <ul className="mt-7 flex flex-wrap gap-2">
          {scope.map((s) => (
            <li
              key={s}
              className="br-data rounded-[var(--br-tag-radius)] border border-[var(--br-gold)] px-3 py-1.5 text-[14px] uppercase text-[var(--br-gold)]"
            >
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-10 md:mt-12">
          <PlaceholderFrame slot={{ label: heroMedia, ratio: 'wide' }} />
        </div>

        {note && <p className="mt-5 text-sm text-[var(--br-muted-2)]">{note}</p>}
      </div>
    </section>
  )
}

/**
 * Capabilities — case-study-style scrolling page. Hero/overview, then one
 * section per design discipline (numbered heading + FPO copy + client-logo row +
 * grey placeholder media), with the floating numbered SectionNav rail. Built on
 * the br-* editorial system with a single gold accent, matching the other case
 * studies (Baserate / Panda / Samsung / Wingstop).
 */
export function CapabilitiesPage(props: CapabilitiesPageProps = {}) {
  const eyebrow = props.eyebrow ?? overviewDefaults.eyebrow
  const heading = props.heading ?? overviewDefaults.heading
  const lead = props.lead ?? overviewDefaults.lead
  const note = props.note ?? noteDefault
  const sections = props.sections?.length ? props.sections : sectionDefaults

  const navItems: SectionNavItem[] = [
    { id: 'overview', title: 'Overview' },
    ...sections.map((s) => ({ id: s.id, title: s.title })),
  ]

  return (
    <article className="br-article bg-white">
      <SectionNav items={navItems} />
      <OverviewSection
        eyebrow={eyebrow}
        heading={heading}
        lead={lead}
        note={note}
        scope={overviewDefaults.scope}
        role={overviewDefaults.role}
        heroMedia={overviewDefaults.heroMedia}
      />
      {sections.map((s) => (
        <DisciplineSection key={s.id} section={s} />
      ))}

      {/* ── Component library showcase (scratch — cull later) ───── */}
      <ComponentShowcase />
      <ComponentShowcaseTwo />
    </article>
  )
}
