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
import { PhotorealismPipelineModelsCards } from './PhotorealismPipelineModelsCards';

export function PhotorealismPipelineModelsSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px] gap-3"
          meta={
            <Text variant="meta">{formatSlideMeta('Фотореализм · модели', index, totalSlides)}</Text>
          }
        >
          <Reveal preset="soft" delay={0.1}>
            <Text variant="h1" size="compact" className="max-w-[22ch] leading-[1.02] tracking-[-0.03em]">
              Редактирование
              <br />
              и перенос стиля
            </Text>
          </Reveal>
          <Reveal preset="soft" delay={0.14}>
            <Text variant="lead" className="max-w-[70ch] text-pretty">
              Короткий ориентир: какую модель тянуть первой под тип задачи
            </Text>
          </Reveal>
        </SlideHeader>

        <PhotorealismPipelineModelsCards />
      </SlideContent>
    </SlideFrame>
  );
}
