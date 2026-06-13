import { FlagshipStage } from './FlagshipStage'
import { baserate as defaults, type FlagshipContent } from './data'

export interface FlagshipBaserateProps extends Partial<FlagshipContent> {}

/**
 * Home flagship #1 — Baserate. The most important project; rendered first and
 * with the most flourish. Investor-serious navy/blue field. Media column is a
 * placeholder until the 3D + parallax pass (render via SD Studio site rig +
 * StudioObject, same pipeline as the Baserate branding hero).
 */
export function FlagshipBaserate(props: FlagshipBaserateProps = {}) {
  const content: FlagshipContent = { ...defaults, ...stripEmpty(props) }
  return <FlagshipStage content={content} align="left" />
}

function stripEmpty<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== ''),
  ) as Partial<T>
}
