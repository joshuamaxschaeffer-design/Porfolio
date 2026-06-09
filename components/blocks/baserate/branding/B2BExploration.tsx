'use client'

/**
 * B2B Brand Exploration — two horizontal marquees scrolling in OPPOSITE
 * directions. Top row = alternate logo concepts, bottom row = name explorations.
 * Deliberately NO edge fade / blur / gradient (unlike the case-study carousels).
 * Pure CSS marquee (duplicated track) so it loops seamlessly and never blocks
 * the main thread.
 */

const ALT_LOGOS = ['1', '2', '3', '4', '5', '6', '7', '8', '10', '11', '12', '13', '14'].map(
  (n) => `/baserate/branding/altlogos/${n}.png`,
)

const ALT_NAMES = [
  'Delphi', 'Kaizen', 'Agility', 'Peak', 'Ionic', 'Journalytic',
  'Ferrratta', 'Schema', 'Streamline', 'Decisive', 'Flux',
].map((n) => `/baserate/branding/altnames/${n}.png`)

/** One seamless marquee row. The track is rendered twice and translated -50%. */
function MarqueeRow({
  items, dir, speed, cardClass, imgClass,
}: {
  items: string[]; dir: 'left' | 'right'; speed: number; cardClass: string; imgClass: string
}) {
  const track = [...items, ...items] // duplicate for seamless wrap
  return (
    <div className="br-noscrollbar relative w-full overflow-hidden">
      <div
        className="flex w-max gap-5"
        style={{
          animation: `br-marquee-${dir} ${speed}s linear infinite`,
        }}
      >
        {track.map((src, i) => (
          <div key={i} className={`shrink-0 ${cardClass}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" draggable={false} className={imgClass} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function B2BExploration() {
  return (
    <section className="bg-white py-20 md:py-[120px]">
      <div className="br-container mb-10 md:mb-14">
        <span className="br-data mb-5 inline-block rounded-[var(--br-tag-radius)] border border-[var(--br-gold)] px-3 py-1.5 text-[14px] uppercase text-[var(--br-gold)]">
          B2B Exploration
        </span>
        <h3 className="text-[28px] font-semibold uppercase tracking-tight text-[var(--br-ink)] md:text-[40px]">
          Exploring the B2B Brand
        </h3>
        <p className="mt-3 max-w-2xl text-[var(--br-muted)] md:text-lg">
          A wide exploration of names and logo directions for the B2B product before landing on Baserate.
        </p>
      </div>

      {/* Two rows, opposite directions. No fade/blur. */}
      <div className="flex flex-col gap-5">
        <MarqueeRow
          items={ALT_LOGOS}
          dir="left"
          speed={55}
          cardClass="h-[150px] w-[150px] overflow-hidden rounded-2xl border border-[var(--br-line)] bg-white md:h-[190px] md:w-[190px]"
          imgClass="h-full w-full object-contain p-2"
        />
        <MarqueeRow
          items={ALT_NAMES}
          dir="right"
          speed={48}
          cardClass="h-[120px] w-[220px] overflow-hidden rounded-2xl border border-[var(--br-line)] bg-white md:h-[150px] md:w-[280px]"
          imgClass="h-full w-full object-contain p-4"
        />
      </div>
    </section>
  )
}
