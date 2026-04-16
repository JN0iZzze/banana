import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Box,
  Reveal,
  SlideBackdrop,
  SlideBackdropFrame,
  SlideCodeWindow,
  SlideColumn,
  SlideContent,
  SlideFrame,
  SlideGrid,
  SlideHeader,
  Text,
} from '../../ui/slides';

const JSON_SKELETON = `{
  "subject": "...",
  "composition": "...",
  "setting": "...",
  "lighting": "...",
  "style": "...",
  "camera": "..."
}`;

const USE_CASES = [
  'Сложная сцена с множеством параметров, действие, свет, камера, детали объектов и др.',
  'Когда нужно скопировать изображение без использования референса',
] as const;

export function JsonPromptingDefinitionSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" align="top" className="relative isolate min-h-full">
      <SlideBackdrop variant="spotlight" accent="primary" className="opacity-70" />
      <SlideBackdropFrame className="z-20" />

      <SlideContent
        width="wide"
        density="compact"
        className="relative z-10 h-full min-h-0 justify-between gap-8"
      >
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <Text variant="meta">{formatSlideMeta('JSON-промптинг', index, totalSlides)}</Text>
          }
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={6} className="flex h-full min-h-0 flex-col">
            <Reveal preset="soft" delay={0.12} className="flex h-full min-h-0 flex-1 flex-col">
              <SlideCodeWindow title="prompt.json" className="h-full min-h-0 flex-1">
                <pre className="m-0 whitespace-pre-wrap break-words font-mono text-[1.875rem] leading-relaxed text-[color:var(--slide-color-text)]">
                  {JSON_SKELETON}
                </pre>
              </SlideCodeWindow>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={6} className="flex h-full min-h-0 flex-col">
            <div className="flex h-full min-h-0 flex-col justify-between gap-8 rounded-[var(--slide-radius-panel)] border border-[color:var(--slide-color-line)] bg-[color:var(--slide-color-surface-quiet)] p-8">
              <div className="space-y-6">
                <Reveal preset="soft" delay={0.2}>
                  <Text variant="h1" size="compact" className="max-w-[18ch] text-pretty leading-[1.05] tracking-[-0.03em]">
                    Что такое
                    <br />
                    JSON-промптинг
                  </Text>
                </Reveal>
                <Reveal preset="soft" delay={0.28}>
                  <Text variant="lead" className="max-w-[48ch] text-pretty text-[color:var(--slide-color-text-soft)]">
                    Это не другой магический режим, а более строгая упаковка той же инструкции: модель получает явные
                    поля вместо неразмеченного текста.
                  </Text>
                </Reveal>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {USE_CASES.map((useCase, i) => (
                  <Reveal key={useCase} preset="soft" delay={0.38 + i * 0.05} className="aspect-3/2 w-full min-h-0">
                    <Box
                      tone="standard"
                      padding="compact"
                      className="justify-end border-[color:var(--slide-color-line)] bg-[color:var(--slide-color-surface)] shadow-none"
                    >
                      <Text variant="body" className="m-0 text-pretty text-[color:var(--slide-color-text-soft)]">
                        {useCase}
                      </Text>
                    </Box>
                  </Reveal>
                ))}
              </div>
            </div>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
