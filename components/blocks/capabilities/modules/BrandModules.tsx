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
            { src: '/capabilities/blaze/logo-1-blaze-wordmark.png', label: 'Master wordmark' },
            { src: '/capabilities/blaze/logo-3-extract-horizontal.png', label: 'Extract' },
            { src: '/capabilities/blaze/logo-4-extract-vertical.png', label: 'Extract · stacked' },
            { src: '/capabilities/blaze/logo-5-extract-appicon.png', label: 'Extract · icon' },
            { src: '/capabilities/blaze/logo-7-center-horizontal.png', label: 'Center' },
            { src: '/capabilities/blaze/logo-8-center-vertical.png', label: 'Center · stacked' },
            { src: '/capabilities/blaze/logo-10-warehouse-horizontal.png', label: 'Warehouse' },
            { src: '/capabilities/blaze/logo-11-warehouse-vertical.png', label: 'Warehouse · stacked' },
            { src: '/capabilities/blaze/logo-9-chevron-appicon.png', label: 'App icon' },
          ].map((l, i) => (
            <Reveal key={l.label} delay={i * 25}>
              <figure className="flex h-full items-center justify-center rounded-[var(--br-card-radius)] border border-white/10 bg-white p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.src} alt={`Blaze — ${l.label}`} className="max-h-16 w-full object-contain" loading="lazy" />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

    </div>
  )
}
