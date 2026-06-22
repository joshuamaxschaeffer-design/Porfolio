import { FlagshipPanda, type FlagshipPandaProps } from './home/FlagshipPanda'
import { stripEmpty } from './home/stripEmpty'

/** Payload renderer for the `homeFlagshipPanda` block. */
export function HomeFlagshipPandaBlock(props: FlagshipPandaProps) {
  return <FlagshipPanda {...stripEmpty(props)} />
}
