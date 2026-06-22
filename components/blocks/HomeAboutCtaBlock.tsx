import { HomeAboutCta, type HomeAboutCtaProps } from './home/HomeAboutCta'
import { stripEmpty } from './home/stripEmpty'

/** Payload renderer for the `homeAboutCta` block. */
export function HomeAboutCtaBlock(props: HomeAboutCtaProps) {
  return <HomeAboutCta {...stripEmpty(props)} />
}
