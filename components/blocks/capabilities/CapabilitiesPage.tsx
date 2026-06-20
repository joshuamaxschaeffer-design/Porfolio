import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'
import { StatCounters } from '../shared/StatCounters'
import { DisciplineModule } from './DisciplineModule'
import {
  heroStats,
  heroCopy,
  productUx,
  brand,
  designSystems,
  artMotion,
  marketingWeb,
  leadership,
} from './disciplines'
import { ProductUxModules } from './modules/ProductUxModules'
import { BrandModules } from './modules/BrandModules'
import { DesignSystemsModules } from './modules/DesignSystemsModules'
import { ArtMotionModules } from './modules/ArtMotionModules'
import { MarketingWebModules } from './modules/MarketingWebModules'
import { LeadershipModules } from './modules/LeadershipModules'

export interface CapabilitiesPageProps {
  /** Header overrides (CMS) */
  eyebrow?: string
  heading?: string
  lead?: string
}

/**
 * Capabilities — the CENTERPIECE section.
 *
 * The biggest, most-impressive section on the site: it carries everything
 * outside the four case studies (Panda + Baserate flagships; Wingstop + Samsung
 * secondary). A centerpiece hero with a section-level stat row, then five merged
 * disciplines — each a DisciplineModule (overview + work modules) — and a
 * closing Leadership band.
 *
 * This pass lays out the full structure with BLUESCALE FPO placeholders inside
 * the real layouts; real imagery (Figma exports / disk assets) drops in later.
 * Built on the br-* editorial system with the single gold accent.
 */
export function CapabilitiesPage(props: CapabilitiesPageProps = {}) {
  const eyebrow = props.eyebrow ?? heroCopy.eyebrow
  const heading = props.heading ?? heroCopy.heading
  const lead = props.lead ?? heroCopy.lead

  const navItems: SectionNavItem[] = [
    { id: 'overview', title: 'Overview' },
    { id: productUx.id, title: productUx.title },
    { id: brand.id, title: brand.title },
    { id: designSystems.id, title: designSystems.title },
    { id: artMotion.id, title: artMotion.title },
    { id: marketingWeb.id, title: marketingWeb.title },
    { id: leadership.id, title: leadership.title },
  ]

  return (
    <article className="br-article bg-white">
      <SectionNav items={navItems} />

      {/* ── Centerpiece hero + section-level stat row ──────────── */}
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
          <div className="mt-12 md:mt-16">
            <StatCounters stats={heroStats} />
          </div>
          <p className="br-data mt-7 text-[11px] uppercase leading-relaxed tracking-[0.08em] text-[var(--br-muted-2)]">
            {heroCopy.statsNote}
          </p>
        </div>
      </section>

      {/* ── 01 — Product & UX ──────────────────────────────────── */}
      <DisciplineModule
        num={productUx.num}
        id={productUx.id}
        title={productUx.title}
        positioning={productUx.positioning}
        capabilities={productUx.capabilities}
        stats={productUx.stats}
        statsNote={productUx.statsNote}
      >
        <ProductUxModules />
      </DisciplineModule>

      {/* ── 02 — Brand & Identity ──────────────────────────────── */}
      <DisciplineModule
        num={brand.num}
        id={brand.id}
        title={brand.title}
        positioning={brand.positioning}
        capabilities={brand.capabilities}
        stats={brand.stats}
        statsNote={brand.statsNote}
        shaded
      >
        <BrandModules />
      </DisciplineModule>

      {/* ── 03 — Design Systems & Implementation ───────────────── */}
      <DisciplineModule
        num={designSystems.num}
        id={designSystems.id}
        title={designSystems.title}
        positioning={designSystems.positioning}
        capabilities={designSystems.capabilities}
        stats={designSystems.stats}
        statsNote={designSystems.statsNote}
      >
        <DesignSystemsModules />
      </DisciplineModule>

      {/* ── 04 — Art Direction & Motion ────────────────────────── */}
      <DisciplineModule
        num={artMotion.num}
        id={artMotion.id}
        title={artMotion.title}
        positioning={artMotion.positioning}
        capabilities={artMotion.capabilities}
        stats={artMotion.stats}
        statsNote={artMotion.statsNote}
        shaded
      >
        <ArtMotionModules />
      </DisciplineModule>

      {/* ── 05 — Marketing & Web ───────────────────────────────── */}
      <DisciplineModule
        num={marketingWeb.num}
        id={marketingWeb.id}
        title={marketingWeb.title}
        positioning={marketingWeb.positioning}
        capabilities={marketingWeb.capabilities}
        stats={marketingWeb.stats}
        statsNote={marketingWeb.statsNote}
      >
        <MarketingWebModules />
      </DisciplineModule>

      {/* ── 06 — Leadership & How I Work (closing band) ────────── */}
      <DisciplineModule
        num={leadership.num}
        id={leadership.id}
        title={leadership.title}
        positioning={leadership.positioning}
        capabilities={leadership.capabilities}
        stats={leadership.stats}
        shaded
      >
        <LeadershipModules />
      </DisciplineModule>
    </article>
  )
}
