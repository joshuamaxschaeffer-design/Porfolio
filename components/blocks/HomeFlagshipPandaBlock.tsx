import { FlagshipPanda, type FlagshipPandaProps } from './home/FlagshipPanda'

/** Payload renderer for the `homeFlagshipPanda` block. */
export function HomeFlagshipPandaBlock(props: FlagshipPandaProps) {
  return <FlagshipPanda {...props} />
}
