import { rebrand } from './data'

/**
 * Section 5 — orange → green. Before/after swatch rail, the mark large on its
 * green field, the icon exploration grid, and the texture story.
 */
export function RebrandSection() {
  return (
    <section
      id="rebrand"
      className="relative bg-[#fff6e8]"
      style={
        {
          '--br-ink': '#3a342e',
          '--br-body': '#4c453d',
          '--br-muted': '#73685c',
          '--br-muted-2': '#8a7f71',
          '--br-line': 'rgba(58,52,46,0.14)',
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45] mix-blend-multiply"
        style={{ backgroundImage: 'url(/unfold/texture/paper-cream.webp)', backgroundSize: '900px' }}
      />
      <div className="br-container relative z-[2] py-16 md:py-24">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          5. Rebrand
        </h2>
        <p className="mt-3 max-w-[34rem] text-lg text-[var(--br-body)] md:text-[20px]">{rebrand.intro}</p>

        {/* Before / after swatch rail */}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--br-line)] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="h-12 w-12 rounded-xl" style={{ background: rebrand.before.color }} />
              <span className="h-12 w-12 rounded-xl border border-[var(--br-line)]" style={{ background: '#fff6e8' }} />
            </div>
            <p className="br-data mt-3 text-[13px] uppercase tracking-wide text-[var(--br-muted)]">{rebrand.before.label}</p>
          </div>
          <div className="rounded-2xl border border-[var(--uf-green)] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="h-12 w-12 rounded-xl" style={{ background: rebrand.after.color }} />
              <span className="h-12 w-12 rounded-xl border border-[var(--br-line)]" style={{ background: '#fff6e8' }} />
              <span className="h-12 w-12 rounded-xl" style={{ background: '#1c1a17' }} />
            </div>
            <p className="br-data mt-3 text-[13px] uppercase tracking-wide text-[var(--uf-green)]">{rebrand.after.label}</p>
          </div>
        </div>

        {/* Mark + icon grid */}
        <div className="mt-8 grid items-stretch gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div
            className="flex items-center justify-center rounded-2xl p-10"
            style={{ background: rebrand.after.color }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rebrand.mark} alt="Unfold open-book mark" className="w-[46%] max-w-[220px]" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-[var(--br-line)] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rebrand.iconGrid} alt="App icon exploration grid" loading="lazy" className="block h-full w-full object-cover" />
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {rebrand.body.map((p) => (
            <p key={p.slice(0, 24)} className="text-[15px] leading-relaxed text-[var(--br-muted)]">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
