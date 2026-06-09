import { BrandingHero } from './BrandingHero'
import { BrandShowcase } from './BrandShowcase'
import { B2BExploration } from './B2BExploration'
import { MarketingContent } from './MarketingContent'

/**
 * The full Branding section of the Baserate case study, in order:
 *   1. Hero "Brand & Marketing" — devices + floating logos + orbs
 *   2. Journalytic branding (B2C) — brand board grid on the blue field
 *   3. B2B Exploration — dual opposite-scrolling carousels
 *   4. Baserate branding (B2B) — brand board grid on the grey field
 *   5. Marketing content — the MCP marketing video (sound + play/pause)
 */
export function BrandingSection() {
  return (
    <div className="bg-white">
      <BrandingHero />

      {/* Journalytic — the consumer (B2C) brand, on the blue gradient */}
      <BrandShowcase
        theme="journalytic"
        eyebrow="Journalytic · B2C"
        title="Journalytic Branding"
        blurb="The consumer brand for solo investors — approachable, confident, and built around the habit of journaling every decision."
        wordmark="/baserate/branding/logos/journalytic-logo.svg"
        appIcon="/baserate/branding/logos/journalytic-app.svg"
        uiShot="/baserate/branding/journalytic-site.png"
        uiCrop="center top"
        palette={['#2f6db5', '#0b1f3a', '#5b9bd5', '#e8eef6', '#0c1320']}
      />

      {/* B2B exploration — the wide name/logo search */}
      <B2BExploration />

      {/* Baserate — the B2B brand, on the grey background; bottom card = R4 homepage */}
      <BrandShowcase
        theme="baserate"
        eyebrow="Baserate · B2B"
        title="Baserate Branding"
        blurb="The B2B brand for investment teams — sharper and more institutional, signalling rigor and a system of record."
        wordmark="/baserate/branding/logos/baserate-logo.svg"
        appIcon="/baserate/branding/logos/baserate-app.svg"
        uiShot="/baserate/branding/r4-homepage.png"
        uiCrop="center 30%"
        palette={['#070e2c', '#ae7d00', '#2f6db5', '#f8f8fb', '#242627']}
      />

      {/* Marketing content — the MCP video with sound */}
      <MarketingContent />
    </div>
  )
}
