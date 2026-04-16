import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideBackdrop,
  SlideBackdropFrame,
  SlideContent,
  SlideFrame,
  SlideHeader,
  Text,
} from '../../ui/slides';

const ROWS = [
  { name: 'Nano Banana Pro', model: 'Gemini 3 Pro', count: 'до 14' },
  { name: 'Seedream v4.5', model: 'ByteDance', count: 'до 14' },
  { name: 'Flux 2 Max / Flex', model: 'Black Forest Labs', count: 'до 10' },
  { name: 'GPT Image 1.5', model: 'OpenAI', count: 'до 16' },
] as const;

export function ReferenceCountsSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" className="relative isolate">
      <SlideBackdrop variant="spotlight" accent="primary" />
      <SlideBackdropFrame className="z-20" />

      <SlideContent
        width="wide"
        density="relaxed"
        className="relative z-30 h-full min-h-0 justify-center"
      >
        <SlideHeader
          className="max-w-[var(--slide-content-reading)] shrink-0 gap-4"
          meta={
            <Text variant="meta">{formatSlideMeta('Лимиты референсов', index, totalSlides)}</Text>
          }
        >
          <Reveal preset="soft" delay={0.1}>
            <Text variant="h1" size="section" className="max-w-[20ch] tracking-[-0.02em]">
              Сколько референсов допускают модели
            </Text>
          </Reveal>
        </SlideHeader>

        <div className="mx-auto mt-[var(--slide-stack-gap-lg)] w-full max-w-[960px]">
          {ROWS.map((row, i) => (
            <Reveal key={row.name} preset="soft" delay={0.2 + i * 0.08}>
              <div
                className="flex items-baseline justify-between gap-10 border-b border-[color:var(--slide-color-line)] py-[var(--slide-stack-gap-md)] last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <Text variant="h2" className="!text-[2.25rem] !leading-tight tracking-[-0.02em]">
                    {row.name}
                  </Text>
                  <Text variant="caption" className="mt-2 text-[color:var(--slide-color-text-soft)]">
                    {row.model}
                  </Text>
                </div>
                <Text
                  as="span"
                  variant="h2"
                  className="shrink-0 font-mono !text-[2.75rem] !leading-none font-bold tabular-nums tracking-tight text-[color:var(--slide-color-text-soft)]"
                >
                  {row.count}
                </Text>
              </div>
            </Reveal>
          ))}
        </div>
      </SlideContent>
    </SlideFrame>
  );
}
