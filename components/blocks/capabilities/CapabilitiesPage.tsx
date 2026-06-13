import {
  intro as introDefaults,
  categories as categoryDefaults,
  type CapabilityCategory,
} from './data'

export interface CapabilitiesPageProps {
  /** Header overrides */
  eyebrow?: string
  heading?: string
  lead?: string
  note?: string
  /** Optional CMS override of the discipline list; falls back to defaults */
  categories?: CapabilityCategory[]
}

/**
 * Capabilities page — basic layout, fully responsive.
 *
 * Organized by design discipline (per Joshua, 2026-06-13): a header that states
 * the breadth claim, then a grid of discipline cards. Each card carries the
 * ordinal, the discipline, a one-line capability statement, and the named
 * products/brands it was shipped for.
 *
 * Reuses the br-* editorial system (container metrics, type scale, neutrals)
 * from the case-study builds, with a single gold accent (--br-gold). No imagery
 * required — this is the structural layout; artifacts/logos can be layered in
 * per category later.
 */
export function CapabilitiesPage(props: CapabilitiesPageProps = {}) {
  const eyebrow = props.eyebrow ?? introDefaults.eyebrow
  const heading = props.heading ?? introDefaults.heading
  const lead = props.lead ?? introDefaults.lead
  const note = props.note ?? introDefaults.note
  const categories =
    props.categories?.length ? props.categories : categoryDefaults

  return (
    <article className="br-article bg-white">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="br-container pt-16 pb-10 md:pt-24 md:pb-16">
        <p className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--br-gold)] md:text-sm">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl whitespace-pre-line text-[40px] font-medium leading-[1.04] tracking-[-0.01em] text-[var(--br-ink)] md:text-[68px]">
          {heading}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--br-muted)] md:text-[22px]">
          {lead}
        </p>
        {note && (
          <p className="mt-5 text-sm text-[var(--br-muted-2)]">{note}</p>
        )}
      </header>

      {/* ── Discipline grid ────────────────────────────────────── */}
      <section
        aria-label="Design disciplines"
        className="br-container pb-24 md:pb-32"
      >
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-[var(--br-line)] sm:grid-cols-2">
          {categories.map((cat) => (
            <CategoryCard key={cat.num} category={cat} />
          ))}
        </ul>
      </section>
    </article>
  )
}

/** One discipline cell in the hairline grid. */
function CategoryCard({ category }: { category: CapabilityCategory }) {
  const { num, title, blurb, clients } = category
  return (
    <li className="group flex flex-col bg-white p-7 transition-colors duration-200 hover:bg-[var(--br-bg-2)] md:p-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[22px] font-medium leading-tight tracking-[-0.01em] text-[var(--br-ink)] md:text-[28px]">
          {title}
        </h2>
        <span
          aria-hidden
          className="br-data shrink-0 text-sm font-semibold text-[var(--br-gold)] md:text-base"
        >
          {num}
        </span>
      </div>

      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-[var(--br-muted)] md:text-base">
        {blurb}
      </p>

      {/* Clients pushed to the bottom so cards of different copy length align. */}
      <div className="mt-6 flex flex-wrap gap-2 md:mt-auto md:pt-7">
        {clients.map((client) => (
          <span
            key={client}
            className="br-data rounded-[var(--br-tag-radius)] border border-[var(--br-line)] bg-white px-2.5 py-1 text-[12px] leading-none text-[var(--br-body)] md:text-[13px]"
          >
            {client}
          </span>
        ))}
      </div>
    </li>
  )
}
