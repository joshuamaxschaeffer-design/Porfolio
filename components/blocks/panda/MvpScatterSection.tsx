import { releases as defaults } from './data'

const P = '/panda/mvp'

/**
 * Section 3 (part 3) — "MVP Section 3" device-scatter band. A full-bleed Panda-red
 * band that follows the 2020-Pivot two-card grid: six tilted phone screens fanned
 * across a receding diagonal, framed by four food props (cookie, firecracker-shrimp
 * bowl, chopsticks, firecracker-chicken bowl) and a bordered heading plate.
 *
 * Placement is 1:1 from Figma node 283:24935 ("MVP Section 3", 1443 × 734.47,
 * bg #d1282e). Every phone shares a 15.43° tilt; positions/sizes are normalized to
 * percentages of the band so the whole composition scales with width. Phones and
 * props clip off the top/bottom edges exactly as in the mock. Each element carries
 * a stable `data-anim` hook so the pieces can be animated (drift/parallax) later —
 * there is no motion wired yet.
 *
 * Assets in /public/panda/mvp.
 */

/** One tilted phone. cx/cy = center as % of the band; w = width as % of band width. */
interface Phone {
  id: string
  img: string
  cx: number
  cy: number
  w: number
  alt: string
}

/** Back → front paint order (matches the Figma layer order). */
const PHONES: Phone[] = [
  { id: 'mvp-phone-6', img: 'screen4', cx: 81.261, cy: 106.908, w: 18.864, alt: '' },
  { id: 'mvp-phone-5', img: 'screen4', cx: 54.858, cy: -1.458, w: 18.864, alt: '' },
  { id: 'mvp-phone-1', img: 'screen1', cx: 27.144, cy: 48.342, w: 18.788, alt: 'Panda Express app — reorder your recent order' },
  { id: 'mvp-phone-2', img: 'screen2', cx: 43.722, cy: 78.047, w: 18.802, alt: 'Panda Express app — My Orders, recent and favorites' },
  { id: 'mvp-phone-3', img: 'screen3', cx: 65.564, cy: 70.462, w: 18.819, alt: 'Panda Express app — Build Your Own Plate' },
  { id: 'mvp-phone-4', img: 'screen3', cx: 76.791, cy: -8.642, w: 18.819, alt: '' },
]

/** Food props framing the scatter. left/top/width as % of the band. */
const PROPS = [
  { id: 'mvp-prop-cookie', img: 'cookie', left: 5.96, top: 10.62, w: 11.227 },
  { id: 'mvp-prop-shrimp', img: 'shrimp', left: -10.949, top: 33.085, w: 25.641 },
  { id: 'mvp-prop-chopsticks', img: 'chopsticks', left: 82.536, top: -17.019, w: 19.196 },
  { id: 'mvp-prop-firecracker', img: 'firecracker-chicken', left: 84.546, top: 26.005, w: 25.364 },
]

export function MvpScatterSection() {
  return (
    <section
      id="mvp-reordering"
      aria-label="Seamless simple reordering"
      data-anim="mvp-scatter-section"
      className="relative isolate w-full overflow-hidden bg-[var(--px-red)]"
    >
      {/* ── DESKTOP / TABLET (≥1024px): exact Figma scatter ──────────────
          A fixed-aspect band; every node is positioned as a % of it, so the
          whole composition scales with width and clips top/bottom like the mock. */}
      <div
        data-anim="mvp-scatter-stage"
        className="relative mx-auto hidden aspect-[1443/734.47] w-full max-w-[1600px] lg:block"
      >
        {PHONES.map((p) => (
          <div
            key={p.id}
            data-anim={p.id}
            className="absolute"
            style={{
              left: `${p.cx}%`,
              top: `${p.cy}%`,
              width: `${p.w}%`,
              transform: 'translate(-50%, -50%) rotate(15.43deg)',
              transformOrigin: 'center center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${P}/${p.img}.webp`}
              alt={p.alt}
              aria-hidden={p.alt === '' ? true : undefined}
              className="block w-full max-w-none"
            />
          </div>
        ))}

        {PROPS.map((pr) => (
          <div
            key={pr.id}
            data-anim={pr.id}
            className="pointer-events-none absolute"
            style={{ left: `${pr.left}%`, top: `${pr.top}%`, width: `${pr.w}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P}/${pr.img}.webp`} alt="" aria-hidden className="block w-full max-w-none" />
          </div>
        ))}

        {/* heading plate — top layer, red fill, hairline white border */}
        <div
          data-anim="mvp-scatter-heading"
          className="absolute left-[5.128%] top-[2.178%] flex w-[89.744%] flex-col gap-3 rounded-[10px] border border-white/60 bg-[var(--px-red)] p-7 lg:p-10"
        >
          <h2 className="text-[22px] font-semibold uppercase leading-tight tracking-wide text-white lg:text-2xl">
            {defaults.scatter.title}
          </h2>
          <p className="text-base leading-snug text-white/90 lg:text-xl">{defaults.scatter.body}</p>
        </div>
      </div>

      {/* ── MOBILE (<1024px): legible reduced fan ────────────────────────
          The wide 6-phone scatter shrinks phones to slivers on a phone screen,
          so below lg we show a calmer 3-phone fan in a taller band. Heading
          plate reflows (text wraps, larger tap-friendly padding). Two props
          peek from the corners for continuity; phones stay readable and nothing
          is clipped at the left/right edges. Same `data-anim` hooks reused. */}
      <div data-anim="mvp-scatter-mobile" className="relative mx-auto w-full max-w-[520px] px-5 pb-14 pt-10 lg:hidden">
        {/* heading plate */}
        <div
          data-anim="mvp-scatter-heading"
          className="relative z-30 flex flex-col gap-2.5 rounded-[10px] border border-white/60 bg-[var(--px-red)] p-6 text-center"
        >
          <h2 className="text-[22px] font-semibold uppercase leading-tight tracking-wide text-white">
            {defaults.scatter.title}
          </h2>
          <p className="text-[15px] leading-snug text-white/90">{defaults.scatter.body}</p>
        </div>

        {/* phone fan — three tilted screens, sized so they overlap without
            running past the side edges; a portrait stage gives them height. */}
        <div data-anim="mvp-scatter-stage-mobile" className="relative mt-8 aspect-[360/420] w-full">
          {/* corner props (subtle, behind phones) */}
          <div data-anim="mvp-prop-shrimp" className="pointer-events-none absolute -left-[12%] bottom-[2%] z-0 w-[42%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P}/shrimp.webp`} alt="" aria-hidden className="block w-full max-w-none" />
          </div>
          <div data-anim="mvp-prop-chopsticks" className="pointer-events-none absolute -right-[10%] -top-[6%] z-0 w-[34%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P}/chopsticks.webp`} alt="" aria-hidden className="block w-full max-w-none" />
          </div>

          {/* back phone */}
          <div data-anim="mvp-phone-3" className="absolute left-[50%] top-[44%] z-10 w-[46%]"
            style={{ transform: 'translate(-50%, -50%) rotate(15.43deg)', transformOrigin: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P}/screen3.webp`} alt="Panda Express app — Build Your Own Plate" className="block w-full max-w-none" />
          </div>
          {/* mid phone */}
          <div data-anim="mvp-phone-2" className="absolute left-[68%] top-[58%] z-20 w-[46%]"
            style={{ transform: 'translate(-50%, -50%) rotate(15.43deg)', transformOrigin: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P}/screen2.webp`} alt="Panda Express app — My Orders" className="block w-full max-w-none" />
          </div>
          {/* front phone */}
          <div data-anim="mvp-phone-1" className="absolute left-[33%] top-[60%] z-20 w-[48%]"
            style={{ transform: 'translate(-50%, -50%) rotate(15.43deg)', transformOrigin: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${P}/screen1.webp`} alt="Panda Express app — reorder your recent order" className="block w-full max-w-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
