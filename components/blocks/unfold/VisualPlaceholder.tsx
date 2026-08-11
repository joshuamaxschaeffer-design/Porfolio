/**
 * Marker block for a visual Joshua still needs to create. Deliberately loud
 * (green dashed) so nothing ships with one left in. Swap each for the real
 * asset, then delete this component.
 */
export function VisualPlaceholder({
  label,
  aspect = '16 / 9',
  className = '',
}: {
  label: string
  aspect?: string
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-[var(--uf-green)] bg-[rgba(52,156,114,0.07)] p-6 text-center ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <p className="br-data max-w-[24rem] text-[12px] uppercase tracking-[0.1em] leading-relaxed text-[var(--uf-green)]">
        Visual to create
        <span className="mt-1.5 block normal-case tracking-normal opacity-80">{label}</span>
      </p>
    </div>
  )
}
