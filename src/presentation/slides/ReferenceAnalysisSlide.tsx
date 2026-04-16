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
  Text,
} from '../../ui/slides';

export function ReferenceAnalysisSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" className="relative">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="comfortable" className="relative z-10 h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={<Text variant="meta">{formatSlideMeta('Анализ референса', index, totalSlides)}</Text>}
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={6} className="min-h-0">
            <Reveal
              preset="enter-left"
              delay={0.1}
              className="flex h-full min-h-0 w-full items-center justify-center"
            >
              <div className="relative h-full min-h-0 w-max max-w-full min-w-0">
                <img
                  src="/images/face/001.jpg"
                  alt=""
                  className="block h-full w-auto max-w-full rounded-[var(--slide-radius-inner)] object-contain"
                />
                <div
                  className="absolute inset-x-3 bottom-3 rounded-[var(--slide-radius-inner)] bg-white/72 px-4 py-3 shadow-[var(--slide-shadow-soft)] backdrop-blur-md"
                  role="note"
                >
                  <Text variant="body" className="text-center text-pretty text-red-600">
                    Недостаточно данных для точной геометрии
                  </Text>
                </div>
              </div>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={6} className="min-h-0">
            <Reveal
              preset="enter-right"
              delay={0.16}
              className="flex h-full min-h-0 w-full items-center justify-center"
            >
              <div className="relative h-full min-h-0 w-max max-w-full min-w-0">
                <img
                  src="/images/face/002.jpg"
                  alt=""
                  className="block h-full w-auto max-w-full rounded-[var(--slide-radius-inner)] object-contain"
                />
                <div
                  className="absolute inset-x-3 bottom-3 rounded-[var(--slide-radius-inner)] bg-white/72 px-4 py-3 shadow-[var(--slide-shadow-soft)] backdrop-blur-md"
                  role="note"
                >
                  <Text variant="body" className="text-center text-pretty text-emerald-600">
                    Достаточно данных
                  </Text>
                </div>
              </div>
            </Reveal>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
