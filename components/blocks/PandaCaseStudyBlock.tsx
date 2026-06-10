import { PandaCaseStudy, type PandaCaseStudyProps } from './panda/PandaCaseStudy'

/**
 * Payload renderer for the `pandaCaseStudy` block. Forwards CMS copy
 * overrides into the composed case study; blank fields fall back to defaults.
 */
export function PandaCaseStudyBlock(props: PandaCaseStudyProps) {
  return <PandaCaseStudy {...props} />
}
