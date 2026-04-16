import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideBackdrop,
  SlideContent,
  SlideFrame,
  SlideHeader,
  Text,
} from '../../ui/slides';
import { AttentionModels2026Cards } from './AttentionModels2026Cards';

export function AttentionModels2026Slide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px] gap-3"
          meta={
            <Text variant="meta">{formatSlideMeta('Актуальные модели 2026', index, totalSlides)}</Text>
          }
        >
          <Reveal preset="soft" delay={0.1}>
            <Text variant="h1" size="compact" className="max-w-[18ch] leading-[1.02] tracking-[-0.03em]">
              Что актуально сейчас
            </Text>
          </Reveal>
          <Reveal preset="soft" delay={0.14}>
            <Text variant="lead" className="max-w-[70ch] text-pretty">
              Краткая карта моделей, которые уже полезны в ежедневной работе
            </Text>
          </Reveal>
        </SlideHeader>

        <AttentionModels2026Cards />
      </SlideContent>
    </SlideFrame>
  );
}
