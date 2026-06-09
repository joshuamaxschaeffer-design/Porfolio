import { designSystems as defaults } from './data'
import { ScalabilityTimeline } from './ScalabilityTimeline'
import { HandoffSection } from './handoff/HandoffSection'
import { AIPrototypingPanel } from './AIPrototypingPanel'

interface DesignSystemsProps {
  heading?: string
  componentsBody?: string
  scalabilityBody?: string
}

/**
 * DESIGN SYSTEMS & IMPLEMENTATION — the dark closing section of the case study.
 *
 * The whole case study above runs on white/grey; this section flips to near-
 * black for the "how it shipped" coda. Pattern per panel: a bold uppercase
 * label, a one-line description, then the artifact.
 *
 *   1. Component Libraries — the real Figma artifact on a white card.
 *   2. Scalability        — a 3D timeline of screens receding into the distance.
 *   (Handoff + AI Prototyping panels follow once designed.)
 */
export function DesignSystemsSection(props: DesignSystemsProps) {
  const heading = props.heading ?? defaults.heading
  const components = defaults.components
  const scalability = defaults.scalability

  return (
    <section className="relative bg-[#070a14] py-24 text-white md:py-32">
      <div className="br-container">
        {/* Section header */}
        <h2 className="text-[32px] font-medium uppercase leading-none text-white md:text-[40px]">{heading}</h2>

        {/* ----- Panel 1: Component Libraries ----- */}
        <div className="mt-20 md:mt-28">
          <PanelHeader title={components.title} body={props.componentsBody ?? components.body} />
          {/* Static, pixel-perfect — no transform/animation (those rasterize and
              soften the image). Plain HD artifact on a white card. */}
          <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)] md:mt-12">
            {/* Mobile: an inner zoom layer 2× the card width crops the board off
                the right so the components read at a legible size; desktop fits
                the whole board. The DIV (not the img) carries the width so the
                global `img{max-width:100%}` reset can't clamp it. */}
            <div className="md:!w-full" style={{ width: 'calc(200% + 0px)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={components.artifact} alt="Baserate component library" className="block w-full" />
            </div>
          </div>
        </div>

        {/* ----- Panel 2: Scalability ----- */}
        <div className="mt-28 md:mt-40">
          <PanelHeader title={scalability.title} body={props.scalabilityBody ?? scalability.body} />
        </div>
      </div>

      {/* The 3D timeline bleeds full-width (outside the editorial column) so the
          frames have room to recede toward the top-right edge of the panel. */}
      <div className="mt-6 md:mt-10">
        <ScalabilityTimeline />
      </div>

      {/* ----- Panel 3: Handoff (live UI + code box) ----- */}
      <HandoffSection />

      {/* ----- Panel 4: AI Prototyping (prototype video + Claude UI overlay) ----- */}
      <AIPrototypingPanel />
    </section>
  )
}

/** Uppercase label + muted one-liner, matching the Figma panel headers. */
function PanelHeader({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-[20px] font-semibold uppercase leading-tight text-white md:text-[24px]">{title}</h3>
      <p className="br-body mt-3 text-[16px] leading-relaxed text-white/60 md:text-[18px]">{body}</p>
    </div>
  )
}
