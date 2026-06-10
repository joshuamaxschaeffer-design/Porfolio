import { WingstopCaseStudy, type WingstopCaseStudyProps } from './wingstop/WingstopCaseStudy'

/**
 * Payload renderer for the `wingstopCaseStudy` block. Forwards CMS copy
 * overrides into the composed case study; blank fields fall back to defaults.
 */
export function WingstopCaseStudyBlock(props: WingstopCaseStudyProps) {
  return <WingstopCaseStudy {...props} />
}
