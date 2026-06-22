import { HomeHero, type HomeHeroProps } from './home/HomeHero'
import { stripEmpty } from './home/stripEmpty'

/** Payload renderer for the `homeHero` block. */
export function HomeHeroBlock(props: HomeHeroProps) {
  return <HomeHero {...stripEmpty(props)} />
}
