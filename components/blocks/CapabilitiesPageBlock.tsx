import {
  CapabilitiesPage,
  type CapabilitiesPageProps,
} from './capabilities/CapabilitiesPage'
import type { CapabilitySection, MediaSlot } from './capabilities/data'

/**
 * Payload renderer for the `capabilitiesPage` block. Forwards CMS header
 * overrides into the composed case-study page; blank fields fall back to the
 * defaults in capabilities/data.ts.
 *
 * The CMS stores clients as `{ name }` rows and media as `{ label, ratio }`
 * rows; we flatten clients into the `string[]` the layout expects. An empty
 * sections array means "use the built-in sections + FPO placeholders".
 */
interface RawSection {
  id?: string
  num?: string
  title?: string
  intro?: string
  layout?: CapabilitySection['layout']
  clients?: { name?: string }[]
  media?: { label?: string; ratio?: MediaSlot['ratio'] }[]
}

interface CapabilitiesPageBlockProps
  extends Omit<CapabilitiesPageProps, 'sections'> {
  sections?: RawSection[]
}

export function CapabilitiesPageBlock(props: CapabilitiesPageBlockProps) {
  const sections: CapabilitySection[] | undefined = props.sections?.length
    ? props.sections.map((s, i) => ({
        id: s.id ?? `section-${i + 1}`,
        num: s.num ?? String(i + 1).padStart(2, '0'),
        title: s.title ?? '',
        intro: s.intro ?? '',
        layout: s.layout ?? 'mediaRight',
        clients: (s.clients ?? [])
          .map((c) => c?.name)
          .filter((n): n is string => Boolean(n)),
        media: (s.media ?? [])
          .filter((m) => m?.label)
          .map((m) => ({ label: m.label as string, ratio: m.ratio ?? 'video' })),
      }))
    : undefined

  return (
    <CapabilitiesPage
      eyebrow={props.eyebrow}
      heading={props.heading}
      lead={props.lead}
      note={props.note}
      sections={sections}
    />
  )
}
