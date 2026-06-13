import { SecondaryRow, type SecondaryRowProps } from './home/SecondaryRow'

/** Payload renderer for the `homeSecondaryRow` block. */
export function HomeSecondaryRowBlock(props: SecondaryRowProps) {
  return <SecondaryRow {...props} />
}
