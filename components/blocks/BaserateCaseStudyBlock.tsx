import { BaserateCaseStudy, type BaserateCaseStudyProps } from './baserate/BaserateCaseStudy'

/**
 * Payload renderer for the `baserateCaseStudy` block. Forwards CMS copy
 * overrides into the composed case study; blank fields fall back to defaults.
 */
export function BaserateCaseStudyBlock(props: BaserateCaseStudyProps) {
  return <BaserateCaseStudy {...props} />
}
