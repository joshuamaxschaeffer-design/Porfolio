import { architecture as defaults } from './data'
import { ExplorationStack, type ExplorationItem } from './ExplorationStack'

interface ArchitectureProps {
  heading?: string
  intro?: string
  exploration?: { tag: string; items: ExplorationItem[] }
  crystalization?: {
    tag: string
    image: string
    items: { title: string; body: string }[]
  }
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-md border border-[var(--br-gold)] px-2.5 py-1 text-xs font-medium text-[var(--br-gold)]">
      {children}
    </span>
  )
}

export function ArchitectureSection(props: ArchitectureProps) {
  const heading = props.heading ?? defaults.heading
  const intro = props.intro ?? defaults.intro
  const exploration = props.exploration ?? defaults.exploration
  const crystalization = props.crystalization ?? defaults.crystalization

  return (
    <section className="br-container mt-28 md:mt-40">
      <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
        {heading}
      </h2>
      <p className="mt-4 max-w-3xl text-lg text-[var(--br-muted)] md:text-[22px]">{intro}</p>

      {/* Exploration — interactive image stack */}
      <div className="mt-14">
        <Tag>{exploration.tag}</Tag>
        <div className="mt-6">
          <ExplorationStack items={exploration.items} />
        </div>
      </div>

      {/* Crystalization — static image + text list. The tag sits directly above
          the text items; no dividers between items. */}
      <div className="mt-20 md:mt-28">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="md:order-1">
            <Tag>{crystalization.tag}</Tag>
            <ul className="mt-6 space-y-6 md:space-y-8">
              {crystalization.items.map((item) => (
                <li key={item.title}>
                  <h4 className="text-[24px] font-medium uppercase leading-[26px] text-[var(--br-ink)]">{item.title}</h4>
                  <p className="mt-2 max-w-md text-base leading-snug text-[var(--br-muted)]">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[var(--br-line)] bg-white md:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={crystalization.image} alt="Crystalization" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
