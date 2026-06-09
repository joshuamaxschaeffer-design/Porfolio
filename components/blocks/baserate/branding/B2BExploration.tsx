'use client'

/**
 * B2B Brand Exploration — two horizontal marquees scrolling in OPPOSITE
 * directions. NAMES row on TOP, logo concepts below. Cards float on the blue
 * field; centered heading; no border; modest corner radius; content vertically
 * centered so the names actually show. Deliberately NO edge fade / blur.
 */

const ALT_NAMES = [
  'Delphi', 'Kaizen', 'Agility', 'Peak', 'Ionic', 'Journalytic',
  'Ferrratta', 'Schema', 'Streamline', 'Decisive', 'Flux',
].map((n) => `/baserate/branding/altnames/${n}.png`)

const ALT_LOGOS = ['1', '2', '3', '4', '5', '6', '7', '8', '10', '11', '12', '13', '14'].map(
  (n) => `/baserate/branding/altlogos/${n}.png`,
)

/** One seamless marquee row (track duplicated, translated -50%). */
function MarqueeRow({
  items, dir, speed, cardClass, imgClass,
}: {
  items: string[]; dir: 'left' | 'right'; speed: number; cardClass: string; imgClass: string
}) {
  const track = [...items, ...items]
  return (
    <div className="br-noscrollbar relative w-full overflow-hidden">
      <div className="flex w-max gap-5" style={{ animation: `br-marquee-${dir} ${speed}s linear infinite` }}>
        {track.map((src, i) => (
          <div key={i} className={`flex shrink-0 items-center justify-center ${cardClass}`}>
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
    <section className="bg-[#2a5e9c] py-20 md:py-[120px]">
      {/* Centered heading */}
      <div className="br-container mb-12 text-center md:mb-16">
        <span className="br-data mb-5 inline-block rounded-[var(--br-tag-radius)] border border-white/40 px-3 py-1.5 text-[14px] uppercase text-white">
          B2B Exploration
        </span>
        <h3 className="text-[28px] font-semibold uppercase tracking-tight text-white md:text-[40px]">
          Exploring the B2B Brand
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-white/80 md:text-lg">
          A wide exploration of names and logo directions for the B2B product before landing on Baserate.
        </p>
      </div>

      {/* NAMES on top, logos below. Opposite directions. Cards float (no border,
          modest radius), content vertically centered. */}
      <div className="flex flex-col gap-5">
        <MarqueeRow
          items={ALT_NAMES}
          dir="left"
          speed={52}
          cardClass="h-[130px] w-[230px] overflow-hidden rounded-lg bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)] md:h-[160px] md:w-[290px]"
          imgClass="max-h-full max-w-full object-contain p-5"
        />
        <MarqueeRow
          items={ALT_LOGOS}
          dir="right"
          speed={58}
          cardClass="h-[150px] w-[150px] overflow-hidden rounded-lg bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)] md:h-[190px] md:w-[190px]"
          imgClass="max-h-full max-w-full object-contain p-2"
        />
      </div>
    </section>
  )
}
