import type { SlideRenderProps } from '../types';
import { Reveal, SlideBackdropFrame, SlideFrame, Text } from '../../ui/slides';

const BG = '/images/creme.png' as const;

export function TexturingModelingCoverSlide(_props: SlideRenderProps) {
  return (
    <SlideFrame align="center" className="p-0 items-center justify-center">
      <div className="pointer-events-none absolute inset-0 z-0">
        <img src={BG} alt="" className="h-full w-full object-cover" />
        <div
          className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-[color-mix(in_srgb,var(--slide-color-bg)_80%,transparent)]"
          aria-hidden
        />
      </div>

      <SlideBackdropFrame className="z-20" />

      <div className="absolute top-[var(--slide-safe-y)] left-[var(--slide-safe-x)] right-[var(--slide-safe-x)] z-30 flex justify-between gap-[var(--slide-grid-gap-lg)]">
        <Reveal preset="soft" delay={0.2}>
          <Text variant="overline" className="text-white font-semibold uppercase tracking-[0.2em]">
            AI 3D
          </Text>
        </Reveal>
        <Reveal preset="soft" delay={0.3} className="flex gap-12">
          <Text variant="overline" className="text-white font-semibold uppercase tracking-[0.2em]">
            Моделинг
          </Text>
          <Text variant="overline" className="text-white font-semibold uppercase tracking-[0.2em]">
            Материалы
            <br />
            Генерация
          </Text>
        </Reveal>
        <Reveal preset="soft" delay={0.4} className="text-right">
          <Text variant="overline" className="text-white font-semibold uppercase tracking-[0.2em]">
            Нейросети
          </Text>
        </Reveal>
      </div>

      <div className="relative z-30 text-center translate-y-[220px]">
        <Reveal preset="enter-up" delay={0.5}>
          <h1 className="font-display text-[10rem] leading-[0.9] tracking-tight text-white">
            Текстурирование
            <br />
            и моделинг
          </h1>
        </Reveal>
      </div>

      <div className="absolute bottom-[var(--slide-safe-y)] left-[var(--slide-safe-x)] right-[var(--slide-safe-x)] z-30 flex justify-between items-end gap-[var(--slide-grid-gap-lg)]">
        <Reveal preset="soft" delay={0.6} className="max-w-[18rem]">
          <Text variant="overline" className="text-white font-semibold uppercase tracking-[0.2em]">
            Промпты
            <br />
            Параметры
          </Text>
        </Reveal>
        <Reveal preset="soft" delay={0.7} className="text-center">
          <div className="mx-auto mb-4 h-px w-32 bg-white/45" aria-hidden />
          <Text variant="overline" className="text-white font-semibold uppercase tracking-[0.2em]">
            Текстуры и геометрия
          </Text>
        </Reveal>
        <Reveal preset="soft" delay={0.8} className="max-w-[18rem] text-right">
          <Text variant="overline" className="text-white font-semibold uppercase tracking-[0.2em]">
            Диффузия
            <br />
            Текст
          </Text>
        </Reveal>
      </div>
    </SlideFrame>
  );
}
