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
  ref1: '/images/3d/ref1.png',
  ref2: '/images/3d/ref2.jpg',
  result1: '/images/3d/out1.png',
  result2: '/images/3d/out2.png',
} as const;

const CELL = 'relative min-h-0 overflow-hidden rounded-[var(--slide-radius-inner)]';

const IMG = 'block h-full w-full object-cover';

export function ThreeDRefsSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={<Text variant="meta">{formatSlideMeta('3D', index, totalSlides)}</Text>}
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={3} className="min-h-0">
            <Reveal
              preset="soft"
              delay={0.12}
              className="flex h-full min-h-0 max-w-[400px] flex-col justify-center gap-6"
            >
              <Text variant="overline">Промпт</Text>
              <SlidePromptQuote>
                Apply texture to [Image 1] (Gray 3d model) from [Image 2] Keep the angle of object the same
              </SlidePromptQuote>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={9} className="min-h-0">
            <div
              className="grid h-full min-h-0 w-full min-w-0 grid-cols-[minmax(0,2fr)_minmax(0,2fr)] grid-rows-6 gap-x-[var(--slide-grid-gap-lg)] gap-y-[var(--slide-grid-gap-md)]"
            >
              <Reveal
                preset="soft"
                delay={0.2}
                className="col-start-1 row-span-3 row-start-1 min-h-0 h-full w-full min-w-0"
              >
                <div className={`${CELL} h-full`}>
                  <img src={IMAGES.ref1} alt="" className={IMG} />
                </div>
              </Reveal>
              <Reveal
                preset="soft"
                delay={0.24}
                className="col-start-1 row-span-3 row-start-4 min-h-0 h-full w-full min-w-0"
              >
                <div className={`${CELL} h-full`}>
                  <img src={IMAGES.ref2} alt="" className={IMG} />
                </div>
              </Reveal>

              <Reveal
                preset="soft"
                delay={0.34}
                className="col-start-2 row-span-3 row-start-1 min-h-0 h-full w-full min-w-0"
              >
                <div className={`${CELL} h-full`}>
                  <img src={IMAGES.result1} alt="" className={IMG} />
                </div>
              </Reveal>
              <Reveal
                preset="soft"
                delay={0.4}
                className="col-start-2 row-span-3 row-start-4 min-h-0 h-full w-full min-w-0"
              >
                <div className={`${CELL} h-full`}>
                  <img src={IMAGES.result2} alt="" className={IMG} />
                </div>
              </Reveal>
            </div>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
