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
  SlidePromptQuote,
  Text,
} from '../../ui/slides';

const IMAGE = '/images/stranger.jpg' as const;

const PROMPT =
  '«Нарисуй инфографику с кратким содержанием первой части 5-го сезона Stranger Things»';

export function AgenticWorkflowResultSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" align="center" className="relative isolate">
      <SlideBackdrop variant="spotlight" accent="primary" />
      <SlideBackdropFrame className="z-20" />

      <SlideContent width="wide" density="compact" className="relative z-30 h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <Text variant="meta">{formatSlideMeta('Результат агента', index, totalSlides)}</Text>
          }
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={3} className="min-h-0">
            <Reveal
              preset="enter-left"
              delay={0.12}
              className="flex h-full min-h-0 max-w-[400px] flex-col justify-center gap-6"
            >
              <Text variant="overline">Промпт</Text>
              <SlidePromptQuote>{PROMPT}</SlidePromptQuote>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={9} className="min-h-0">
            <Reveal preset="enter-right" delay={0.28} className="flex h-full min-h-0">
              <SlideImageCell className="min-h-[400px] w-full justify-center">
                <div className="h-full max-h-full w-full overflow-hidden">
                  <SlideAssetImage
                    src={IMAGE}
                    alt="Инфографика по первой части 5-го сезона Stranger Things"
                    objectAlign="center"
                    className="h-full w-full max-w-none object-contain rounded-3xl"
                  />
                </div>
              </SlideImageCell>
            </Reveal>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
