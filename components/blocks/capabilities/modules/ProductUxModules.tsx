'use client'

import { Reveal } from '../../../animation/Reveal'
import { PerspectiveDeviceGrid } from '../../shared/PerspectiveDeviceGrid'
import { AnchorHeader, BlueRail, BlueFlowRow, ModuleCaption, ModuleCard } from './primitives'

/** Section 01 — Product & UX work modules (grey section, light tone). */
export function ProductUxModules({ dark = false }: { dark?: boolean }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Anchor A — Raising Cane's (consumer, mobile) — perspective grid + flow */}
      <ModuleCard dark={dark}>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · Consumer"
          title="Raising Cane’s — the “Caniac” ordering app"
          role="Lead Designer → Art Director"
          blurb="The full ordering product, web and native — onboarding, menu, scan-to-earn loyalty, group ordering, and checkout."
        />
        <Reveal>
          <PerspectiveDeviceGrid
            accent="#C8102E"
            cols={4}
            rows={2}
            caption="Raising Cane’s — native app screens"
            screens={[
              { src: '/capabilities/canes/canes-onboard-1.webp', alt: 'Cane’s onboarding' },
              { src: '/capabilities/canes/canes-menu.webp', alt: 'Cane’s menu' },
              { src: '/capabilities/canes/canes-onboard-2.webp', alt: 'Cane’s onboarding' },
              { src: '/capabilities/canes/canes-account.webp', alt: 'Cane’s account' },
              { src: '/capabilities/canes/canes-onboard-3.webp', alt: 'Cane’s onboarding' },
              { src: '/capabilities/canes/canes-confirm.webp', alt: 'Cane’s order confirmation' },
              { src: '/capabilities/canes/canes-onboard-4.webp', alt: 'Cane’s onboarding' },
              { src: '/capabilities/canes/canes-home.webp', alt: 'Cane’s home' },
            ]}
          />
        </Reveal>
        <div className="mt-10">
          <p className="br-data mb-4 text-[11px] uppercase tracking-[0.12em] text-[var(--br-gold)]">The core flow</p>
          <BlueFlowRow
            dark={dark}
            steps={[
              { label: 'Onboarding', src: '/capabilities/canes/canes-onboard-1.webp' },
              { label: 'Welcome', src: '/capabilities/canes/canes-onboard-2.webp' },
              { label: 'Build the order', src: '/capabilities/canes/canes-menu.webp' },
              { label: 'Account', src: '/capabilities/canes/canes-account.webp' },
              { label: 'Confirmation', src: '/capabilities/canes/canes-confirm.webp' },
              { label: 'Home', src: '/capabilities/canes/canes-home.webp' },
            ]}
            caption="Onboarding → menu → checkout — the real ordering flow"
          />
        </div>
      </ModuleCard>

      {/* Anchor B — Mindbody (B2B, desktop POS) — real desktop screens */}
      <ModuleCard dark={dark}>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · B2B"
          title="Mindbody — the system behind the counter"
          role="UI/IXD + Design-Systems Lead"
          blurb="Point-of-sale, payments, checkout, refunds, and reconciliation for a wellness platform — dense workflows that can’t break the power user."
        />
        <div className="grid grid-cols-1 gap-6 md:gap-7">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/capabilities/mindbody/mb-pos-1.webp"
              alt="Mindbody point-of-sale checkout"
              className="w-full rounded-[var(--br-card-radius)] border border-[var(--br-line)] object-cover shadow-[0_10px_30px_rgba(7,14,44,0.10)]"
              loading="lazy"
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
            <Reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/capabilities/mindbody/mb-pos-2.webp"
                alt="Mindbody retail checkout — payment"
                className="w-full rounded-[var(--br-card-radius)] border border-[var(--br-line)] object-cover shadow-[0_10px_30px_rgba(7,14,44,0.10)]"
                loading="lazy"
              />
            </Reveal>
            <Reveal delay={80}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/capabilities/mindbody/mb-pos-3.webp"
                alt="Mindbody retail checkout — cart"
                className="w-full rounded-[var(--br-card-radius)] border border-[var(--br-line)] object-cover shadow-[0_10px_30px_rgba(7,14,44,0.10)]"
                loading="lazy"
              />
            </Reveal>
          </div>
        </div>
        <ModuleCaption dark={dark}>Point-of-sale & checkout across the retail counter.</ModuleCaption>
      </ModuleCard>

      {/* Breadth rail — full width */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Breadth"
          title="A dozen more products, four form factors"
          blurb="Beyond the anchors: consumer apps, an investor platform, kiosks, POS, and ordering web across the rest of the roster — including the flagship case-study products."
        />
        <BlueRail
          dark={dark}
          fullBleed
          ratio="phone"
          items={[
            { label: 'Raising Cane’s — app', src: '/capabilities/breadth/canes.webp' },
            { label: 'CBTL — iOS app', src: '/capabilities/breadth/cbtl.webp' },
            { label: 'Wingstop — ordering', src: '/capabilities/breadth/wingstop.webp' },
            { label: 'Blaze — consumer app', src: '/capabilities/breadth/blaze-app.webp' },
            { label: 'Trees / Ipse — app', src: '/capabilities/breadth/trees.webp' },
            'Panda Express — app',
            'Dave & Buster’s — kiosk',
            'True Food Kitchen — web',
            'VF Corp — Work Authority LMS',
            'Noodles & Co. — ordering',
          ]}
        />
      </div>
    </div>
  )
}
