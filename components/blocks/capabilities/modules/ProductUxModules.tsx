'use client'

import { useState } from 'react'
import { Reveal } from '../../../animation/Reveal'
import { CapDeviceFan } from '../../shared/CapDeviceFan'
import { ExplorationStack } from '../../baserate/ExplorationStack'
import { AnchorHeader, BlueRail, BlueFlowRow, ModuleCaption, ModuleCard } from './primitives'

/** Section 01 — Product & UX work modules (grey section, light tone). */
export function ProductUxModules({ dark = false }: { dark?: boolean }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Process opener — how a product UX starts (from the Baserate build) */}
      <ExplorationModule dark={dark} />

      {/* Anchor A — Raising Cane's (consumer, mobile) — device fan + flow + Cover-Flow detail */}
      <ModuleCard dark={dark}>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · Consumer"
          title="Raising Cane’s — the “Caniac” ordering app"
          role="Lead Designer → Art Director"
          blurb="The full ordering product, web and native — onboarding, menu, scan-to-earn loyalty, group ordering, and checkout."
        />
        <CapDeviceFan
          dark={dark}
          caption="Raising Cane’s — native app screens"
          screens={[
            { src: '/capabilities/canes/ui-welcome.webp', alt: 'Cane’s welcome' },
            { src: '/capabilities/canes/ui-onboard.webp', alt: 'Cane’s onboarding' },
            { src: '/capabilities/canes/ui-home.webp', alt: 'Cane’s menu' },
            { src: '/capabilities/canes/ui-build.webp', alt: 'Cane’s order builder' },
            { src: '/capabilities/canes/ui-account.webp', alt: 'Cane’s account' },
            { src: '/capabilities/canes/ui-confirm.webp', alt: 'Cane’s order status' },
          ]}
        />
        <div className="mt-10">
          <p className="br-data mb-4 text-[11px] uppercase tracking-[0.12em] text-[var(--br-gold)]">The core flow</p>
          <BlueFlowRow
            dark={dark}
            steps={[
              { label: 'Welcome', src: '/capabilities/canes/ui-welcome.webp' },
              { label: 'Onboarding', src: '/capabilities/canes/ui-onboard.webp' },
              { label: 'Build the order', src: '/capabilities/canes/ui-build.webp' },
              { label: 'Account', src: '/capabilities/canes/ui-account.webp' },
              { label: 'Confirmation', src: '/capabilities/canes/ui-confirm.webp' },
              { label: 'Menu', src: '/capabilities/canes/ui-home.webp' },
            ]}
            caption="Onboarding → menu → checkout — the real ordering flow"
          />
        </div>
        {/* Cover-Flow detail of the drink-customization states (reuses the Baserate ExplorationStack) */}
        <div className="mt-12">
          <p className="br-data mb-2 text-[11px] uppercase tracking-[0.12em] text-[var(--br-gold)]">Detail · order customization</p>
          <h4 className="br-heading mb-6 text-[clamp(1.15rem,2.4vw,1.5rem)] leading-tight text-[var(--br-ink)]">Every modifier, dialed in</h4>
          <ExplorationStack
            items={[
              { title: 'Combo builder', body: 'Quantity steppers, swaps, and add-ons drawn to the same spec as the rest of the system.', image: '/capabilities/canes/ui-features.webp' },
              { title: 'Fountain drink', body: 'Pick a size, choose your drink, decide on ice — one decision per screen.', image: '/capabilities/canes/ui-drink-1.webp' },
              { title: 'Unsweet tea', body: 'The same builder, a different product — consistent controls everywhere.', image: '/capabilities/canes/ui-drink-2.webp' },
              { title: 'Add-ons', body: 'Up-sells and extras layered in without crowding the core choice.', image: '/capabilities/canes/ui-drink-3.webp' },
            ]}
          />
        </div>
      </ModuleCard>

      {/* Anchor — Dave & Buster's app — Cover-Flow swap + ordering flow */}
      <ModuleCard dark={dark}>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · Consumer"
          title="Dave & Buster’s — eat, play, one app"
          role="Product & UI Designer"
          blurb="The membership app that fuses dining and arcade — Power Card balance, food ordering, and play, in a bold dark interface."
        />
        <ExplorationStack
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
            caption="Browse → item → bag → thank-you — the food-ordering path"
          />
        </div>
      </ModuleCard>

      {/* Anchor — Dave & Buster's KIOSK — tall floor-standing kiosk + floating stack */}
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

      {/* Anchor — Trees UX flow */}
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
            caption="The wireframe flow — onboarding → goal → matched action plans → tracking"
          />
        </div>
        <div className="mt-12">
          <p className="br-data mb-2 text-[11px] uppercase tracking-[0.12em] text-[var(--br-gold)]">Then · the finished UI</p>
          <h4 className="br-heading mb-6 text-[clamp(1.15rem,2.4vw,1.5rem)] leading-tight text-[var(--br-ink)]">Wireframe to product</h4>
          <ExplorationStack
            items={[
              { title: 'Goal created', body: 'A branded success moment — “91% of people like you complete this goal.”', image: '/capabilities/trees/ui-1.webp' },
              { title: 'Action plans', body: 'Matched plans as clean cards, ranked by fit.', image: '/capabilities/trees/ui-2.webp' },
              { title: 'Plan detail', body: 'A real task checklist with a clear add-to-plan CTA.', image: '/capabilities/trees/ui-3.webp' },
            ]}
          />
        </div>
      </ModuleCard>

      {/* Breadth rail — full width, now the shared draggable carousel + app icons */}
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
        <ModuleCaption dark={dark}>Drag → · products across four form factors</ModuleCaption>
      </div>
    </div>
  )
}

/**
 * KioskScene — ONE screen inside a tall, floor-standing kiosk (McDonald's-style
 * proportions), with the rest of the flow floating as a static fanned stack to
 * its right. A Wireframe⇄Finished toggle swaps both.
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

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-12">
        {/* The tall floor-standing kiosk — one screen, McDonald's proportions */}
        <Reveal>
          <div className="mx-auto w-full max-w-[300px]">
            {/* head unit */}
            <div className="relative rounded-t-[26px] border-[12px] border-b-0 border-[#15171c] bg-[#15171c]">
              <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-white/20" />
              <div className="overflow-hidden rounded-[10px] bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero} alt="D&B kiosk — primary screen" className="aspect-[9/19] w-full object-cover object-top" loading="lazy" />
              </div>
              <div className="flex items-center justify-center py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              </div>
            </div>
            {/* neck + base pedestal */}
            <div className="mx-auto h-14 w-16 bg-gradient-to-b from-[#1c1f26] to-[#15171c]" />
            <div className="mx-auto h-4 w-44 rounded-[5px] bg-[#15171c]" />
            <p className={`br-data mt-3 text-center text-[11px] uppercase tracking-[0.1em] ${dark ? 'text-white/50' : 'text-[var(--br-muted-2)]'}`}>
              Floor-standing kiosk · ~32″ portrait touchscreen
            </p>
          </div>
        </Reveal>

        {/* The rest of the flow, floating as a static fanned stack to the right */}
        <div className="relative h-[360px] sm:h-[440px]">
          {rest.map((s, i) => (
            <figure
              key={s}
              className="absolute top-0 overflow-hidden rounded-[16px] border border-[var(--br-line)] bg-white"
              style={{
                left: `${i * 17}%`,
                width: '40%',
                maxWidth: 210,
                transform: `translateY(${i * 14}px) rotate(${i * 1.5 - 1}deg)`,
                zIndex: rest.length - i,
                boxShadow: '0 24px 50px -28px rgba(7,14,44,0.45)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s} alt={`D&B kiosk — screen ${i + 2}`} className="aspect-[9/16] w-full object-cover object-top" loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * ExplorationModule — the "how product UX starts" process card. A fanned deck of
 * feature pills on the left, exploration steps on the right with the active step
 * marked by a gold left border. Mirrors the Baserate build.
 */
const EXPLORE_STEPS = [
  { k: 'Workflow analysis', d: 'From research and interviews we identified the current behaviors and tools that defined an investor’s workflow.' },
  { k: 'Data hierarchy', d: 'Charted out the structure of user data across tools, features, individuals and teams.' },
  { k: 'Feature ecosystem', d: 'Mapped out the ecosystem of features and how they would interact with each other.' },
]
const FEATURE_PILLS = [
  'Self Contracts', 'Activity Log', 'Watchlist',
  'Entries', 'Home Dashboard', 'Admin',
  'Decisions', 'History', 'Reporting',
  'Cal Integration', 'Timeline', 'Notes',
  'AI + MCP', 'Blind Voting', 'Price Alerts',
  'Portfolio', 'Idea Management', 'Tags',
  'Task Lists', 'Messaging', 'Documents',
]

function ExplorationModule({ dark = false }: { dark?: boolean }) {
  const [step, setStep] = useState(2)
  return (
    <ModuleCard dark={dark}>
      <AnchorHeader
        dark={dark}
        kicker="How a product UX starts"
        title="From a tangle of features to a system"
        role="Baserate — investor platform"
        blurb="Before any screen: map the workflow, the data, and how every feature relates. The exploration that turned a long feature list into a coherent product."
      />
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="relative">
            <div className="absolute -left-3 top-3 h-full w-full rounded-[18px] border border-[var(--br-line)] bg-[var(--br-bg-2)]/60" aria-hidden />
            <div className="absolute -left-1.5 top-1.5 h-full w-full rounded-[18px] border border-[var(--br-line)] bg-[var(--br-bg-2)]/80" aria-hidden />
            <div className="relative rounded-[18px] border border-[var(--br-line)] bg-white p-5 shadow-[0_18px_44px_rgba(7,14,44,0.10)]">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {FEATURE_PILLS.map((p) => (
                  <span
                    key={p}
                    className="br-data truncate rounded-[8px] border border-[var(--br-line)] px-2.5 py-2 text-[11px] uppercase tracking-[0.04em] text-[var(--br-muted-2)]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <p className="br-data mb-5 text-[11px] uppercase tracking-[0.14em] text-[var(--br-gold)]">Exploration</p>
          <div className="space-y-6">
            {EXPLORE_STEPS.map((s, i) => {
              const on = i === step
              return (
                <button key={s.k} type="button" onMouseEnter={() => setStep(i)} onClick={() => setStep(i)} className="block w-full text-left">
                  <div className="pl-4 transition-all" style={{ borderLeft: `2px solid ${on ? 'var(--br-gold)' : 'transparent'}` }}>
                    <h4 className="br-heading text-[clamp(1rem,1.8vw,1.25rem)] font-semibold uppercase tracking-[0.02em] transition-colors" style={{ color: on ? 'var(--br-ink)' : 'var(--br-muted-2)' }}>
                      {s.k}
                    </h4>
                    <p className="mt-1 max-w-[46ch] text-[14px] leading-relaxed transition-colors" style={{ color: on ? 'var(--br-muted)' : 'var(--br-muted-2)' }}>
                      {s.d}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </ModuleCard>
  )
}
