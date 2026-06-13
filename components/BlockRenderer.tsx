import { HeroBlock } from './blocks/HeroBlock'
import { TextSectionBlock } from './blocks/TextSectionBlock'
import { ImageBlock } from './blocks/ImageBlock'
import { ImageGridBlock } from './blocks/ImageGridBlock'
import { SpacerBlock } from './blocks/SpacerBlock'
import { FeaturedWorkBlock } from './blocks/FeaturedWorkBlock'
import { CaseStudyGridBlock } from './blocks/CaseStudyGridBlock'
import { LogoWallBlock } from './blocks/LogoWallBlock'
import { LifecycleSectionBlock } from './blocks/LifecycleSectionBlock'
import { CapabilitiesBlock } from './blocks/CapabilitiesBlock'
import { ValuesBlockBlock } from './blocks/ValuesBlockBlock'
import { CTABlock } from './blocks/CTABlock'
import { MotionImageBlockRenderer } from './blocks/MotionImageBlockRenderer'
import { LottieBlockRenderer } from './blocks/LottieBlockRenderer'
import { MarqueeLogosBlockRenderer } from './blocks/MarqueeLogosBlockRenderer'
import { BaserateCaseStudyBlock } from './blocks/BaserateCaseStudyBlock'
import { PandaCaseStudyBlock } from './blocks/PandaCaseStudyBlock'
import { WingstopCaseStudyBlock } from './blocks/WingstopCaseStudyBlock'
import { SamsungCaseStudyBlock } from './blocks/SamsungCaseStudyBlock'
import { CapabilitiesPageBlock } from './blocks/CapabilitiesPageBlock'

const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  textSection: TextSectionBlock,
  image: ImageBlock,
  imageGrid: ImageGridBlock,
  spacer: SpacerBlock,
  featuredWork: FeaturedWorkBlock,
  caseStudyGrid: CaseStudyGridBlock,
  logoWall: LogoWallBlock,
  lifecycleSection: LifecycleSectionBlock,
  capabilities: CapabilitiesBlock,
  values: ValuesBlockBlock,
  cta: CTABlock,
  // Advanced animation blocks
  motionImage: MotionImageBlockRenderer,
  lottie: LottieBlockRenderer,
  marqueeLogos: MarqueeLogosBlockRenderer,
  baserateCaseStudy: BaserateCaseStudyBlock,
  pandaCaseStudy: PandaCaseStudyBlock,
  wingstopCaseStudy: WingstopCaseStudyBlock,
  samsungCaseStudy: SamsungCaseStudyBlock,
  capabilitiesPage: CapabilitiesPageBlock,
}

interface BlockRendererProps {
  blocks: Array<{ blockType: string; id?: string; [key: string]: any }>
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map((block, i) => {
        const Component = blockComponents[block.blockType]
        if (!Component) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`No renderer registered for block type: ${block.blockType}`)
          }
          return null
        }
        return <Component key={block.id || i} {...block} />
      })}
    </>
  )
}
