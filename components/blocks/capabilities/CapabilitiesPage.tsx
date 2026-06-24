import { SectionNav, type SectionNavItem } from '../baserate/SectionNav'
import { StatCounters } from '../shared/StatCounters'
import { LogoMarquee } from './BrandLogo'
import { pick } from './brands'
import { heroStats, heroCopy } from './disciplines'

// NOTE: the six discipline sections are temporarily gated behind a "Coming Soon"
// panel (see below). When restoring them, re-add these imports:
//   import { DisciplineModule } from './DisciplineModule'
//   import { BG, productUx, brand, designSystems, artMotion, marketingWeb, leadership } from './disciplines'
//   import { ProductUxModules } from './modules/ProductUxModules'
//   import { BrandModules } from './modules/BrandModules'
//   import { DesignSystemsModules } from './modules/DesignSystemsModules'
//   import { ArtMotionModules } from './modules/ArtMotionModules'
//   import { MarketingWebModules } from './modules/MarketingWebModules'
//   import { LeadershipModules } from './modules/LeadershipModules'

export interface CapabilitiesPageProps {
  eyebrow?: string
  heading?: string
  lead?: string
}

/**
 * Capabilities — the CENTERPIECE section.
 *
 * Seven sections, each a single FLAT premium background color edge-to-edge so it
 * reads as one connected block: Hero WHITE → 01 GREY → 02 BLACK → 03 NAVY →
 * 04 GREY → 05 BLACK → 06 WHITE. Tone-aware modules flip light/dark per section.
 * Images stay bluescale FPO; logos are real where sourced.
 */
export function CapabilitiesPage(props: CapabilitiesPageProps = {}) {
  const eyebrow = props.eyebrow ?? heroCopy.eyebrow
  const heading = props.heading ?? heroCopy.heading
  const lead = props.lead ?? heroCopy.lead

  // Gated: only the Overview is public for now. The six discipline sections
  // below are withheld behind a "Coming Soon" panel until the work is ready,
  // so the rail shows just the two visible stops.
  const navItems: SectionNavItem[] = [
    { id: 'overview', title: 'Overview' },
    { id: 'coming-soon', title: 'Coming Soon' },
  ]

  return (
    <article className="br-article bg-white">
      <SectionNav items={navItems} />

      {/* ── Hero — WHITE ───────────────────────────────────────── */}
      <section id="overview" className="bg-white">
        <div className="br-container pt-16 pb-16 md:pt-24 md:pb-24">
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
        </div>
        {/* Instant proof — real-logo marquee */}
        <div className="pb-14 md:pb-20">
          <LogoMarquee
            brands={pick(
              'panda', 'wingstop', 'samsung', 'mindbody', 'raisingCanes', 'daveAndBusters',
              'pepsi', 'dairyQueen', 'vfCorp', 'chandon', 'petsmart', 'baserate',
            )}
          />
        </div>
      </section>

      {/* ── Coming Soon — withholds the six discipline sections ──────────────
          The full by-discipline breakdown is built but not public yet. Until it
          is, everything below the Overview is gated behind this panel. To restore
          the real sections: delete this block and uncomment the disciplines below,
          and put the six stops back in `navItems` above. ──────────────────── */}
      <section id="coming-soon" className="bg-[var(--br-bg-2)]">
        <div className="br-container flex min-h-[58vh] flex-col items-center justify-center py-24 text-center md:min-h-[64vh] md:py-32">
          <p className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--br-gold)] md:text-sm">
            In progress
          </p>
          <h2 className="mt-4 text-[34px] font-medium leading-[1.05] tracking-[-0.01em] text-[var(--br-ink)] md:text-[56px]">
            Coming soon
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--br-muted)] md:text-lg">
            I&rsquo;m currently sifting through my past work across thousands of
            screens, clients, and brands. Check back soon for a full breakdown of
            the work I&rsquo;ve done, organized by discipline.
          </p>
        </div>
      </section>

      {/* ── Discipline sections — GATED (hidden until ready) ─────────────────
      <DisciplineModule
        {...sectionProps(productUx)}
        clientBrands={pick(
          'raisingCanes', 'daveAndBusters', 'mindbody', 'cbtl', 'wingstop', 'panda',
          'blaze', 'trees', 'baserate', 'vfCorp', 'petsmart', 'trueFoodKitchen', 'noodles',
        )}
      >
        <ProductUxModules dark={BG[productUx.bg].dark} />
      </DisciplineModule>

      <DisciplineModule {...sectionProps(brand)}>
        <BrandModules dark={BG[brand.bg].dark} />
      </DisciplineModule>

      <DisciplineModule
        {...sectionProps(designSystems)}
        clientBrands={pick('mindbody', 'raisingCanes', 'daveAndBusters', 'cbtl', 'trees', 'baserate')}
      >
        <DesignSystemsModules dark={BG[designSystems.bg].dark} />
      </DisciplineModule>

      <DisciplineModule
        {...sectionProps(artMotion)}
        clientBrands={pick('mindbody', 'cbtl', 'pepsi')}
      >
        <ArtMotionModules dark={BG[artMotion.bg].dark} />
      </DisciplineModule>

      <DisciplineModule
        {...sectionProps(marketingWeb)}
        clientBrands={pick('trueFoodKitchen', 'blaze', 'wingstop', 'panda', 'dairyQueen', 'chandon', 'pepsi', 'vfCorp')}
      >
        <MarketingWebModules dark={BG[marketingWeb.bg].dark} />
      </DisciplineModule>

      <DisciplineModule {...sectionProps(leadership)}>
        <LeadershipModules dark={BG[leadership.bg].dark} />
      </DisciplineModule>
      ──────────────────────────────────────────────────────────────────── */}
    </article>
  )
}

/* Spread the shared DisciplineModule props from a discipline object.
   Restore alongside the gated discipline sections above.
function sectionProps(d: typeof productUx) {
  return {
    num: d.num,
    id: d.id,
    title: d.title,
    positioning: d.positioning,
    capabilities: d.capabilities,
    stats: d.stats,
    statsNote: d.statsNote,
    bg: d.bg,
  }
}
*/
