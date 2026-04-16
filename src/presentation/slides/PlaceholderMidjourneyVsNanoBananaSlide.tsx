import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import { Box, Reveal, SlideBackdrop, SlideColumn, SlideContent, SlideFrame, SlideGrid, SlideHeader, Text } from '../../ui/slides';
import { cn } from '../../ui/slides/cn';

const MIDJOURNEY_POINTS: { label: string }[] = [
  { label: 'Художественный интеллект' },
  { label: 'Кинематографичность' },
  { label: '«Счастливые случайности»'},
  { label: 'Стили (sref)' },
];

const NANO_BANANA_POINTS: { label: string }[] = [
  { label: 'Инженерная точность' },
  { label: 'Сохранение идентичности' },
  { label: 'Точечные правки' },
  { label: 'Search Grounding' },
  { label: 'Нативное 4K' },
];

function PointTags({
  items,
  tone,
}: {
  items: { label: string }[];
  tone: 'standard' | 'accent';
}) {
  const onAccent = tone === 'accent';

  return (
    <div className="mt-auto flex min-h-0 w-full min-w-0 flex-wrap content-end gap-[var(--slide-stack-gap-sm)]">
      {items.map((item) => (
        <span
          key={item.label}
          className={cn(
            'inline-flex max-w-full rounded-[var(--slide-radius-inner)] border px-[var(--slide-section-x-sm)] py-[var(--slide-section-y-sm)]',
            onAccent
              ? 'border-[color:var(--slide-on-accent-tile-border)] bg-[color:var(--slide-on-accent-tile-bg)]'
              : 'border-[color:var(--slide-color-line)] bg-[color:var(--slide-color-surface-quiet)]',
          )}
        >
          <Text variant="body" context={onAccent ? 'onAccent' : 'default'} as="span" className="m-0 text-pretty">
            <span className="font-semibold">{item.label}</span>
          </Text>
        </span>
      ))}
    </div>
  );
}

export function PlaceholderMidjourneyVsNanoBananaSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader className="max-w-[1720px] gap-3" meta={<Text variant="meta">{formatSlideMeta('Midjourney и Nano Banana', index, totalSlides)}</Text>}>
          <Reveal preset="soft" delay={0}>
            <Text variant="h1" size="compact" className="leading-[1.02] tracking-[-0.03em]">
              Midjourney vs Nano&nbsp;Banana
            </Text>
          </Reveal>
          <Reveal preset="soft" delay={0.08}>
            <Text variant="lead" className="max-w-[70ch]">
              Различие подхода к генерации изображений
            </Text>
          </Reveal>
        </SlideHeader>

        <SlideGrid columns={12} gap="sm" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={6}>
            <Reveal preset="soft" delay={0.14} className="h-full">
              <Box tone="standard" padding="default" className="h-full">
                <div className="flex h-full min-h-0 flex-col gap-[var(--slide-stack-gap-md)]">
                  <Text variant="h2">Midjourney V7(8)</Text>
                  <Text variant="bodyLg" className="m-0 shrink-0 text-pretty">
                    «свободный художник», который может игнорировать часть инструкций ради создания
                    эстетически безупречного «вайба»
                  </Text>
                  <PointTags items={MIDJOURNEY_POINTS} tone="standard" />
                </div>
              </Box>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={6}>
            <Reveal preset="soft" delay={0.2} className="h-full">
              <Box tone="accent" padding="default" className="h-full">
                <div className="flex h-full min-h-0 flex-col gap-[var(--slide-stack-gap-md)]">
                  <Text variant="h2" context="onAccent">
                    Nano Banana Pro (2)
                  </Text>
                  <Text variant="bodyLg" context="onAccent" className="m-0 shrink-0 text-pretty">
                    «точный проектировщик», использующий архитектуру «Plan-Evaluate-Improve» для
                    строгого логического планирования композиции и точного следования брифу.
                  </Text>
                  <PointTags items={NANO_BANANA_POINTS} tone="accent" />
                </div>
              </Box>
            </Reveal>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
