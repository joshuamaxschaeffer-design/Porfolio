/**
 * BluePlaceholder — bluescale FPO image placeholder.
 *
 * The atom every Capabilities work-module uses while we lay out structure before
 * wiring real imagery. Light-blue fill + blue border + the classic diagonal
 * "image" cross glyph + a caption label so each slot says what art goes there.
 *
 * Swap-out plan: each placeholder maps 1:1 to a real export later (Figma frame /
 * disk asset). Keep the caption describing the exact intended asset.
 */

export type BlueRatio =
  | 'wide' // 16/9 — desktop / marketing
  | 'video' // 16/10
  | 'square'
  | 'portrait' // 3/4
  | 'tall' // 9/16 — phone screens
  | 'phone' // 9/19.5 — true phone aspect
  | 'ultrawide' // 21/9 — banners / reels
  | 'auto' // fill parent height (h-full)

const RATIO: Record<BlueRatio, string> = {
  wide: 'aspect-[16/9]',
  video: 'aspect-[16/10]',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  tall: 'aspect-[9/16]',
  phone: 'aspect-[9/19.5]',
  ultrawide: 'aspect-[21/9]',
  auto: 'h-full',
}

export interface BluePlaceholderProps {
  /** caption describing the real asset that will replace this */
  label?: string
  ratio?: BlueRatio
  /** rounded corners (default true) */
  rounded?: boolean
  /** dark-band treatment (deeper fill, lighter strokes) */
  dark?: boolean
  className?: string
}

export function BluePlaceholder({
  label,
  ratio = 'video',
  rounded = true,
  dark = false,
  className = '',
}: BluePlaceholderProps) {
  // light vs dark-band palette
  const fill = dark ? 'bg-[#1a2740]' : 'bg-[#dbe6fb]'
  const border = dark ? 'border-[#33486f]' : 'border-[#9db8e8]'
  const stroke = dark ? 'text-[#33486f]' : 'text-[#9db8e8]'
  const chip = dark ? 'bg-[#2a3c5e]' : 'bg-[#bcd0f4]'
  const glyph = dark ? 'text-[#7e9bd4]' : 'text-[#3f66b5]'
  const text = dark ? 'text-[#7e9bd4]' : 'text-[#3f66b5]'
  return (
    <div
      className={`relative w-full overflow-hidden border ${fill} ${border} ${
        RATIO[ratio]
      } ${rounded ? 'rounded-[var(--br-card-radius)]' : ''} ${className}`}
    >
      {/* diagonal image-X glyph */}
      <svg
        aria-hidden
        className={`absolute inset-0 h-full w-full ${stroke}`}
        preserveAspectRatio="none"
      >
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" />
      </svg>
      {/* center mark + caption */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${chip}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={glyph}>
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="8.5" cy="8.5" r="1.6" fill="currentColor" />
            <path
              d="M21 15l-5-5L5 21"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {label && (
          <span className={`br-data max-w-[28ch] text-[11px] uppercase leading-snug tracking-[0.1em] ${text}`}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
