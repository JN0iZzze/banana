import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideAssetImage,
  SlideBackdrop,
  SlideBackdropFrame,
  SlideColumn,
  SlideContent,
  SlideFrame,
  SlideGrid,
  SlideHeader,
  SlideImageCell,
  SlideImagePair,
  SlidePromptQuote,
  Text,
} from '../../ui/slides';

const IMAGES = {
  flux: '/images/leo/flux2.png',
  gpt: '/images/leo/gpt_images.png',
} as const;

/** Два горизонтальных кадра 16∶9 в ряд: высота ряда задаёт масштаб, ширина выводится из соотношения. */
const FRAME =
  'relative aspect-[16/9] h-full max-h-full w-auto max-w-full min-h-0 overflow-hidden rounded-[var(--slide-radius-inner)]';

const FRAME_IMG =
  'absolute inset-0 block h-full w-full max-h-none max-w-none rounded-none object-cover object-center';

const CAPTION =
  'Один и тот же запрос к двум моделям: слева Flux 2, справа GPT Images — оба кадра в формате 16∶9.';

export function LeoFluxVsGptSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" align="top" className="relative isolate min-h-full">
      <SlideBackdrop variant="spotlight" accent="primary" className="opacity-70" />
      <SlideBackdropFrame className="z-20" />

      <SlideContent width="wide" density="compact" className="relative z-10 h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={<Text variant="meta">{formatSlideMeta('Сравнение', index, totalSlides)}</Text>}
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={3} className="min-h-0">
            <Reveal
              preset="soft"
              delay={0.12}
              className="flex h-full min-h-0 max-w-[400px] flex-col justify-center gap-6"
            >
              <Text variant="overline">Сравнение</Text>
              <SlidePromptQuote>{CAPTION}</SlidePromptQuote>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={9} className="min-h-0">
            <SlideImagePair justify="end" className="min-w-0">
              <Reveal preset="soft" delay={0.22} className="flex min-h-0 min-w-0 flex-1 basis-0">
                <SlideImageCell className="h-full min-w-0 flex-1 justify-center">
                  <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-2">
                    <div className={FRAME}>
                      <SlideAssetImage src={IMAGES.flux} objectAlign="center" className={FRAME_IMG} />
                    </div>
                    <Text variant="meta">Flux 2</Text>
                  </div>
                </SlideImageCell>
              </Reveal>
              <Reveal preset="soft" delay={0.32} className="flex min-h-0 min-w-0 flex-1 basis-0">
                <SlideImageCell className="h-full min-w-0 flex-1 justify-center">
                  <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-2">
                    <div className={FRAME}>
                      <SlideAssetImage src={IMAGES.gpt} objectAlign="center" className={FRAME_IMG} />
                    </div>
                    <Text variant="meta">GPT Images</Text>
                  </div>
                </SlideImageCell>
              </Reveal>
            </SlideImagePair>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
