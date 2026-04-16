import { Atom, Brain, Search } from 'lucide-react';
import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import { cn } from '../../ui/slides/cn';
import {
  Box,
  Reveal,
  SlideBackdrop,
  SlideColumn,
  SlideContent,
  SlideFrame,
  SlideGrid,
  SlideHeader,
  Text,
} from '../../ui/slides';

const STEPS = [
  {
    key: 'think' as const,
    icon: Brain,
    tone: 'accent' as const,
    title: 'Сначала думает',
    overline: 'Разбирает задачу',
    body:
      'Разбирает запрос, понимает сцену, композицию и что именно нужно получить на выходе',
    footnote: null as string | null,
  },
  {
    key: 'verify' as const,
    icon: Search,
    tone: 'standard' as const,
    title: 'Потом проверяет',
    overline: 'Ищет факты и контекст',
    body:
      'При необходимости ищет нужные подробности и опирается не только на догадку, но и на реальные данные',
    footnote: '(Онлайн поиск доступен не на всех платформах)',
  },
  {
    key: 'draw' as const,
    icon: Atom,
    tone: 'accent' as const,
    title: 'И только потом рисует',
    overline: 'Собирает сцену целиком',
    body: 'Собирает кадр, удерживает логику сцены, свет, материал и текст внутри изображения',
    footnote: null as string | null,
  },
];

function StepArrow({ delay }: { delay: number }) {
  return (
    <div className="flex w-14 shrink-0 items-center justify-center self-stretch">
      <Reveal preset="soft" delay={delay} className="flex items-center justify-center">
        <Text variant="h2" className="italic leading-none text-[color:var(--slide-color-text)]">
          →
        </Text>
      </Reveal>
    </div>
  );
}

export function AgenticWorkflowSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px] gap-4"
          meta={
            <Text variant="meta">{formatSlideMeta('Nano Banana Pro · агент', index, totalSlides)}</Text>
          }
        >
          <Reveal preset="soft" delay={0}>
            <Text variant="h1" size="section" className="max-w-[24ch] italic tracking-tight">
              Nano Banana Pro — как агент
            </Text>
          </Reveal>
        </SlideHeader>

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr">
          <SlideColumn span={12} className="min-h-0">
            <div className="flex h-full min-h-0 items-stretch gap-[var(--slide-grid-gap-sm)]">
              {STEPS.map((step, stepIndex) => {
                const Icon = step.icon;
                const onAccent = step.tone === 'accent';
                return (
                  <div key={step.key} className="contents">
                    {stepIndex > 0 ? <StepArrow delay={0.22 + stepIndex * 0.06} /> : null}
                    <Reveal
                      preset={stepIndex === 0 ? 'enter-left' : stepIndex === 1 ? 'soft' : 'enter-right'}
                      delay={0.12 + stepIndex * 0.1}
                      className="min-h-0 min-w-0 flex-1"
                    >
                      <Box tone={step.tone} padding="spacious" className="h-full">
                        <div
                          className={
                            onAccent
                              ? 'flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--slide-radius-inner)] bg-[color:var(--slide-color-accent-contrast)]/15 text-[color:var(--slide-color-accent-contrast)]'
                              : 'flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--slide-radius-inner)] bg-[color:var(--slide-color-surface-quiet)] text-[color:var(--slide-color-text-soft)]'
                          }
                        >
                          <Icon size={32} strokeWidth={1.6} aria-hidden />
                        </div>
                        <Text
                          variant="h2"
                          className={cn(
                            'max-w-[14ch] italic tracking-tight !text-[2.75rem] !leading-[1.05]',
                            onAccent && '!text-[color:var(--slide-color-accent-contrast)]',
                          )}
                        >
                          {step.title}
                        </Text>
                        <Text
                          variant="overline"
                          className={cn(
                            'uppercase tracking-[0.22em]',
                            onAccent ? 'text-[color:var(--slide-color-accent-contrast)]/70' : undefined,
                          )}
                          context={onAccent ? 'onAccent' : 'default'}
                        >
                          {step.overline}
                        </Text>
                        {step.footnote ? (
                          <Text
                            variant="bodyLg"
                            className="text-[color:var(--slide-color-text)]/55"
                            context="default"
                          >
                            {step.footnote}
                          </Text>
                        ) : null}
                        <Text
                          variant="bodyLg"
                          className="mt-auto text-pretty leading-snug"
                          context={onAccent ? 'onAccent' : 'default'}
                        >
                          {step.body}
                        </Text>
                      </Box>
                    </Reveal>
                  </div>
                );
              })}
            </div>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
