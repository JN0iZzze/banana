import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideBackdrop,
  SlideContent,
  SlideFrame,
  SlideHeader,
  SlideSection,
  Text,
} from '../../ui/slides';

const protocolSteps = [
  'Собрать сцену из SlideFrame + SlideBackdrop + SlideContent.',
  'Задать типографику только через Text и токены в index.css.',
  'Вынести повторяющиеся панели в Box и строки списка в BlockCard.',
  'Проверить тему презентации и контраст на целевом экране.',
] as const;

export function DemoSpotlightStackSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="default" align="center">
      <SlideBackdrop variant="spotlight" accent="primary" />

      <SlideContent
        width="narrow"
        align="center"
        density="relaxed"
        className="h-full min-h-0 justify-center"
      >
        <SlideHeader
          align="center"
          className="max-w-[var(--slide-content-reading)] gap-6"
          meta={
            <Text variant="meta" className="text-center">
              {formatSlideMeta('Вертикальный стек', index, totalSlides)}
            </Text>
          }
        >
          <Reveal preset="soft" delay={0}>
            <Text variant="h1" size="section" className="mx-auto max-w-[16ch] text-center">
              Вертикальный протокол
            </Text>
          </Reveal>
          <Reveal preset="soft" delay={0.1}>
            <Text variant="lead" className="mx-auto max-w-[40ch] text-center text-pretty">
              Узкий контент по центру и только столбик секций — без боковой сетки. Удобно для чеклистов,
              дорожных карт и финальных тезисов.
            </Text>
          </Reveal>
        </SlideHeader>

        <div className="mt-[var(--slide-stack-gap-lg)] flex w-full max-w-[var(--slide-content-reading)] flex-col gap-[var(--slide-stack-gap-sm)]">
          {protocolSteps.map((step, stepIndex) => (
            <Reveal key={step} preset="soft" delay={0.22 + stepIndex * 0.06} className="w-full">
              <SlideSection variant="panel" padding="compact">
                <div className="flex gap-[var(--slide-stack-gap-md)] text-left">
                  <Text variant="overline" className="w-8 shrink-0 pt-0.5">
                    {String(stepIndex + 1).padStart(2, '0')}
                  </Text>
                  <Text variant="body" className="min-w-0 flex-1 text-pretty">
                    {step}
                  </Text>
                </div>
              </SlideSection>
            </Reveal>
          ))}
        </div>
      </SlideContent>
    </SlideFrame>
  );
}
