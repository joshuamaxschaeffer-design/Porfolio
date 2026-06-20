'use client'

import { Reveal } from '../../../animation/Reveal'
import { BluePlaceholder } from '../BluePlaceholder'
import { BrandWall } from '../BrandLogo'
import { pick } from '../brands'
import { AnchorHeader, ModuleCaption } from './primitives'

/**
 * Section 02 — Brand & Identity (BLACK section, dark tone).
 *
 * Equal grid of authored identities (every brand a peer — Blaze is just one
 * card). Then a brand-agnostic "how an identity gets built" artifact strip, and
 * the "worked within" logo wall. No single brand privileged.
 */
export function BrandModules({ dark = true }: { dark?: boolean }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Identities I built — equal grid, REAL logos */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Identities I built"
          title="Logos & systems, from scratch"
          blurb="Authored identities — each a complete system, not a logo file. Distinct from brands I’ve worked within. Several have animated marks."
        />
        <BrandWall
          dark={dark}
          cols={4}
          brands={pick('blaze', 'dopa', 'jubilee', 'rosetta', 'trees', 'baserate', 'journalytic')}
        />
        <ModuleCaption dark={dark}>Animated marks (Jubilee, Rosetta) loop here in the real build.</ModuleCaption>
      </div>

      {/* How an identity gets built — brand-agnostic artifact strip */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="The system"
          title="What every identity ships with"
          blurb="Each brand gets the full system — direction, logomark, clearspace, color, type, and in-context applications."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          {[
            'Direction board',
            'Logomark anatomy',
            'Clearspace & lockups',
            'Color system',
            'Type scale',
            'In-context applications',
          ].map((label, i) => (
            <Reveal key={label} delay={i * 30}>
              <BluePlaceholder ratio="video" dark={dark} label={label} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* Worked within — REAL logos */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Worked within"
          title="Brands I shipped inside"
          blurb="Established identities I designed product and applications for — a normalized logo wall, not claimed as authored."
        />
        <BrandWall
          dark={dark}
          cols={4}
          brands={pick(
            'panda', 'raisingCanes', 'daveAndBusters', 'trueFoodKitchen',
            'wingstop', 'cbtl', 'mindbody', 'samsung', 'vfCorp', 'pepsi',
            'dairyQueen', 'noodles',
          )}
        />
      </div>
    </div>
  )
}
