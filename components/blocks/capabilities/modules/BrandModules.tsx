'use client'

import { BrandWall } from '../BrandLogo'
import { pick } from '../brands'
import { AnchorHeader } from './primitives'

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
      </div>

      {/* What every identity ships with — BENTO of real in-context brand mockups */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="The system"
          title="What every identity ships with"
          blurb="Direction, logomark construction, color, and in-context applications — a few from DOPA, Rosetta & Jubilee."
        />
        <div className="grid auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[190px] md:grid-cols-4 md:gap-4">
          {[
            { src: '/capabilities/brand/rosetta-applied.webp', span: 'col-span-2 row-span-2', contain: false },
            { src: '/capabilities/brand/dopa-mark.webp', span: 'col-span-1 row-span-1', contain: true },
            { src: '/capabilities/brand/dopa-appicon.webp', span: 'col-span-1 row-span-1', contain: true },
            { src: '/capabilities/brand/dopa-mockup.webp', span: 'col-span-2 row-span-1', contain: false },
            { src: '/capabilities/brand/jubilee-applied.webp', span: 'col-span-2 row-span-1', contain: false },
            { src: '/capabilities/brand/dopa-construction.webp', span: 'col-span-2 row-span-1', contain: false },
          ].map((a) => (
            <figure key={a.src} className={`overflow-hidden rounded-[var(--br-card-radius)] border border-white/10 bg-white ${a.span}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.src} alt="" className={`h-full w-full ${a.contain ? 'object-contain p-5' : 'object-cover'}`} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>

    </div>
  )
}
