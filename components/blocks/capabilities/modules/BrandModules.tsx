'use client'

import { Reveal } from '../../../animation/Reveal'
import { BluePlaceholder } from '../BluePlaceholder'
import { DarkBand } from '../DarkBand'
import { BrandWall } from '../BrandLogo'
import { pick } from '../brands'
import { AnchorHeader, ModuleCaption } from './primitives'

/**
 * Section 02 — Brand & Identity work modules.
 *
 * Anchor (DARK band): Blaze — the authored multi-sub-brand system shown as the
 * senior brand-case artifact sequence. Then real logo walls: "Identities I
 * built" (authored, real marks) kept separate from "brands I worked within."
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
    <div className="space-y-16 md:space-y-20">
      {/* ── Anchor — Blaze identity system (dark cinematic) ──── */}
      <DarkBand
        eyebrow="Anchor · Authored"
        title="Blaze — a multi-sub-brand system"
        blurb="A full identity for a cannabis-tech suite: one parent mark plus five sub-brands (Warehouse, Center, Extract, Grow, Retail), each with its own lockups and app icon. Sole Designer + Brand."
      >
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
                  <BluePlaceholder ratio={ratio} dark label={label} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </DarkBand>

      {/* ── Identities I built (authored marks — REAL logos) ─── */}
      <div>
        <AnchorHeader
          kicker="Identities I built"
          title="Logos & marks, from scratch"
          blurb="Authored identities — distinct from brands I’ve worked within. Several have animated marks."
        />
        <BrandWall
          cols={3}
          brands={pick('blaze', 'dopa', 'jubilee', 'rosetta', 'trees', 'baserate', 'journalytic')}
        />
        <ModuleCaption>Animated marks (Jubilee, Rosetta) loop here in the real build.</ModuleCaption>
      </div>

      {/* ── Worked within (separate, honest framing) ──────────── */}
      <div>
        <AnchorHeader
          kicker="Worked within"
          title="Brands I shipped inside"
          blurb="Established identities I designed product and applications for — shown as a normalized logo wall, not claimed as authored."
        />
        <BrandWall
          cols={4}
          brands={pick(
            'panda',
            'raisingCanes',
            'daveAndBusters',
            'trueFoodKitchen',
            'wingstop',
            'cbtl',
            'mindbody',
            'samsung',
            'vfCorp',
          )}
        />
      </div>
    </div>
  )
}
