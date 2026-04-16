import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideBackdrop,
  SlideBackdropFrame,
  SlideContent,
  SlideFrame,
  SlideHeader,
  SlideSection,
  Text,
} from '../../ui/slides';

const COLUMNS = [
  {
    title: 'Midjourney v6',
    body: 'Новая версия с улучшенным пониманием промптов и более точной генерацией изображений',
  },
  {
    title: 'Krea',
    body: 'Инструмент для создания и редактирования изображений с продвинутыми возможностями',
  },
  {
    title: 'Flux 1',
    body: 'Открытая модель генерации изображений с высоким качеством и скоростью работы',
  },
] as const;

export function Early2025Slide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="default" align="center" className="relative isolate">
      <SlideBackdrop variant="spotlight" accent="primary" />
      <SlideBackdropFrame className="z-20" />

      {/* Слой между фоном и контентом: только декор, не перекрывает карточки (они выше по z-index и непрозрачные). */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] flex items-end justify-center pb-[2%]"
        aria-hidden
      >
        <Reveal preset="soft" delay={0.8}>
          <Text
            as="span"
            variant="h1"
            size="display"
            className="!max-w-none whitespace-nowrap !text-[21.6rem] !leading-none !tracking-[-0.04em] uppercase text-[color:var(--slide-color-text)] opacity-10"
          >
            PASTGEN
          </Text>
        </Reveal>
      </div>

      <SlideContent
        width="wide"
        align="center"
        density="relaxed"
        className="relative z-30 h-full min-h-0 justify-center"
      >
        <SlideHeader
          align="center"
          className="max-w-[var(--slide-content-reading)] shrink-0 gap-6"
          meta={
            <Text variant="meta" className="text-center">
              {formatSlideMeta('Начало 2025', index, totalSlides)}
            </Text>
          }
        >
          <Reveal preset="soft" delay={0.1}>
            <Text variant="h1" size="section" className="mx-auto max-w-[18ch] text-center">
              Начало 2025
            </Text>
          </Reveal>
        </SlideHeader>

        <div className="mx-auto mt-[var(--slide-stack-gap-lg)] grid w-full max-w-[1180px] grid-cols-3 gap-[var(--slide-grid-gap-md)] items-stretch">
          {COLUMNS.map((col, colIndex) => (
            <Reveal
              key={col.title}
              preset="soft"
              delay={0.22 + colIndex * 0.08}
              className="flex h-full min-h-0 flex-col"
            >
              <SlideSection
                variant="panel"
                padding="compact"
                className="flex h-full min-h-0 flex-col !bg-[color:var(--slide-color-bg-strong)]"
              >
                <div className="flex h-full min-h-0 flex-col gap-[var(--slide-stack-gap-sm)] text-left">
                  <Text variant="h2" className="!text-[2rem] !leading-snug tracking-[-0.02em]">
                    {col.title}
                  </Text>
                  <Text variant="body" className="min-h-0 flex-1 text-pretty text-[color:var(--slide-color-text-soft)]">
                    {col.body}
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
