'use client'

import { BluePlaceholder } from '../BluePlaceholder'
import { AnchorHeader, BlueGrid, BlueRail, ModuleCaption } from './primitives'

/**
 * Section 04 — Art Direction & Motion work modules (bluescale FPO).
 *
 * - Reel hero + filmstrip of still keyframes (so motion reads even when paused).
 * - The documented visual *languages* (Mindbody illustration + motion pillars,
 *   CBTL watercolor) as proof of direction.
 * - Art-direction boards (photography / campaign stills).
 * - Animated-mark showcase.
 */
export function ArtMotionModules() {
  return (
    <div className="space-y-20 md:space-y-28">
      {/* ── Reel hero + filmstrip ───────────────────────────── */}
      <div>
        <AnchorHeader
          kicker="Motion · reel"
          title="Motion that reads, even paused"
          blurb="A looping reel of interface motion and brand film, with a filmstrip of stills pulled from it — so the work lands whether or not it’s playing."
        />
        <BluePlaceholder ratio="ultrawide" label="Motion reel — looping video (FPO)" />
        <div className="mt-4">
          <BlueGrid
            cols={4}
            ratio="video"
            items={['Keyframe 01', 'Keyframe 02', 'Keyframe 03', 'Keyframe 04']}
          />
        </div>
        <ModuleCaption>Filmstrip — stills from the reel (FPO). Real build autoplays muted loops.</ModuleCaption>
      </div>

      {/* ── Visual languages (proof of direction) ───────────── */}
      <div>
        <AnchorHeader
          kicker="Direction · languages"
          title="I’ve defined visual languages, not just assets"
          role="Mindbody · CBTL"
          blurb="Documented systems: Mindbody’s illustration (“2 Pillars: Relatable, Purposeful”) and motion (“3 Pillars: Calming, Reactive, Guiding”), and CBTL’s watercolor art direction."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-7">
          <BluePlaceholder ratio="portrait" label="Illustration language — Mindbody (FPO)" />
          <BluePlaceholder ratio="portrait" label="Motion language — Mindbody (FPO)" />
          <BluePlaceholder ratio="portrait" label="Watercolor AD — CBTL (FPO)" />
        </div>
      </div>

      {/* ── Art-direction boards ────────────────────────────── */}
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
            'Panda — campaign direction',
          ]}
        />
      </div>

      {/* ── Animated marks ──────────────────────────────────── */}
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
