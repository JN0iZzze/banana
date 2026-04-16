import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideBackdrop,
  SlideColumn,
  SlideContent,
  SlideFrame,
  SlideGrid,
  SlideHeader,
  SlidePromptQuote,
  Text,
} from '../../ui/slides';

const IMAGES = {
  person: '/images/fashion/person.png',
  outfitRef: '/images/fashion/ref.png',
  result: '/images/fashion/out.png',
} as const;

export function PhotorealismSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <Text variant="meta">{formatSlideMeta('Перенос одежды', index, totalSlides)}</Text>
          }
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={3} className="min-h-0">
            <Reveal
              preset="soft"
              delay={0.12}
              className="flex h-full min-h-0 max-w-[400px] flex-col justify-center gap-6"
            >
              <Text variant="overline">Перенос одежды</Text>
              <SlidePromptQuote>
                Dress character from <span className="font-bold">[Image1]</span>, in the outfit from{' '}
                <span className="font-bold">[Image2]</span>
              </SlidePromptQuote>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={9} className="min-h-0">
            <div className="grid h-full min-h-0 grid-cols-[max-content_max-content] grid-rows-2 justify-end gap-[var(--slide-grid-gap-md)] overflow-hidden">
              <Reveal preset="soft" delay={0.22} className="row-start-1 flex min-h-0 items-center justify-center">
                <div className="h-full aspect-[1792/2400] min-h-0 overflow-hidden rounded-[var(--slide-radius-inner)]">
                  <img src={IMAGES.person} alt="" className="block h-full w-full object-contain" />
                </div>
              </Reveal>
              <Reveal preset="soft" delay={0.28} className="row-start-2 flex min-h-0 items-center justify-center">
                <div className="h-full aspect-[1318/1748] min-h-0 overflow-hidden rounded-[var(--slide-radius-inner)]">
                  <img src={IMAGES.outfitRef} alt="" className="block h-full w-full object-contain" />
                </div>
              </Reveal>

              <Reveal
                preset="soft"
                delay={0.36}
                className="row-span-2 flex h-full min-h-0 items-center justify-center"
              >
                <div className="h-full aspect-[1903/2585] min-h-0 overflow-hidden rounded-[var(--slide-radius-inner)]">
                  <img src={IMAGES.result} alt="" className="block h-full w-full object-contain" />
                </div>
              </Reveal>
            </div>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
