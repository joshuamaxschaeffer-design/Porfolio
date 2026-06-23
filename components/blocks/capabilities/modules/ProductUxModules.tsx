'use client'

import { useState } from 'react'
import { Reveal } from '../../../animation/Reveal'
import { CapDeviceFan } from '../../shared/CapDeviceFan'
import { ExplorationStack } from '../../baserate/ExplorationStack'
import { AnchorHeader, BlueRail, BlueFlowRow, ModuleCard } from './primitives'

/** Section 01 — Product & UX work modules (grey section, light tone). */
export function ProductUxModules({ dark = false }: { dark?: boolean }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Anchor A — Raising Cane's (consumer, mobile) — device fan + receding stack */}
      <ModuleCard dark={dark}>
        <AnchorHeader
          dark={dark}
          onCard
          kicker="Anchor · Consumer"
          title="Raising Cane’s — the “Caniac” ordering app"
          role="Lead Designer → Art Director"
          blurb="The full ordering product, web and native — onboarding, menu, scan-to-earn loyalty, group ordering, and checkout."
        />
        <CapDeviceFan
          dark={dark}
          screens={[
            { src: '/capabilities/canes/new-onboarding.webp', alt: 'Cane’s onboarding — Clickin’ for Chicken' },
            { src: '/capabilities/canes/new-pdp-combo.webp', alt: 'Cane’s product detail — The Box Combo' },
            { src: '/capabilities/canes/new-pdp-drink.webp', alt: 'Cane’s drink customization — Unsweet Tea' },
            { src: '/capabilities/canes/new-pickup.webp', alt: 'Cane’s pickup options' },
            { src: '/capabilities/canes/new-checkout.webp', alt: 'Cane’s checkout — GeoTrack order' },
          ]}
        />
      </ModuleCard>

      {/* Anchor — Dave & Buster's app — receding ScreenStack + ordering flow */}
      <ModuleCard dark={dark}>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · Consumer"
          title="Dave & Buster’s — eat, play, one app"
          role="Product & UI Designer"
          blurb="The membership app that fuses dining and arcade — Power Card balance, food ordering, and play, in a bold dark interface."
        />
        <ExplorationStack
          cardAspect="9/19.5"
          fit="cover"
          maxW={300}
          items={[
            { title: 'Dashboard', body: 'Eat/Play toggling, a points balance, and deals tied to movies and menu — the dark UI keeps the energy of the room.', image: '/capabilities/dnb/app-1.webp' },
            { title: 'Recommendations', body: 'Personalized “try these” games and food, surfaced on the home base.', image: '/capabilities/dnb/app-2.webp' },
            { title: 'Power Card', body: 'The chips balance, VR plays, and tickets — the card, made digital.', image: '/capabilities/dnb/app-4.webp' },
            { title: 'Onboarding', body: 'Two clear ways to start playing — digital or plastic.', image: '/capabilities/dnb/app-5.webp' },
          ]}
        />
        <div className="mt-10">
          <p className="br-data mb-4 text-[11px] uppercase tracking-[0.12em] text-[var(--br-gold)]">The ordering flow</p>
          <BlueFlowRow
            dark={dark}
            steps={[
              { label: 'Menu', src: '/capabilities/dnb/app-toolkit-1.webp' },
              { label: 'Category', src: '/capabilities/dnb/app-toolkit-2.webp' },
              { label: 'Item + upsell', src: '/capabilities/dnb/app-toolkit-3.webp' },
              { label: 'Your bag', src: '/capabilities/dnb/app-toolkit-4.webp' },
              { label: 'Confirmation', src: '/capabilities/dnb/app-toolkit-5.webp' },
            ]}
          />
        </div>
      </ModuleCard>

      {/* Anchor — Dave & Buster's KIOSK — tall floor-standing kiosk + clean row */}
      <ModuleCard dark={dark}>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · In-venue kiosk"
          title="Dave & Buster’s — the self-order kiosk"
          role="UX + UI Designer"
          blurb="A floor-standing self-order kiosk — designed for a big touchscreen at arm’s length, not a phone in the hand. Wireframed end-to-end, then finished."
        />
        <KioskScene dark={dark} />
      </ModuleCard>

      {/* Anchor — Trees UX flow + receding finished-UI stack */}
      <ModuleCard dark={dark}>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · UX flow"
          title="Trees — from goal to action plan"
          role="UX Designer"
          blurb="A self-improvement app that turns a vague goal into a ranked, matched action plan. The core UX, step by step."
        />
        <div className="mt-2">
          <BlueFlowRow
            dark={dark}
            steps={[
              { label: '1 · Onboarding', src: '/capabilities/trees/wire-1.webp' },
              { label: '2 · Empty dashboard', src: '/capabilities/trees/wire-2.webp' },
              { label: '3 · Pick a goal', src: '/capabilities/trees/wire-3.webp' },
              { label: '4 · Your goal', src: '/capabilities/trees/wire-4.webp' },
              { label: '5 · Action plans', src: '/capabilities/trees/wire-5.webp' },
              { label: '6 · Track + rate', src: '/capabilities/trees/wire-6.webp' },
            ]}
          />
        </div>
        <div className="mt-12">
          <p className="br-data mb-2 text-[11px] uppercase tracking-[0.12em] text-[var(--br-gold)]">Then · the finished UI</p>
          <h4 className="br-heading mb-6 text-[clamp(1.15rem,2.4vw,1.5rem)] leading-tight text-[var(--br-ink)]">Wireframe to product</h4>
          <ExplorationStack
            cardAspect="9/19.5"
            fit="cover"
            maxW={300}
            items={[
              { title: 'Goal created', body: 'A branded success moment — “91% of people like you complete this goal.”', image: '/capabilities/trees/ui-1.webp' },
              { title: 'Action plans', body: 'Matched plans as clean cards, ranked by fit.', image: '/capabilities/trees/ui-2.webp' },
              { title: 'Plan detail', body: 'A real task checklist with a clear add-to-plan CTA.', image: '/capabilities/trees/ui-3.webp' },
            ]}
          />
        </div>
      </ModuleCard>

      {/* Breadth rail — full width, shared draggable carousel + app icons outside the screens */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Breadth"
          title="A dozen more products, four form factors"
          blurb="Beyond the anchors: consumer apps, an investor platform, kiosks, POS, and ordering web across the rest of the roster — including the flagship case-study products."
        />
        <BlueRail
          dark={dark}
          ratio="phone"
          items={[
            { label: 'Raising Cane’s — app', src: '/capabilities/canes/ui-drink-1.webp', icon: '/capabilities/logos/raising-canes.svg' },
            { label: 'CBTL — iOS app', src: '/capabilities/cbtl/ui-2.webp', icon: '/capabilities/logos/authored/jubilee.png' },
            { label: 'Dave & Buster’s — app', src: '/capabilities/dnb/app-1.webp', icon: '/capabilities/logos/dave-and-busters.svg' },
            { label: 'Wingstop — ordering', src: '/capabilities/breadth/wingstop.webp' },
            { label: 'Blaze — Android app', src: '/capabilities/blaze/android-2-delivery-tracker.webp' },
            { label: 'Trees — self-improvement', src: '/capabilities/trees/ui-1.webp', icon: '/capabilities/logos/authored/trees.svg' },
            'Panda Express — app',
            'True Food Kitchen — web',
            'Noodles & Co. — ordering',
          ]}
        />
      </div>
    </div>
  )
}

/**
 * KioskScene — ONE screen inside a tall floor-standing kiosk (McDonald's-style),
 * with the rest of the flow in a clean LEFT-TO-RIGHT row to its right, top-aligned
 * with the kiosk screen, NOT rotated. A Wireframe⇄Finished toggle swaps both.
 */
function KioskScene({ dark = false }: { dark?: boolean }) {
  const [ui, setUi] = useState(true)
  const set = ui
    ? ['/capabilities/dnb/kiosk-ui-1.webp', '/capabilities/dnb/kiosk-ui-2.webp', '/capabilities/dnb/kiosk-ui-3.webp', '/capabilities/dnb/kiosk-ui-5.webp']
    : ['/capabilities/dnb/kiosk-ux-1.webp', '/capabilities/dnb/kiosk-ux-2.webp', '/capabilities/dnb/kiosk-ux-3.webp', '/capabilities/dnb/kiosk-ux-6.webp']
  const [hero, ...rest] = set
  return (
    <div>
      <div className="mb-8 inline-flex rounded-full border border-[var(--br-line)] p-1">
        {[
          { k: false, t: 'Wireframe (UX)' },
          { k: true, t: 'Finished (UI)' },
        ].map((o) => (
          <button
            key={o.t}
            type="button"
            onClick={() => setUi(o.k)}
            className="br-data rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.06em] transition-colors"
            style={ui === o.k ? { background: 'var(--br-ink)', color: '#fff' } : { color: 'var(--br-muted-2)' }}
          >
            {o.t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[260px_1fr] lg:gap-12">
        {/* tall floor-standing kiosk — one screen */}
        <Reveal>
          <div className="mx-auto w-full max-w-[230px]">
            <div className="relative rounded-[20px] border-[10px] border-[#1a1c22] bg-[#1a1c22] shadow-[0_30px_60px_-24px_rgba(7,14,44,0.5)]">
              <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/20" />
              <div className="overflow-hidden rounded-[8px] bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero} alt="D&B kiosk — primary screen" className="aspect-[9/16] w-full object-cover object-top" loading="lazy" />
              </div>
              <div className="flex items-center justify-center py-1.5">
                <span className="h-1 w-1 rounded-full bg-white/25" />
              </div>
            </div>
            <div className="mx-auto h-3 w-10 bg-[#1a1c22]" />
            <div className="mx-auto h-40 w-24 rounded-b-[6px] bg-gradient-to-b from-[#23262d] via-[#1a1c22] to-[#14161b]" />
            <div className="mx-auto h-3 w-40 rounded-[4px] bg-[#14161b]" />
            <div className="mx-auto mt-1 h-1.5 w-48 rounded-full bg-black/10" />
            <p className={`br-data mt-4 text-center text-[11px] uppercase tracking-[0.1em] ${dark ? 'text-white/50' : 'text-[var(--br-muted-2)]'}`}>
              Floor-standing kiosk · ~32″ portrait touchscreen
            </p>
          </div>
        </Reveal>

        {/* the rest of the flow — clean left-to-right row, top-aligned, no rotation */}
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {rest.map((s, i) => (
            <figure key={s} className="overflow-hidden rounded-[14px] border border-[var(--br-line)] bg-white shadow-[0_18px_40px_-26px_rgba(7,14,44,0.4)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s} alt={`D&B kiosk — screen ${i + 2}`} className="aspect-[9/16] w-full object-cover object-top" loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
