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

type EditPromptBlock = {
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};

const BLOCKS: EditPromptBlock[] = [
  {
    index: 1,
    eyebrow: 'Change',
    title: 'Что правим',
    description: 'Зона изменения и желаемый результат — одной фразой.',
    points: ['объект или деталь', 'цвет / материал', 'выражение / поза', 'замена элемента'],
  },
  {
    index: 2,
    eyebrow: 'Keep',
    title: 'Что сохраняем',
    description: 'Якоря кадра: чтобы не «уплыл» стиль и композиция.',
    points: ['композиция и кадрирование', 'свет и тени', 'фон и атмосфера', 'общий стиль'],
  },
];

function EditPromptBlockCard({ block, delay }: { block: EditPromptBlock; delay: number }) {
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

        <Text variant="body" className="max-w-[40ch] text-pretty text-[color:var(--slide-color-text-soft)]">
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

export function EditingPromptStructureSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" align="top" className="relative isolate min-h-full">
      <SlideBackdrop variant="spotlight" accent="primary" className="opacity-70" />
      <SlideBackdropFrame className="z-20" />

      <SlideContent width="wide" density="compact" className="relative z-10 h-full min-h-0 justify-between gap-8">
        <SlideHeader
          className="max-w-[1720px] gap-3"
          meta={
            <Text variant="meta">{formatSlideMeta('Промпт на редактирование', index, totalSlides)}</Text>
          }
        >
          <Reveal preset="soft" delay={0.04}>
            <Text variant="h1" size="compact" className="max-w-[28ch] leading-[1.02] tracking-[-0.03em]">
              Промпт на редактирование
            </Text>
          </Reveal>
          <Reveal preset="soft" delay={0.08}>
            <Text variant="lead" className="max-w-[68ch] text-pretty">
              Две части: что меняем — и что оставляем без изменений.
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
                    Edit prompt
                  </Text>
                  <Text
                    variant="h2"
                    className="max-w-[14ch] text-[color:var(--slide-color-accent-contrast)] !text-[2.35rem] !leading-[1.02]"
                  >
                    Изменить и зафиксировать
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
            <div className="grid h-full min-h-0 grid-cols-2 gap-[var(--slide-grid-gap-md)] [grid-template-rows:minmax(0,1fr)]">
              {BLOCKS.map((block, i) => (
                <EditPromptBlockCard key={block.index} block={block} delay={0.16 + i * 0.06} />
              ))}
            </div>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
