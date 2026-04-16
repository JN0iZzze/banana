import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideAssetImage,
  SlideBackdrop,
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
  input: '/images/editing/input.png',
  output: '/images/editing/output.png',
} as const;

const PROMPT = 'Сделай обувь в синем цвете вместо зеленого';

export function EditingPromptPrinciplesSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <Text variant="meta">{formatSlideMeta('Промпт на изменение', index, totalSlides)}</Text>
          }
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={3} className="min-h-0">
            <Reveal
              preset="soft"
              delay={0.12}
              className="flex h-full min-h-0 max-w-[400px] flex-col justify-center gap-6"
            >
              <Text variant="overline">Промпт на изменение</Text>
              <SlidePromptQuote>{PROMPT}</SlidePromptQuote>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={9} className="min-h-0">
            <SlideImagePair justify="end">
              <Reveal preset="soft" delay={0.22} className="flex h-full min-h-0 shrink-0">
                <SlideImageCell>
                  <SlideAssetImage src={IMAGES.input} objectAlign="right" />
                </SlideImageCell>
              </Reveal>
              <Reveal preset="soft" delay={0.32} className="flex h-full min-h-0 shrink-0">
                <SlideImageCell>
                  <SlideAssetImage src={IMAGES.output} objectAlign="right" />
                </SlideImageCell>
              </Reveal>
            </SlideImagePair>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
