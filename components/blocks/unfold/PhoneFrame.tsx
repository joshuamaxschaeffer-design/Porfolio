/**
 * Minimal device frame for the store screenshots. The ASC 6.5" set already
 * includes a rendered phone on scenic backgrounds, so this is a soft card —
 * rounded, shadowed, no second bezel.
 */
export function PhoneFrame({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[24px] shadow-[0_18px_48px_rgba(28,26,23,0.28)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="block h-auto w-full" />
    </div>
  )
}
