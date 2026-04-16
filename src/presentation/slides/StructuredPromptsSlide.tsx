import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideBackdrop,
  SlideBackdropFrame,
  SlideCodeWindow,
  SlideContent,
  SlideFrame,
  SlideHeader,
  Text,
} from '../../ui/slides';

const JSON_SAMPLE = `{
  "Subject":  "Cyberpunk Samurai",
  "Action":   "Fighting in the rain",
  "Lighting": "Neon blue and pink",
  "Style":    "Cinematic, 35mm film",
  "Mood":     "Dark, intense"
}`;

const FOOTNOTE =
  'JSON не заменяет промпт, а делает его строже: subject, action, lighting и style становятся отдельными частями одной инструкции.';

export function StructuredPromptsSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" align="top" className="relative isolate min-h-full">
      <SlideBackdrop variant="spotlight" accent="primary" className="opacity-70" />
      <SlideBackdropFrame className="z-20" />

      <SlideContent width="wide" density="compact" className="relative z-10 h-full min-h-0 justify-between gap-8">
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <Text variant="meta">{formatSlideMeta('Структурированный промпт', index, totalSlides)}</Text>
          }
        />

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center self-stretch pb-2">
          <Reveal preset="soft" delay={0.12} className="w-full max-w-5xl shrink-0">
            <SlideCodeWindow title="structured_prompt.json">
              <div className="font-mono text-[1.875rem] leading-relaxed">
                <Reveal preset="soft" delay={0.2}>
                  <Text variant="body" className="mb-8 font-mono opacity-50">
                    {'// Та же инструкция, только разложенная по явным полям'}
                  </Text>
                </Reveal>

                <Reveal preset="soft" delay={0.32}>
                  <pre className="m-0 whitespace-pre-wrap break-words text-[color:var(--slide-color-text)]">{JSON_SAMPLE}</pre>
                </Reveal>

                <Reveal preset="soft" delay={0.44}>
                  <div className="mt-10 border-l-4 border-[color:var(--slide-color-line)] pl-6">
                    <Text variant="bodyLg" className="m-0 max-w-[52ch] text-pretty opacity-80 text-[color:var(--slide-color-text-soft)]">
                      {FOOTNOTE}
                    </Text>
                  </div>
                </Reveal>
              </div>
            </SlideCodeWindow>
          </Reveal>
        </div>
      </SlideContent>
    </SlideFrame>
  );
}
