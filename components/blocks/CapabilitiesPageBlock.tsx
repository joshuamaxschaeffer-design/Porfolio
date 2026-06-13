import {
  CapabilitiesPage,
  type CapabilitiesPageProps,
} from './capabilities/CapabilitiesPage'
import type { CapabilityCategory } from './capabilities/data'

/**
 * Payload renderer for the `capabilitiesPage` block. Forwards CMS header
 * overrides into the composed page; blank fields fall back to the defaults in
 * capabilities/data.ts.
 *
 * The CMS stores each discipline's clients as an array of `{ name }` rows, so we
 * flatten those into the `string[]` the layout component expects. An empty
 * categories array means "use the built-in list".
 */
interface RawCategory {
  num?: string
  title?: string
  blurb?: string
  clients?: { name?: string }[]
}

interface CapabilitiesPageBlockProps
  extends Omit<CapabilitiesPageProps, 'categories'> {
  categories?: RawCategory[]
}

export function CapabilitiesPageBlock(props: CapabilitiesPageBlockProps) {
  const categories: CapabilityCategory[] | undefined = props.categories?.length
    ? props.categories.map((c, i) => ({
        num: c.num ?? String(i + 1).padStart(2, '0'),
        title: c.title ?? '',
        blurb: c.blurb ?? '',
        clients: (c.clients ?? [])
          .map((cl) => cl?.name)
          .filter((n): n is string => Boolean(n)),
      }))
    : undefined

  return (
    <CapabilitiesPage
      eyebrow={props.eyebrow}
      heading={props.heading}
      lead={props.lead}
      note={props.note}
      categories={categories}
    />
  )
}
