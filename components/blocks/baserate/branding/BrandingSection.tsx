import { BrandingHero } from './BrandingHero'
import { BrandShowcase } from './BrandShowcase'
import { B2BExploration } from './B2BExploration'
import { MarketingContent } from './MarketingContent'

/**
 * The full Branding section of the Baserate case study — matched to the Figma
 * frame 224:53188 (source of truth for layout, copy and color):
 *   1. Hero "Brand & Marketing" — devices floating over page-sheets, 3D logo
 *      chips, colour orbs, white→blue diagonal.
 *   2. Journalytic brand board (B2C) — no heading of its own; the hero's
 *      "B2C Brand Exploration" label introduces it (per Figma).
 *   3. B2B Exploration — name/logo marquees scrolling opposite directions.
 *   4. Baserate brand board (B2B) — on the "Grey BG" image, with the
 *      letter-card + R4 homepage bottom row.
 *   5. Marketing content — the MCP video on black.
 *
 * The hero, Journalytic board and B2B marquees all sit on ONE continuous
 * teal→blue gradient — in Figma the gradient runs horizontally across the
 * entire blue field (teal #18768C left → blue #2B6EB7 right).
 */
export function BrandingSection() {
  return (
    <div id="branding" className="bg-white">
      <div style={{ background: 'linear-gradient(96deg, #18768C 0%, #2B6EB7 100%)' }}>
        <BrandingHero />
        <BrandShowcase theme="journalytic" />
        <B2BExploration />
      </div>
      <BrandShowcase theme="baserate" />
      <MarketingContent />
    </div>
  )
}
