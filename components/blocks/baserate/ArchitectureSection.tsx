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
      <h2 className="text-[28px] font-medium leading-none text-[var(--br-ink)]">{heading}</h2>
      <p className="mt-3 max-w-2xl text-base text-neutral-600 md:text-lg">{intro}</p>

      {/* Exploration — interactive image stack */}
      <div className="mt-14">
        <Tag>{exploration.tag}</Tag>
        <div className="mt-6">
          <ExplorationStack items={exploration.items} />
        </div>
      </div>

      {/* Crystalization — static image + text list */}
      <div className="mt-20 md:mt-28">
        <Tag>{crystalization.tag}</Tag>
        <div className="mt-6 grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <ul className="md:order-1">
            {crystalization.items.map((item) => (
              <li key={item.title} className="border-t border-[var(--br-line)] py-5 first:border-t-0 md:py-6">
                <h4 className="text-base font-bold tracking-tight text-[var(--br-ink)] md:text-lg">{item.title}</h4>
                <p className="mt-1.5 text-sm leading-snug text-neutral-600">{item.body}</p>
              </li>
            ))}
          </ul>
          <div className="overflow-hidden rounded-2xl border border-[var(--br-line)] bg-neutral-900 md:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={crystalization.image} alt="Crystalization" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
