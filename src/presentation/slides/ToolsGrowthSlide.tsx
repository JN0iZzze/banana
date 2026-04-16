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
import { ToolsGrowthChart } from './ToolsGrowthChart';

export function ToolsGrowthSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" className="relative">
      <SlideBackdrop variant="mesh" accent="secondary" />

      <SlideContent
        width="wide"
        density="comfortable"
        className="relative z-10 h-full min-h-0 justify-between"
      >
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <Text variant="meta">{formatSlideMeta('Популярные модели', index, totalSlides)}</Text>
          }
        />

        <Reveal preset="soft" delay={0.08} className="w-full">
          <Text variant="h1" size="compact" className="mx-auto max-w-[28ch] text-center">
            Популярные ИИ-модели
          </Text>
        </Reveal>

        <Reveal
          preset="enter-up"
          delay={0.12}
          className="flex min-h-0 w-full flex-1 flex-col items-center justify-center"
        >
          <ToolsGrowthChart />
        </Reveal>

        <Reveal
          preset="soft"
          delay={0.28}
          className="w-full border-t border-[color:var(--slide-color-line)] pt-[var(--slide-card-padding-md)]"
        >
          <Text variant="bodyLg" className="max-w-[var(--slide-content-wide)] text-[color:var(--slide-color-text-soft)]">
            За три года количество популярных нейросетей выросло с нескольких единиц до полноценной
            экосистемы из&nbsp;полутора десятков мощных инструментов.
          </Text>
        </Reveal>
      </SlideContent>
    </SlideFrame>
  );
}
