import { FlagshipBaserate, type FlagshipBaserateProps } from './home/FlagshipBaserate'
import { stripEmpty } from './home/stripEmpty'

/** Payload renderer for the `homeFlagshipBaserate` block. */
export function HomeFlagshipBaserateBlock(props: FlagshipBaserateProps) {
  return <FlagshipBaserate {...stripEmpty(props)} />
}
