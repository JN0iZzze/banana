import type { LucideIcon } from 'lucide-react';
import { Brain, Globe, Image, Monitor, Type, Zap } from 'lucide-react';
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

const VERSIONS = [
  { key: 'flash' as const, title: 'Nano Banana', subtitle: 'Fast / Flash', tone: 'standard' as const },
  { key: 'pro' as const, title: 'Nano Banana Pro', subtitle: 'Better control', tone: 'accent' as const },
  { key: 'two' as const, title: 'Nano Banana 2', subtitle: 'Next step', tone: 'standard' as const },
];

const ROWS: { icon: LucideIcon; label: string; flash: string; pro: string; two: string }[] = [
  { icon: Zap, label: 'Философия', flash: 'Быстрая', pro: 'Точная', two: 'Баланс' },
  { icon: Monitor, label: 'Разрешение', flash: '1K', pro: '4K', two: '4K' },
  { icon: Image, label: 'Кол-во референсов', flash: '4 шт', pro: '14 шт', two: '14 шт' },
  { icon: Type, label: 'Текст', flash: 'Плохо', pro: 'Отлично', two: 'Отлично' },
  { icon: Globe, label: 'Поиск', flash: '—', pro: 'Да', two: 'Да' },
  { icon: Brain, label: 'Следование инструкции', flash: 'Базово', pro: 'Хорошо', two: 'Отлично' },
];

export function PlaceholderNanoBananaVersionsSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="mesh" accent="primary" />

      <SlideContent width="wide" density="comfortable" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px] gap-4"
          meta={
            <Text variant="meta">
              {formatSlideMeta('Gemini Image Line · Nano Banana', index, totalSlides)}
            </Text>
          }
        >
          <Reveal preset="soft" delay={0}>
            <Text variant="h1" size="section" className="max-w-[20ch]">
              Nano Banana
            </Text>
          </Reveal>
          <Reveal preset="soft" delay={0.06}>
            <Text variant="lead" className="!max-w-[52ch]">
              У каждой версии свой баланс скорости, точности и возможностей
            </Text>
          </Reveal>
        </SlideHeader>

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          {VERSIONS.map((col, colIndex) => (
            <SlideColumn key={col.key} span={4}>
              <Reveal preset="soft" delay={0.14 + colIndex * 0.07} className="h-full">
                <Box tone={col.tone} padding="default" className="h-full">
                  <div className="flex h-full min-h-0 flex-col gap-[var(--slide-stack-gap-sm)]">
                    <div className="shrink-0">
                      <Text
                        variant="caption"
                        className={cn(
                          'mt-1 uppercase tracking-[0.28em]',
                          col.tone === 'accent' && 'text-[color:var(--slide-color-accent-contrast)]/75',
                        )}
                      >
                        {col.subtitle}
                      </Text>
                      <Text
                        variant="h2"
                        className={cn(
                          'mt-1 max-w-[14ch] !text-[2rem] !leading-snug tracking-[-0.02em]',
                          col.tone === 'accent' && '!text-[color:var(--slide-color-accent-contrast)]',
                        )}
                      >
                        {col.title}
                      </Text>
                    </div>

                    <ul className="flex min-h-0 flex-1 flex-col gap-[var(--slide-stack-gap-sm)] overflow-hidden">
                      {ROWS.map((row) => {
                        const Icon = row.icon;
                        const value = row[col.key];
                        const onAccent = col.tone === 'accent';
                        return (
                          <li
                            key={row.label}
                            className={cn(
                              'flex gap-3 border-b pb-[var(--slide-stack-gap-sm)] last:border-b-0 last:pb-0',
                              onAccent
                                ? 'border-[color:color-mix(in_srgb,var(--slide-color-accent-contrast)_22%,transparent)]'
                                : 'border-[color:var(--slide-color-line)]',
                            )}
                          >
                            <div
                              className={
                                onAccent
                                  ? 'flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--slide-radius-inner)] bg-[color:var(--slide-color-accent-contrast)]/12 text-[color:var(--slide-color-accent-contrast)]'
                                  : 'flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--slide-radius-inner)] bg-[color:var(--slide-color-surface-quiet)] text-[color:var(--slide-color-text-soft)]'
                              }
                            >
                              <Icon size={24} strokeWidth={1.75} aria-hidden />
                            </div>
                            <div className="min-w-0 flex-1">
                              <Text
                                variant="caption"
                                className={cn(
                                  'font-semibold',
                                  onAccent
                                    ? 'text-[color:var(--slide-color-accent-contrast)]/65'
                                    : 'text-[color:var(--slide-color-text)]/60',
                                )}
                              >
                                {row.label}
                              </Text>
                              <Text
                                variant="body"
                                className="mt-0.5 text-pretty font-medium"
                                context={onAccent ? 'onAccent' : 'default'}
                              >
                                {value}
                              </Text>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Box>
              </Reveal>
            </SlideColumn>
          ))}
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
