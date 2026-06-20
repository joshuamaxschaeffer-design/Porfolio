import {
  CapabilitiesPage,
  type CapabilitiesPageProps,
} from './capabilities/CapabilitiesPage'

/**
 * Payload renderer for the `capabilitiesPage` block.
 *
 * The v3 Capabilities section composes its disciplines + work modules from
 * `capabilities/disciplines.ts` (not CMS-driven section rows), so this wrapper
 * only forwards the optional header overrides (eyebrow / heading / lead). Blank
 * fields fall back to the defaults in disciplines.ts.
 */
export function CapabilitiesPageBlock(props: CapabilitiesPageProps) {
  return (
    <CapabilitiesPage
      eyebrow={props.eyebrow}
      heading={props.heading}
      lead={props.lead}
    />
  )
}
