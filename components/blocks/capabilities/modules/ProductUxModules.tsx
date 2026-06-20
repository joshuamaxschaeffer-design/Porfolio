'use client'

import { useState } from 'react'
import { Reveal } from '../../../animation/Reveal'
import { PerspectiveDeviceGrid } from '../../shared/PerspectiveDeviceGrid'
import { SwipeStack } from '../../shared/SwipeStack'
import { AnchorHeader, BlueRail, BlueFlowRow, ModuleCaption, ModuleCard } from './primitives'

/** Section 01 — Product & UX work modules (grey section, light tone). */
export function ProductUxModules({ dark = false }: { dark?: boolean }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Process opener — how a product UX starts (from the Baserate build) */}
      <ExplorationModule dark={dark} />

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
        {/* Hover-scrub stack of the drink-customization detail screens */}
        <div className="mt-10 grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="br-data mb-2 text-[11px] uppercase tracking-[0.12em] text-[var(--br-gold)]">Detail · order customization</p>
            <h4 className="br-heading text-[clamp(1.15rem,2.4vw,1.5rem)] leading-tight text-[var(--br-ink)]">Every modifier, dialed in</h4>
            <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-[var(--br-muted-2)]">
              The drink and combo builders — quantity steppers, swaps, and add-ons — drawn to the same
              spec as the rest of the system. Hover or swipe to flip through the states.
            </p>
          </div>
          <SwipeStack
            maxW={300}
            pills={['Combo', 'Fountain', 'Unsweet', 'Add-ons']}
            screens={[
              { src: '/capabilities/canes/ui-features.webp', alt: 'Cane’s combo builder' },
              { src: '/capabilities/canes/ui-drink-1.webp', alt: 'Cane’s fountain drink' },
              { src: '/capabilities/canes/ui-drink-2.webp', alt: 'Cane’s unsweet tea' },
              { src: '/capabilities/canes/ui-drink-3.webp', alt: 'Cane’s drink add-ons' },
            ]}
          />
        </div>
      </ModuleCard>

      {/* Anchor — Dave & Buster's app (consumer, mobile) — aesthetic stacked screens */}
      <ModuleCard dark={dark}>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · Consumer"
          title="Dave & Buster’s — eat, play, one app"
          role="Product & UI Designer"
          blurb="The membership app that fuses dining and arcade — Power Card balance, food ordering, and play, in a bold dark interface."
        />
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <SwipeStack
            maxW={300}
            pills={['Dashboard', 'Recommend', 'Power Card', 'Onboard']}
            screens={[
              { src: '/capabilities/dnb/app-1.webp', alt: 'D&B offers dashboard' },
              { src: '/capabilities/dnb/app-2.webp', alt: 'D&B recommendations' },
              { src: '/capabilities/dnb/app-4.webp', alt: 'D&B Power Card balance' },
              { src: '/capabilities/dnb/app-5.webp', alt: 'D&B card onboarding' },
            ]}
          />
          <div className="md:order-first">
            <p className="br-data mb-2 text-[11px] uppercase tracking-[0.12em] text-[var(--br-gold)]">Membership · dining + play</p>
            <h4 className="br-heading text-[clamp(1.15rem,2.4vw,1.5rem)] leading-tight text-[var(--br-ink)]">A bold, branded home base</h4>
            <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-[var(--br-muted-2)]">
              Eat/Play toggling, a Power Card chips balance, deals tied to movies and menu — the dark
              UI keeps the energy of the room. Then the full food-ordering flow below.
            </p>
          </div>
        </div>
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

      {/* Anchor — Dave & Buster's KIOSK — UX→UI, with clear kiosk framing */}
      <ModuleCard dark={dark}>
        <AnchorHeader
          dark={dark}
          kicker="Anchor · In-venue kiosk"
          title="Dave & Buster’s — the self-order kiosk"
          role="UX + UI Designer"
          blurb="A floor-standing self-order kiosk — designed for a big touchscreen at arm’s length, not a phone in the hand. Wireframed end-to-end, then finished."
        />
        <KioskCompare dark={dark} />
      </ModuleCard>

      {/* Anchor — Trees UX flow (ported flow component) */}
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
        <div className="mt-10 grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="br-data mb-2 text-[11px] uppercase tracking-[0.12em] text-[var(--br-gold)]">Then · the finished UI</p>
            <h4 className="br-heading text-[clamp(1.15rem,2.4vw,1.5rem)] leading-tight text-[var(--br-ink)]">Wireframe to product</h4>
            <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-[var(--br-muted-2)]">
              The same flow, resolved: a goal-created moment, matched plans as clean cards, and a plan
              detail with a real task checklist. Hover or swipe to flip through.
            </p>
          </div>
          <SwipeStack
            maxW={300}
            pills={['Goal created', 'Action plans', 'Plan detail']}
            screens={[
              { src: '/capabilities/trees/ui-1.webp', alt: 'Trees goal created' },
              { src: '/capabilities/trees/ui-2.webp', alt: 'Trees action plans' },
              { src: '/capabilities/trees/ui-3.webp', alt: 'Trees plan detail' },
            ]}
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
          /* breadth */
          items={[
            { label: 'Raising Cane’s — app', src: '/capabilities/canes/ui-drink-1.webp' },
            { label: 'CBTL — iOS app', src: '/capabilities/cbtl/ui-2.webp' },
            { label: 'Dave & Buster’s — app', src: '/capabilities/dnb/app-1.webp' },
            { label: 'Wingstop — ordering', src: '/capabilities/breadth/wingstop.webp' },
            { label: 'Blaze — Android app', src: '/capabilities/blaze/android-2-delivery-tracker.webp' },
            { label: 'Trees — self-improvement', src: '/capabilities/trees/ui-1.webp' },
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
 * KioskCompare — shows the D&B self-order kiosk inside an unmistakable
 * floor-standing KIOSK frame (wide bezel + pedestal base + scale label), with a
 * Wireframe⇄Finished toggle so the UX→UI progression reads at a glance.
 */
function KioskCompare({ dark = false }: { dark?: boolean }) {
  const [ui, setUi] = useState(true)
  const screens = ui
    ? ['/capabilities/dnb/kiosk-ui-1.webp', '/capabilities/dnb/kiosk-ui-2.webp', '/capabilities/dnb/kiosk-ui-3.webp', '/capabilities/dnb/kiosk-ui-5.webp']
    : ['/capabilities/dnb/kiosk-ux-1.webp', '/capabilities/dnb/kiosk-ux-2.webp', '/capabilities/dnb/kiosk-ux-3.webp', '/capabilities/dnb/kiosk-ux-6.webp']
  const labels = ui ? ['Home', 'Menu', 'Item', 'Complete'] : ['Home', 'Menu', 'Browse', 'Pay']
  return (
    <div>
      {/* toggle */}
      <div className="mb-6 inline-flex rounded-full border border-[var(--br-line)] p-1">
        {[
          { k: false, t: 'Wireframe (UX)' },
          { k: true, t: 'Finished (UI)' },
        ].map((o) => (
          <button
            key={o.t}
            type="button"
            onClick={() => setUi(o.k)}
            className="br-data rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.06em] transition-colors"
            style={
              ui === o.k
                ? { background: 'var(--br-ink)', color: '#fff' }
                : { color: 'var(--br-muted-2)' }
            }
          >
            {o.t}
          </button>
        ))}
      </div>

      {/* the kiosk: a wide standing unit. Big bezel, brand light bar, pedestal. */}
      <div className="mx-auto" style={{ maxWidth: 880 }}>
        <div className="relative rounded-[28px] border-[10px] border-[#15171c] bg-[#15171c] shadow-[0_30px_70px_rgba(7,14,44,0.30)]">
          {/* top light bar to signal a standing unit */}
          <div className="mx-auto mb-2 h-1.5 w-24 rounded-full bg-white/20" />
          <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-[14px] bg-black sm:grid-cols-4">
            {screens.map((s, i) => (
              <figure key={s} className="relative bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s} alt={`D&B kiosk — ${labels[i]}`} className="aspect-[9/16] w-full object-cover object-top" loading="lazy" />
                <figcaption className="br-data absolute bottom-0 left-0 right-0 bg-black/55 px-2 py-1 text-center text-[9px] uppercase tracking-[0.08em] text-white/85">
                  {labels[i]}
                </figcaption>
              </figure>
            ))}
          </div>
          {/* camera + sensor dot row */}
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="h-1 w-1 rounded-full bg-white/20" />
          </div>
        </div>
        {/* pedestal base — the visual cue that says FLOOR-STANDING, not handheld */}
        <div className="mx-auto h-10 w-2/5 rounded-b-[6px] bg-gradient-to-b from-[#23262d] to-[#15171c]" />
        <div className="mx-auto h-3 w-3/5 rounded-[4px] bg-[#15171c]" />
        <p className="br-data mt-3 text-center text-[11px] uppercase tracking-[0.1em] text-[var(--br-muted-2)]">
          Floor-standing self-order kiosk · ~32″ portrait touchscreen
        </p>
      </div>
    </div>
  )
}

/**
 * ExplorationModule — the "how product UX starts" process card. A fanned deck of
 * feature pills on the left (the surface area of a product), and the exploration
 * steps on the right with the active step marked by a gold left border. Steps
 * advance on hover/auto so it reads as a process, mirroring the Baserate build.
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
        {/* fanned feature-pill card */}
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

        {/* exploration steps */}
        <div>
          <p className="br-data mb-5 text-[11px] uppercase tracking-[0.14em] text-[var(--br-gold)]">Exploration</p>
          <div className="space-y-6">
            {EXPLORE_STEPS.map((s, i) => {
              const on = i === step
              return (
                <button
                  key={s.k}
                  type="button"
                  onMouseEnter={() => setStep(i)}
                  onClick={() => setStep(i)}
                  className="block w-full text-left"
                >
                  <div
                    className="pl-4 transition-all"
                    style={{ borderLeft: `2px solid ${on ? 'var(--br-gold)' : 'transparent'}` }}
                  >
                    <h4
                      className="br-heading text-[clamp(1rem,1.8vw,1.25rem)] font-semibold uppercase tracking-[0.02em] transition-colors"
                      style={{ color: on ? 'var(--br-ink)' : 'var(--br-muted-2)' }}
                    >
                      {s.k}
                    </h4>
                    <p
                      className="mt-1 max-w-[46ch] text-[14px] leading-relaxed transition-colors"
                      style={{ color: on ? 'var(--br-muted)' : 'var(--br-muted-2)' }}
                    >
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
