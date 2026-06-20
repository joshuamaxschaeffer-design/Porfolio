'use client'

import { Reveal } from '../../../animation/Reveal'
import { BluePlaceholder } from '../BluePlaceholder'
import { AnchorHeader, BlueGrid, ModuleCaption } from './primitives'

/**
 * Section 02 — Brand & Identity work modules (bluescale FPO, real layouts).
 *
 * Anchor: Blaze — the authored multi-sub-brand system, shown as the senior
 * brand-case artifact sequence (direction → logomark anatomy → clearspace →
 * color → type → applications).
 * Then: "Identities I built" wall (authored marks, incl. animated), kept clearly
 * separate from brands worked within.
 */

const BRAND_SEQUENCE: { step: string; label: string; ratio: 'wide' | 'ultrawide' }[] = [
  { step: 'Direction', label: 'Brand direction board — explorations', ratio: 'wide' },
  { step: 'Logomark', label: 'Logomark anatomy / construction grid', ratio: 'ultrawide' },
  { step: 'Clearspace', label: 'Logo + logotype · spacing specimen', ratio: 'ultrawide' },
  { step: 'Color', label: 'Color system — options → refined', ratio: 'ultrawide' },
  { step: 'Type', label: 'Type scale specimen', ratio: 'ultrawide' },
  { step: 'Applications', label: 'In-context — app, packaging, OOH', ratio: 'wide' },
]

export function BrandModules() {
  return (
    <div className="space-y-20 md:space-y-28">
      {/* ── Anchor — Blaze identity system (artifact sequence) ── */}
      <div>
        <AnchorHeader
          kicker="Anchor · Authored"
          title="Blaze — a multi-sub-brand system"
          role="Sole / Lead Designer + Brand"
          blurb="A full identity for a cannabis-tech suite: one parent mark plus five sub-brands (Warehouse, Center, Extract, Grow, Retail), each with its own lockups and app icon."
        />
        <div className="space-y-5 md:space-y-6">
          {BRAND_SEQUENCE.map(({ step, label, ratio }, i) => (
            <Reveal key={step} delay={i * 40}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center md:gap-8">
                <div className="md:col-span-3">
                  <p className="br-data text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--br-gold)]">
                    {String(i + 1).padStart(2, '0')} · {step}
                  </p>
                </div>
                <div className="md:col-span-9">
                  <BluePlaceholder ratio={ratio} label={label} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── Identities I built (authored marks wall) ──────────── */}
      <div>
        <AnchorHeader
          kicker="Identities I built"
          title="Logos & marks, from scratch"
          blurb="Authored identities — distinct from brands I’ve worked within. Several have animated marks."
        />
        <BlueGrid
          cols={3}
          ratio="square"
          items={[
            'Blaze — wordmark + icon',
            'DOPA — logo + app icon',
            'Jubilee — animated mark',
            'Rosetta — animated mark',
            'Trees — logo + leaf system',
            'Baserate / Journalytic — marks',
          ]}
        />
        <ModuleCaption>Animated marks (Jubilee, Rosetta) loop here in the real build.</ModuleCaption>
      </div>

      {/* ── Worked within (separate, honest framing) ──────────── */}
      <div>
        <AnchorHeader
          kicker="Worked within"
          title="Brands I shipped inside"
          blurb="Established identities I designed product and applications for — shown as a normalized logo row, not claimed as authored."
        />
        <BlueGrid
          cols={4}
          ratio="wide"
          items={[
            'Panda Express',
            'Raising Cane’s',
            'Dave & Buster’s',
            'True Food Kitchen',
            'Wingstop',
            'CBTL',
            'Mindbody',
            'Samsung',
            'VF Corp · Work Authority',
          ]}
        />
        <ModuleCaption>Normalized monochrome logo wall (FPO) — “worked within,” not authored.</ModuleCaption>
      </div>
    </div>
  )
}
