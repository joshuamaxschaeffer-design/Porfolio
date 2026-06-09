'use client'

/**
 * B2B Brand Exploration — two horizontal marquees scrolling in OPPOSITE
 * directions on the continuous blue gradient (no section bg of its own).
 * NAMES row on top, logo-concept boards below. Cards are edge-to-edge
 * object-cover (the name pngs are tall app screenshots with the name band in
 * the middle — covering keeps the name centered and visible). No border, no
 * edge fade, modest radius — matched to Figma.
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
  items, dir, speed, cardClass,
}: {
  items: string[]; dir: 'left' | 'right'; speed: number; cardClass: string
}) {
  const track = [...items, ...items]
  return (
    <div className="br-noscrollbar relative w-full overflow-hidden">
      <div
        className="flex w-max gap-[18px] md:gap-[26px]"
        style={{ animation: `br-marquee-${dir} ${speed}s linear infinite` }}
      >
        {track.map((src, i) => (
          <div
            key={i}
            className={`shrink-0 overflow-hidden rounded-[10px] bg-white shadow-[0_22px_44px_-20px_rgba(4,16,38,0.5)] ${cardClass}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" draggable={false} className="h-full w-full object-cover" style={{ objectPosition: '50% 49%' }} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function B2BExploration() {
  return (
    <section className="pb-20 md:pb-24">
      {/* Centered heading — copy per Figma */}
      <div className="br-container mb-10 text-center md:mb-12">
        <h3 className="text-[19px] font-semibold uppercase tracking-[0.05em] text-white md:text-[24px]">
          B2B Brand Exploration
        </h3>
        <p className="mx-auto mt-3 max-w-[620px] text-[15px] leading-relaxed text-white/90 md:text-[17px]">
          Starting from 200+ names, a thorough value assessment, and countless customer branding
          tests, one direction surfaced as a clear winner.
        </p>
      </div>

      {/* NAMES on top, logo boards below; opposite directions */}
      <div className="flex flex-col gap-[18px] md:gap-[26px]">
        <MarqueeRow
          items={ALT_NAMES}
          dir="left"
          speed={52}
          cardClass="h-[92px] w-[208px] md:h-[118px] md:w-[270px]"
        />
        <MarqueeRow
          items={ALT_LOGOS}
          dir="right"
          speed={58}
          cardClass="h-[136px] w-[136px] md:h-[178px] md:w-[178px]"
        />
      </div>
    </section>
  )
}
