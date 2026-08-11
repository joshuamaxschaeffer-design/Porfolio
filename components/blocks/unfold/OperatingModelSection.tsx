import { model } from './data'

/**
 * Section 4 — THE differentiator: how one designer ships a whole product.
 * Five pipeline steps as a connected rail, then the agent-fleet note as a
 * pull-quote card. Dark warm charcoal to set it apart from the craft sections.
 */
export function OperatingModelSection() {
  return (
    <section
      id="model"
      className="uf-dark relative overflow-hidden bg-[#1c1a17]"
      style={
        {
          '--br-ink': '#f5f2ed',
          '--br-body': '#d9d3ca',
          '--br-muted': '#a8a29e',
          '--br-muted-2': '#8a847e',
          '--br-line': 'rgba(245,242,237,0.13)',
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{ backgroundImage: 'url(/unfold/texture/paper-charcoal.webp)', backgroundSize: '900px' }}
      />
      <div className="br-container relative z-[2] py-16 md:py-24">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          4. Operating Model
        </h2>
        <p className="mt-3 max-w-[36rem] text-lg text-[var(--br-body)] md:text-[20px]">{model.intro}</p>

        <ol className="mt-12 grid gap-4 md:grid-cols-5 md:gap-3">
          {model.steps.map((s, i) => (
            <li key={s.n} className="relative rounded-2xl border border-[var(--br-line)] bg-[#262420] p-5">
              <span className="br-data text-[13px] text-[var(--uf-green)]">{s.n}</span>
              <h3 className="mt-2 text-[17px] font-medium leading-snug text-[var(--br-ink)]">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--br-muted)]">{s.body}</p>
              {i < model.steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-[9px] top-1/2 hidden h-[2px] w-[15px] bg-[var(--uf-green)] opacity-60 md:block"
                />
              )}
            </li>
          ))}
        </ol>

        <figure className="mt-12 max-w-[46rem] border-l-2 border-[var(--uf-green)] pl-6">
          <p className="text-[17px] leading-relaxed text-[var(--br-body)] md:text-[19px]">{model.fleetNote}</p>
          <figcaption className="br-data mt-4 text-[13px] uppercase tracking-wide text-[var(--br-muted-2)]">
            Parallel agent sessions · shared queues · claim files · one editor
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
