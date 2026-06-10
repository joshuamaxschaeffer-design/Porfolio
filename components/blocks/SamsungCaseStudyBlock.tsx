import { SamsungCaseStudy, type SamsungCaseStudyProps } from './samsung/SamsungCaseStudy'

/**
 * Payload renderer for the `samsungCaseStudy` block. Forwards CMS copy
 * overrides into the composed case study; blank fields fall back to defaults.
 */
export function SamsungCaseStudyBlock(props: SamsungCaseStudyProps) {
  return <SamsungCaseStudy {...props} />
}
