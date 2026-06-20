'use client'

import { Reveal } from '../../../animation/Reveal'
import { BluePlaceholder } from '../BluePlaceholder'
import { AnchorHeader, BlueRail, BlueGrid, ModuleCaption } from './primitives'

/**
 * Section 04 — Motion & Illustration (GREY section, light tone).
 *
 * NO art-direction / photography (Joshua didn't direct photography). Focus:
 * interface motion + illustration systems + animated identity, plus a VIRAL
 * ANIMATIONS moment (octopus → Laughing Squid; fire → Tumblr/Imgur/Reddit),
 * framed honestly, no fabricated numbers.
 */
export function ArtMotionModules({ dark = false }: { dark?: boolean }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Motion reel + filmstrip */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Motion · reel"
          title="Motion that reads, even paused"
          blurb="Interface motion and brand film as a looping reel, with a filmstrip of stills pulled from it — so the work lands whether or not it’s playing."
        />
        <BluePlaceholder ratio="ultrawide" dark={dark} label="Motion reel — looping video (FPO)" />
        <div className="mt-4">
          <BlueGrid
            dark={dark}
            cols={4}
            ratio="video"
            items={['Mindbody — interface motion', 'CBTL — brand film (4K)', 'Schick — interface motion', 'ConCo — motion piece']}
          />
        </div>
        <ModuleCaption dark={dark}>Filmstrip — stills from the reel (FPO). Real build autoplays muted loops.</ModuleCaption>
      </div>

      {/* Viral animations — the honest highlight */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Went viral"
          title="A few took on a life of their own"
          blurb="Loop animations that spread well beyond Dribbble — picked up and reposted across the web."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <Reveal>
            <div className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-white">
              <BluePlaceholder ratio="square" rounded={false} label="“Quadtopus” octopus loop (FPO)" />
              <div className="p-5">
                <div className="flex items-baseline gap-3">
                  <p className="text-[15px] font-medium text-[var(--br-ink)]">Octopus swim-cycle</p>
                  <span className="br-data text-[11px] uppercase tracking-[0.08em] text-[var(--br-gold)]">“Quadtopus”</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  <span><span className="text-[20px] font-semibold text-[var(--br-ink)]">65K+</span> <span className="br-data text-[11px] uppercase tracking-[0.06em] text-[var(--br-muted-2)]">Reddit upvotes</span></span>
                  <span><span className="text-[20px] font-semibold text-[var(--br-ink)]">140K+</span> <span className="br-data text-[11px] uppercase tracking-[0.06em] text-[var(--br-muted-2)]">Imgur views</span></span>
                </div>
                <p className="mt-3 text-[13px] leading-snug text-[var(--br-muted)]">
                  Featured on <span className="font-medium">Laughing Squid</span>; reposted across Reddit, Imgur &amp; Pinterest over multiple waves.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-white">
              <BluePlaceholder ratio="square" rounded={false} label="Fire loop (FPO)" />
              <div className="p-5">
                <div className="flex items-baseline gap-3">
                  <p className="text-[15px] font-medium text-[var(--br-ink)]">Fire loop</p>
                  <span className="br-data text-[11px] uppercase tracking-[0.08em] text-[var(--br-gold)]">Animation experiment</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  <span><span className="text-[20px] font-semibold text-[var(--br-ink)]">88K</span> <span className="br-data text-[11px] uppercase tracking-[0.06em] text-[var(--br-muted-2)]">Imgur views</span></span>
                  <span><span className="text-[20px] font-semibold text-[var(--br-ink)]">3.4K</span> <span className="br-data text-[11px] uppercase tracking-[0.06em] text-[var(--br-muted-2)]">Reddit upvotes</span></span>
                </div>
                <p className="mt-3 text-[13px] leading-snug text-[var(--br-muted)]">
                  Reposted across <span className="font-medium">Imgur, Reddit &amp; Pinterest</span> — far past the original post.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Illustration & motion languages */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Languages"
          title="Documented visual languages"
          role="Mindbody · CBTL"
          blurb="Mindbody’s illustration (“2 Pillars: Relatable, Purposeful”) and motion (“3 Pillars: Calming, Reactive, Guiding”) — principles teams can follow."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-7">
          <BluePlaceholder ratio="portrait" dark={dark} label="Illustration language — Mindbody (FPO)" />
          <BluePlaceholder ratio="portrait" dark={dark} label="Motion language — Mindbody (FPO)" />
          <BluePlaceholder ratio="portrait" dark={dark} label="Illustration applied in-product (FPO)" />
        </div>
      </div>

      {/* Animated marks + character work */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Animated identity & character"
          title="Marks & characters in motion"
          blurb="Logo systems, loaders, and character loops built to move."
        />
        <BlueRail
          dark={dark}
          fullBleed
          ratio="square"
          items={[
            'Rosetta — animated mark',
            'Jubilee — animated mark',
            'Octopus — swim cycle',
            'Fire — loop',
            'Whale',
            'Lion',
            'Bird',
            'Monkey — walk cycle',
            'Adventure Time — loader',
          ]}
        />
      </div>
    </div>
  )
}
