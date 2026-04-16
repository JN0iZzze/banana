import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Box,
  Reveal,
  SlideBackdrop,
  SlideBackdropFrame,
  SlideColumn,
  SlideContent,
  SlideFrame,
  SlideGrid,
  SlideHeader,
  SurfaceCard,
  Text,
} from '../../ui/slides';

type PromptBlock = {
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};

const BLOCKS: PromptBlock[] = [
  {
    index: 1,
    eyebrow: 'Subject',
    title: 'Кто в кадре',
    description: 'Главный объект сцены.',
    points: ['герой', 'детали', 'эмоция', 'действие'],
  },
  {
    index: 2,
    eyebrow: 'Scene',
    title: 'Где это происходит',
    description: 'Контекст и среда.',
    points: ['место', 'фон', 'окружение'],
  },
  {
    index: 3,
    eyebrow: 'Style',
    title: 'Какой нужен вайб',
    description: 'Характер изображения.',
    points: ['стиль', 'палитра', 'фактура', 'настроение'],
  },
  {
    index: 4,
    eyebrow: 'Camera',
    title: 'Как это показать',
    description: 'Подача кадра.',
    points: ['ракурс', 'план', 'свет', 'композиция'],
  },
];

function PromptBlockCard({ block, delay }: { block: PromptBlock; delay: number }) {
  return (
    <Reveal preset="soft" delay={delay} className="h-full min-h-0">
      <SurfaceCard
        variant="ghost"
        padding="default"
        className="h-full border-white/10 bg-white/[0.045] backdrop-blur-[10px]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <Text variant="overline" className="text-[color:var(--slide-color-accent)]">
              {block.eyebrow}
            </Text>
            <Text variant="h2" className="max-w-[14ch] text-pretty !text-[2rem] !leading-[1.02]">
              {block.title}
            </Text>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[color:var(--slide-color-line)] bg-white/[0.04] text-[1rem] font-semibold text-[color:var(--slide-color-accent)]">
            {String(block.index).padStart(2, '0')}
          </div>
        </div>

        <Text variant="body" className="max-w-[34ch] text-pretty text-[color:var(--slide-color-text-soft)]">
          {block.description}
        </Text>

        <div className="mt-auto flex flex-wrap gap-2">
          {block.points.map((point, i) => (
            <span
              key={`${block.index}-${i}`}
              className="inline-flex items-center rounded-full border border-[color:var(--slide-color-line)] bg-[color:var(--slide-color-surface-quiet)] px-4 py-2 text-[color:var(--slide-color-text)]"
            >
              <Text variant="body" className="m-0 !leading-none">
                {point}
              </Text>
            </span>
          ))}
        </div>
      </SurfaceCard>
    </Reveal>
  );
}

export function PromptStructureSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" align="top" className="relative isolate min-h-full">
      <SlideBackdrop variant="spotlight" accent="primary" className="opacity-70" />
      <SlideBackdropFrame className="z-20" />

      <SlideContent width="wide" density="compact" className="relative z-10 h-full min-h-0 justify-between gap-8">
        <SlideHeader
          className="max-w-[1720px] gap-3"
          meta={
            <Text variant="meta">{formatSlideMeta('Структура промпта', index, totalSlides)}</Text>
          }
        >
          <Reveal preset="soft" delay={0.04}>
            <Text variant="h1" size="compact" className="max-w-[24ch] leading-[1.02] tracking-[-0.03em]">
              Структура промпта
            </Text>
          </Reveal>
          <Reveal preset="soft" delay={0.08}>
            <Text variant="lead" className="max-w-[68ch] text-pretty">
              Промпт проще собирать по слоям: субъект, сцена, стиль, подача.
            </Text>
          </Reveal>
        </SlideHeader>

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={4} className="min-h-0">
            <Reveal preset="soft" delay={0.12} className="h-full">
              <Box
                tone="accent"
                padding="default"
                className="h-full justify-between border-none bg-[linear-gradient(160deg,var(--slide-color-accent),#b53b17)]"
              >
                <div className="space-y-4">
                  <Text variant="overline" context="onAccent">
                    Prompt Formula
                  </Text>
                  <Text
                    variant="h2"
                    className="max-w-[11ch] text-[color:var(--slide-color-accent-contrast)] !text-[2.35rem] !leading-[1.02]"
                  >
                    Четыре слоя одного кадра
                  </Text>
                </div>

                <div className="grid gap-3">
                  {BLOCKS.map((block) => (
                    <div
                      key={block.index}
                      className="flex items-center gap-4 rounded-[18px] border border-white/18 bg-white/10 px-4 py-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/14 text-sm font-semibold text-[color:var(--slide-color-accent-contrast)]">
                        {String(block.index).padStart(2, '0')}
                      </div>
                      <div className="min-w-0">
                        <Text variant="bodyLg" context="onAccent" className="m-0 text-[color:var(--slide-color-accent-contrast)]">
                          {block.title}
                        </Text>
                        <Text
                          variant="caption"
                          context="onAccent"
                          className="mt-1 text-[color:var(--slide-color-accent-contrast)]/72"
                        >
                          {block.eyebrow}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </Box>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={8} className="min-h-0">
            <div className="grid h-full min-h-0 grid-cols-2 gap-[var(--slide-grid-gap-md)] [grid-template-rows:repeat(2,minmax(0,1fr))]">
              {BLOCKS.map((block, i) => (
                <PromptBlockCard key={block.index} block={block} delay={0.16 + i * 0.06} />
              ))}
            </div>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
