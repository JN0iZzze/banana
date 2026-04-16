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
  first: '/images/prompt/001.png',
  second: '/images/prompt/002.png',
} as const;

const CAPTION =
  'Два сгенерированных кадра по английской и русской формулировке с предыдущего слайда — одна сцена, разный порядок и акценты в тексте.';

export function PromptOrderPairImagesSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" align="top" className="relative isolate min-h-full">
      <SlideBackdrop variant="spotlight" accent="primary" className="opacity-70" />
      <SlideBackdropFrame className="z-20" />

      <SlideContent width="wide" density="compact" className="relative z-10 h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={<Text variant="meta">{formatSlideMeta('Промпт: порядок', index, totalSlides)}</Text>}
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={3} className="min-h-0">
            <Reveal
              preset="soft"
              delay={0.12}
              className="flex h-full min-h-0 max-w-[400px] flex-col justify-center gap-6"
            >
              <Text variant="overline">Результат</Text>
              <SlidePromptQuote>{CAPTION}</SlidePromptQuote>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={9} className="min-h-0">
            <SlideImagePair justify="end">
              <Reveal preset="soft" delay={0.22} className="flex h-full min-h-0 shrink-0">
                <SlideImageCell>
                  <SlideAssetImage src={IMAGES.first} objectAlign="right" />
                </SlideImageCell>
              </Reveal>
              <Reveal preset="soft" delay={0.32} className="flex h-full min-h-0 shrink-0">
                <SlideImageCell>
                  <SlideAssetImage src={IMAGES.second} objectAlign="right" />
                </SlideImageCell>
              </Reveal>
            </SlideImagePair>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
