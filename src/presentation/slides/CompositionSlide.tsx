import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
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
  person: '/images/composition/person.png',
  person1: '/images/composition/person1.png',
  ref: '/images/composition/ref.jpg',
  out: '/images/composition/out.png',
} as const;

const CELL = 'relative min-h-0 overflow-hidden rounded-[var(--slide-radius-inner)]';

const IMG_REF = 'block h-full w-full object-cover object-center';
const IMG_OUT = 'block h-full w-full object-cover';

export function CompositionSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <Text variant="meta">{formatSlideMeta('Композиция', index, totalSlides)}</Text>
          }
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={5} className="min-h-0">
            <div className="flex h-full min-h-0 max-w-[400px] flex-col justify-center gap-6">
              <Text variant="overline">Композиция</Text>
              <SlidePromptQuote>
                Make character from <span className="font-bold">[Image 1]</span>
                <span className="font-bold">[Image 2]</span> in composition and pose from{' '}
                <span className="font-bold">[Image 3]</span>, keep exact character identity and outfit from{' '}
                <span className="font-bold">[Image 1]</span>
              </SlidePromptQuote>
            </div>
          </SlideColumn>

          <SlideColumn span={7} className="min-h-0">
            <div className="grid h-full min-h-0 w-full min-w-0 grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-[var(--slide-grid-gap-md)]">
              <div className="grid min-h-0 grid-rows-[1fr_2fr] gap-[var(--slide-grid-gap-md)]">
                <div className="grid min-h-0 grid-cols-2 gap-[var(--slide-grid-gap-md)]">
                  <div className={CELL}>
                    <img src={IMAGES.person} alt="" className={IMG_REF} />
                  </div>
                  <div className={CELL}>
                    <img src={IMAGES.person1} alt="" className={IMG_REF} />
                  </div>
                </div>
                <div className={CELL}>
                  <img src={IMAGES.ref} alt="" className={IMG_REF} />
                </div>
              </div>

              <div className={CELL}>
                <img src={IMAGES.out} alt="" className={IMG_OUT} />
              </div>
            </div>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
