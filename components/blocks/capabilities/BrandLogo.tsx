'use client'

/**
 * BrandLogo — renders a brand mark in a logo wall / rail.
 *
 * Real image where we have a clean asset (authored brands on disk + the four
 * case-study brands already in /public); otherwise a clean styled WORDMARK chip
 * in the brand's color. Uniform height, centered, so a heterogeneous wall still
 * reads intentional. `dark` swaps to light-friendly treatment for dark bands.
 */

export interface BrandDef {
  name: string
  /** public path to a real logo image, if we have a clean one */
  src?: string
  /** brand accent color for the styled wordmark fallback */
  color?: string
  /** wordmark text (defaults to name) */
  wordmark?: string
}

export function BrandLogo({ brand, dark = false }: { brand: BrandDef; dark?: boolean }) {
  if (brand.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={brand.src}
        alt={brand.name}
        className="max-h-10 w-auto max-w-[140px] object-contain md:max-h-12"
        loading="lazy"
      />
    )
  }
  // Styled wordmark fallback (clean, brand-colored)
  const color = brand.color ?? (dark ? '#e9eef7' : '#1a2233')
  return (
    <span
      className="select-none whitespace-nowrap text-[17px] font-semibold tracking-[-0.01em] md:text-[19px]"
      style={{ color }}
    >
      {brand.wordmark ?? brand.name}
    </span>
  )
}

/**
 * BrandWall — a normalized grid of brand marks on uniform tiles. Tiles give the
 * heterogeneous set a calm, premium rhythm (cards with a hairline + subtle hover
 * lift). Works on light or dark.
 */
export function BrandWall({
  brands,
  dark = false,
  cols = 4,
}: {
  brands: BrandDef[]
  dark?: boolean
  cols?: 3 | 4 | 5
}) {
  const colClass =
    cols === 5
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
      : cols === 3
        ? 'grid-cols-2 sm:grid-cols-3'
        : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
  // On dark sections, real brand logos are mostly dark-on-transparent, so they'd
  // vanish on a near-black tile. Give every tile a WHITE surface so logos always
  // read — and it looks like a premium "logo card" wall on dark.
  const tile = dark
    ? 'border-white/10 bg-white hover:border-white/30'
    : 'border-[var(--br-line)] bg-white hover:border-[var(--br-gold)]'
  return (
    <div className={`grid gap-3 md:gap-4 ${colClass}`}>
      {brands.map((b) => (
        <div
          key={b.name}
          className={`flex h-[88px] items-center justify-center rounded-[var(--br-card-radius)] border px-5 transition-all duration-300 hover:-translate-y-0.5 md:h-[104px] ${tile}`}
        >
          <BrandLogo brand={b} dark={false} />
        </div>
      ))}
    </div>
  )
}

/**
 * LogoMarquee — a slow, full-bleed auto-scrolling strip of real brand logos on
 * white pills. Pauses on hover. Instant "look who I've worked with" proof near
 * the hero. Pure CSS loop (cheap), edge-faded.
 */
export function LogoMarquee({ brands }: { brands: BrandDef[] }) {
  const doubled = [...brands, ...brands]
  return (
    <div
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden py-2"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      <div className="flex w-max animate-[cap-marquee_60s_linear_infinite] gap-4 hover:[animation-play-state:paused]">
        {doubled.map((b, i) => (
          <div
            key={`${b.name}-${i}`}
            className="flex h-[68px] w-[170px] shrink-0 items-center justify-center rounded-[12px] border border-[var(--br-line)] bg-white px-5"
          >
            <BrandLogo brand={b} dark={false} />
          </div>
        ))}
      </div>
      <style>{`@keyframes cap-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){.animate-\\[cap-marquee_60s_linear_infinite\\]{animation:none}}`}</style>
    </div>
  )
}
