'use client'

import { Reveal } from '../../../animation/Reveal'
import { AnchorHeader, ModuleCaption } from './primitives'

/** A desktop hero with a phone overlapping its corner — real responsive pair. */
function ResponsivePair({
  desktop,
  mobile,
  label,
}: {
  desktop: string
  mobile: string
  label: string
}) {
  return (
    <Reveal>
      <div className="relative pb-12 pr-10 md:pb-14 md:pr-14">
        <div className="overflow-hidden rounded-[var(--br-card-radius)] border border-white/10 bg-white shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={desktop} alt={`${label} — desktop`} className="aspect-[16/10] w-full object-cover object-top" loading="lazy" />
        </div>
        <div className="absolute bottom-0 right-0 w-[26%] max-w-[140px] overflow-hidden rounded-[18px] border-2 border-white bg-white shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mobile} alt={`${label} — mobile`} className="aspect-[9/19] w-full object-cover object-top" loading="lazy" />
        </div>
      </div>
      <p className="br-data text-[11px] uppercase tracking-[0.08em] text-white/45">{label}</p>
    </Reveal>
  )
}

/** Section 05 — Marketing & Web (BLACK section, dark tone). */
export function MarketingWebModules({ dark = true }: { dark?: boolean }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Responsive pairings — real TFK + Blaze sites */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · Web"
          title="The whole journey, every screen size"
          role="True Food Kitchen — Lead · Blaze — Sole/Lead"
          blurb="Launch and ordering sites designed desktop-down-to-mobile. True Food Kitchen drove 30%+ of off-premise sales through online ordering within a quarter of launch."
        />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-14">
          <ResponsivePair
            desktop="/capabilities/web/tfk-home-hero.webp"
            mobile="/capabilities/web/tfk-mobile-hero.webp"
            label="True Food Kitchen — ordering site"
          />
          <ResponsivePair
            desktop="/capabilities/web/blaze-home-hero.webp"
            mobile="/capabilities/web/blaze-mobile-hero.webp"
            label="Blaze — marketing site"
          />
        </div>
      </div>

      {/* A full page at length — real TFK seasonal */}
      <div>
        <AnchorHeader dark={dark} kicker="Web · at length" title="Art-directed, top to bottom" blurb="Full pages designed as a journey — brand storytelling and conversion in one scroll." />
        <Reveal>
          <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-white/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/capabilities/web/tfk-seasonal.webp" alt="True Food Kitchen seasonal page" className="w-full object-cover" loading="lazy" />
            <figcaption className="br-data px-4 py-3 text-[11px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">True Food Kitchen — seasonal feature</figcaption>
          </figure>
        </Reveal>
      </div>

      {/* CRM / lifecycle — real DQ mailers + Chandon */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Lifecycle · CRM"
          title="Retention, not one-off mailers"
          blurb="A full email & lifecycle program for Dairy Queen — monthly campaigns and animated mailers — plus shoppable social for Chandon."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {[
            { src: '/capabilities/web/dq-dec.webp', label: 'DQ — December' },
            { src: '/capabilities/web/dq-jan.webp', label: 'DQ — January' },
            { src: '/capabilities/web/dq-april.mp4', label: 'DQ — April (animated)' },
            { src: '/capabilities/web/chandon-ig.webp', label: 'Chandon — IG Shopping' },
          ].map((a, i) => (
            <Reveal key={a.label} delay={i * 40}>
              <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-white/10 bg-white">
                {a.src.endsWith('.mp4') ? (
                  <video
                    src={a.src}
                    poster={a.src.replace('.mp4', '-poster.webp')}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={a.label}
                    className="aspect-[3/5] w-full object-cover object-top"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.src} alt={a.label} className="aspect-[3/5] w-full object-cover object-top" loading="lazy" />
                )}
                <figcaption className="br-data px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">{a.label}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <ModuleCaption dark={dark}>Lifecycle creative — a real program, not one-offs.</ModuleCaption>
      </div>
    </div>
  )
}
