import { BrandingHero } from './BrandingHero'
import { BrandShowcase } from './BrandShowcase'
import { B2BExploration } from './B2BExploration'
import { MarketingContent } from './MarketingContent'

/**
 * The full Branding section of the Baserate case study, in order:
 *   1. Hero "Brand & Marketing" — devices + floating logos + orbs
 *   2. Journalytic branding (the B2C brand, finished first)
 *   3. B2B Exploration — dual opposite-scrolling carousels
 *   4. Baserate branding (the B2B brand)
 *   5. Marketing content — the MCP marketing video (sound + play/pause)
 */
export function BrandingSection() {
  return (
    <div className="bg-white">
      <BrandingHero />

      {/* Journalytic — the consumer (B2C) brand */}
      <BrandShowcase
        eyebrow="Journalytic · B2C"
        title="Journalytic Branding"
        blurb="The consumer brand for solo investors — approachable, confident, and built around the habit of journaling every decision."
        logoVideo="/baserate/branding/logos/journalytic-logo.mp4"
        appIcon="/baserate/branding/logos/journalytic-app.svg"
        siteImage="/baserate/branding/journalytic-site.png"
        palette={['#2f6db5', '#0b1f3a', '#5b9bd5', '#e8eef6', '#0c1320']}
        theme="light"
      />

      {/* B2B exploration — the wide name/logo search */}
      <B2BExploration />

      {/* Baserate — the B2B brand */}
      <BrandShowcase
        eyebrow="Baserate · B2B"
        title="Baserate Branding"
        blurb="The B2B brand for investment teams — sharper and more institutional, signalling rigor and a system of record."
        logoVideo="/baserate/branding/logos/baserate-logo.mp4"
        appIcon="/baserate/branding/logos/baserate-app.svg"
        siteImage="/baserate/branding/baserate-site.png"
        palette={['#070e2c', '#ae7d00', '#2f6db5', '#f8f8fb', '#242627']}
        theme="dark"
        reverse
      />

      {/* Marketing content — the MCP video with sound */}
      <MarketingContent />
    </div>
  )
}
