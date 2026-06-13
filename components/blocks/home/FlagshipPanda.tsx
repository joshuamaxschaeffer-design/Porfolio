import { FlagshipStage } from './FlagshipStage'
import { panda as defaults, type FlagshipContent } from './data'

export interface FlagshipPandaProps extends Partial<FlagshipContent> {}

/**
 * Home flagship #2 — Panda Express. Equal height to Baserate but warmer (red
 * accent) and choreographed slightly cooler/quicker so the second flagship
 * reads as a sibling, not a repeat. Media slot is a placeholder until the
 * 3D + parallax pass. Mirrored alignment (media left) for rhythm against #1.
 */
export function FlagshipPanda(props: FlagshipPandaProps = {}) {
  const content: FlagshipContent = { ...defaults, ...stripEmpty(props) }
  return <FlagshipStage content={content} align="right" />
}

function stripEmpty<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== ''),
  ) as Partial<T>
}
