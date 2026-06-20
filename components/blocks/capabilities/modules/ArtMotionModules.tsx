'use client'

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
