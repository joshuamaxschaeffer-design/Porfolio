interface SpacerBlockProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function SpacerBlock({ size = 'md' }: SpacerBlockProps) {
  const heights = { sm: 'h-6', md: 'h-12', lg: 'h-24', xl: 'h-40' }
  return <div className={heights[size]} aria-hidden="true" />
}
