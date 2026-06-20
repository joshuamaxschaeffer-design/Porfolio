'use client'

import { Reveal } from '../../../animation/Reveal'
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

      {/* Blaze — a full brand FAMILY (one master + sub-brands), all real logos */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Deep dive · brand family"
          title="Blaze — a master brand and its sub-brands"
          blurb="Not one logo — a family. A master wordmark plus distinct identities for each product line (Extract, Center, Warehouse), each with horizontal, stacked, and app-icon lockups."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          {[
            { src: '/capabilities/blaze/logo-2-blaze-wordmark-white.png', label: 'Master wordmark' },
            { src: '/capabilities/blaze/logo-3-extract-horizontal.png', label: 'Extract' },
            { src: '/capabilities/blaze/logo-4-extract-vertical.png', label: 'Extract · stacked' },
            { src: '/capabilities/blaze/logo-5-extract-appicon.png', label: 'Extract · icon' },
            { src: '/capabilities/blaze/logo-7-center-horizontal.png', label: 'Center' },
            { src: '/capabilities/blaze/logo-8-center-vertical.png', label: 'Center · stacked' },
            { src: '/capabilities/blaze/logo-10-warehouse-horizontal.png', label: 'Warehouse' },
            { src: '/capabilities/blaze/logo-11-warehouse-vertical.png', label: 'Warehouse · stacked' },
            { src: '/capabilities/blaze/logo-9-chevron-appicon.png', label: 'App icon' },
            { src: '/capabilities/blaze/logo-6-extract-icon-white.png', label: 'Glyph' },
          ].map((l, i) => (
            <Reveal key={l.label} delay={i * 25}>
              <figure className="flex h-full flex-col">
                <div className="flex flex-1 items-center justify-center rounded-[var(--br-card-radius)] border border-white/10 bg-white p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.src} alt={`Blaze — ${l.label}`} className="max-h-16 w-full object-contain" loading="lazy" />
                </div>
                <figcaption className="br-data mt-2 text-center text-[10px] uppercase tracking-[0.07em] text-[var(--br-muted-2)]">
                  {l.label}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <ModuleCaption dark={dark}>One system, three product lines — sub-brands that stay a family.</ModuleCaption>
      </div>

      {/* How an identity gets built — REAL brand artifacts */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="The system"
          title="What every identity ships with"
          blurb="Each brand gets the full system — direction, logomark construction, color, and in-context applications. A few from DOPA, Rosetta & Jubilee."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          {[
            { src: '/capabilities/brand/dopa-construction.webp', label: 'DOPA — logomark construction' },
            { src: '/capabilities/brand/dopa-mark.webp', label: 'DOPA — the mark', contain: true },
            { src: '/capabilities/brand/dopa-appicon.webp', label: 'DOPA — app icon', contain: true },
            { src: '/capabilities/brand/rosetta-system.webp', label: 'Rosetta — identity system' },
            { src: '/capabilities/brand/rosetta-applied.webp', label: 'Rosetta — applied' },
            { src: '/capabilities/brand/jubilee-applied.webp', label: 'Jubilee — in context' },
          ].map((a, i) => (
            <Reveal key={a.label} delay={i * 30}>
              <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-white/10 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.src}
                  alt={a.label}
                  className={`aspect-[16/10] w-full ${a.contain ? 'object-contain p-4' : 'object-cover'}`}
                  loading="lazy"
                />
                <figcaption className="br-data px-4 py-3 text-[11px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">
                  {a.label}
                </figcaption>
              </figure>
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
