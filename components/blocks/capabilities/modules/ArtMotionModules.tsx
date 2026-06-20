'use client'

import { BluePlaceholder } from '../BluePlaceholder'
import { DarkBand } from '../DarkBand'
import { AnchorHeader, BlueGrid, BlueRail, ModuleCaption } from './primitives'

/**
 * Section 04 — Art Direction & Motion work modules.
 *
 * DARK band: the motion reel + filmstrip + the documented visual languages —
 * the most cinematic moment on the page. Light: AD boards + animated marks.
 */
export function ArtMotionModules() {
  return (
    <div className="space-y-16 md:space-y-20">
      {/* ── DARK band: reel + filmstrip + languages ─────────── */}
      <DarkBand
        eyebrow="Motion · reel"
        title="Motion that reads, even paused"
        blurb="A looping reel of interface motion and brand film, with a filmstrip of stills pulled from it — so the work lands whether or not it’s playing. I’ve defined entire visual languages, not just one-off assets."
      >
        <BluePlaceholder ratio="ultrawide" dark label="Motion reel — looping video (FPO)" />
        <div className="mt-4">
          <BlueGrid
            dark
            cols={4}
            ratio="video"
            items={[
              'Wingstop — flavor film',
              'CBTL — brand film (4K)',
              'Mindbody — interface motion',
              'Pepsi — product / AR',
              'Schick — interface motion',
              'ConCo — motion piece',
            ]}
          />
        </div>
        <ModuleCaption dark>Filmstrip — stills from the reel (FPO). Real build autoplays muted loops.</ModuleCaption>

        {/* visual languages */}
        <div className="mt-12 border-t border-white/10 pt-12">
          <AnchorHeader
            dark
            kicker="Direction · languages"
            title="Documented visual languages"
            role="Mindbody · CBTL"
            blurb="Mindbody’s illustration (“2 Pillars: Relatable, Purposeful”) and motion (“3 Pillars: Calming, Reactive, Guiding”), and CBTL’s watercolor art direction."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-7">
            <BluePlaceholder ratio="portrait" dark label="Illustration language — Mindbody (FPO)" />
            <BluePlaceholder ratio="portrait" dark label="Motion language — Mindbody (FPO)" />
            <BluePlaceholder ratio="portrait" dark label="Watercolor AD — CBTL (FPO)" />
          </div>
        </div>
      </DarkBand>

      {/* ── Art-direction boards (light) ────────────────────── */}
      <div>
        <AnchorHeader
          kicker="Art direction"
          title="Photography & campaign direction"
          blurb="Key art and directed photography across brands — the visual hypothesis held across surfaces."
        />
        <BlueGrid
          cols={3}
          ratio="wide"
          items={[
            'CBTL — lifestyle photography',
            'True Food Kitchen — food photography',
            'Dave & Buster’s — energy / play',
            'Pepsi — product / AR',
            'Wingstop — flavor key art',
            'Panda — food photography / campaign',
            'Samsung — Galaxy campaign direction',
          ]}
        />
      </div>

      {/* ── Animated marks (light rail) ─────────────────────── */}
      <div>
        <AnchorHeader
          kicker="Animated identity"
          title="Marks in motion"
          blurb="Logo systems and icon studies built to move."
        />
        <BlueRail
          ratio="square"
          items={[
            'Rosetta — animated mark',
            'Jubilee — animated mark',
            'Random Animations — bird',
            'Random Animations — fire',
            'Random Animations — whale',
            'Random Animations — lion',
            'Random Animations — octopus',
          ]}
        />
      </div>
    </div>
  )
}
