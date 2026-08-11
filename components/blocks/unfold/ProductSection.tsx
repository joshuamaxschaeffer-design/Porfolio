import { product } from './data'
import { VisualPlaceholder } from './VisualPlaceholder'

const LIGHT_VARS = {
  '--br-ink': '#3a342e',
  '--br-body': '#4c453d',
  '--br-muted': '#73685c',
  '--br-muted-2': '#8a7f71',
  '--br-line': 'rgba(58,52,46,0.14)',
} as React.CSSProperties

/**
 * 3 · The product. The page's center of gravity: a gallery where captions do
 * the storytelling. One decision per caption, fifteen words or so each.
 */
export function ProductSection() {
  return (
    <section id="product" className="bg-white" style={LIGHT_VARS}>
      <div className="br-container py-16 md:py-24">
        <h2 className="text-[28px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[34px]">
          {product.heading}
        </h2>
        <p className="mt-3 text-lg text-[var(--br-muted)]">{product.intro}</p>

        {/* Masonry columns: mixed aspect ratios flow without grid gaps. */}
        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {product.cells.map((cell) =>
            cell.type === 'placeholder' ? (
              <VisualPlaceholder
                key={cell.label}
                label={cell.label}
                aspect={cell.aspect}
                className="mb-8 break-inside-avoid"
              />
            ) : (
              <figure key={cell.src} className="mb-8 break-inside-avoid">
                <div className="overflow-hidden rounded-[20px] shadow-[0_14px_38px_rgba(28,26,23,0.22)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cell.src} alt={cell.alt} className="block h-auto w-full" />
                </div>
                <figcaption className="mt-3 text-[14px] leading-snug text-[var(--br-muted)]">
                  {cell.caption}
                </figcaption>
              </figure>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
