'use client'

import { BluePlaceholder } from '../BluePlaceholder'
import { AnchorHeader, ModuleCaption } from './primitives'

/**
 * Section 06 — Leadership & How I Work (closing band, bluescale FPO).
 *
 * Not a gallery — the artifacts of operating: the illustration program pitched
 * internally, the systems other teams extend, and building with AI in the loop.
 */
export function LeadershipModules() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
      <div>
        <AnchorHeader kicker="Advocacy" title="Pitched, not just made" blurb="The internal deck that sold Mindbody on an illustration program — then the style guide that delivered it." />
        <BluePlaceholder ratio="video" label="Illustration proposal deck (FPO)" />
        <ModuleCaption>Design leadership = selling the idea, then shipping the system.</ModuleCaption>
      </div>
      <div>
        <AnchorHeader kicker="Systems" title="Built for handoff" blurb="Toolkits and languages other designers and engineers extend without me in the room." />
        <BluePlaceholder ratio="video" label="Toolkit / system handoff (FPO)" />
        <ModuleCaption>Lead → Art Director → Head of Design.</ModuleCaption>
      </div>
      <div>
        <AnchorHeader kicker="AI prototyping" title="Building with models" blurb="Designing and shipping with AI in the loop — an investor-grade product (Baserate) prototyped live." />
        <BluePlaceholder ratio="video" label="AI prototyping — UI over build video (FPO)" />
        <ModuleCaption>Real build = the Claude-UI-over-prototype-video panel.</ModuleCaption>
      </div>
    </div>
  )
}
