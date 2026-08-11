import { UnfoldCaseStudy, type UnfoldCaseStudyProps } from './unfold/UnfoldCaseStudy'

/**
 * Payload renderer for the `unfoldCaseStudy` block. Forwards CMS copy
 * overrides into the composed case study; blank fields fall back to defaults.
 */
export function UnfoldCaseStudyBlock(props: UnfoldCaseStudyProps) {
  return <UnfoldCaseStudy {...props} />
}
