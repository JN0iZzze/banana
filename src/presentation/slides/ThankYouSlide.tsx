import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideBackdrop,
  SlideContent,
  SlideFrame,
  SlideHeader,
  Text,
} from '../../ui/slides';

const BG = '/bg-intro.png' as const;

export function ThankYouSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="spotlight" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <div className="flex w-full items-start justify-between gap-8">
              <Reveal preset="enter-left" delay={0.1} className="flex flex-col gap-1">
                <Text variant="overline" className="font-semibold uppercase tracking-[0.35em]">
                  Generative_graphics
                </Text>
                <Text variant="caption" className="uppercase tracking-[0.2em] text-[color:var(--slide-color-text-muted)]">
                  Image_context_engineering
                </Text>
              </Reveal>
              <Reveal preset="enter-right" delay={0.15} className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--slide-color-accent)] motion-safe:animate-pulse"
                    aria-hidden
                  />
                  <Text variant="caption" className="uppercase tracking-[0.25em]">
                    System_offline
                  </Text>
                </div>
                <Text variant="meta">{formatSlideMeta('Финал', index, totalSlides)}</Text>
              </Reveal>
            </div>
          }
        />

        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-8 pb-6 pt-4">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[min(720px,42%)] -translate-x-1/2 -translate-y-[120%] opacity-60"
            aria-hidden
          >
            <img src={BG} alt="" className="h-auto w-full object-contain" />
          </div>

          <div className="relative z-10 flex translate-y-10 flex-col items-center gap-10 text-center">
            <Reveal preset="soft" delay={0.22}>
              <Text
                variant="h1"
                size="display"
                className="max-w-[20ch] text-pretty font-display text-[12rem] font-normal italic leading-[0.82] tracking-tighter"
              >
                Спасибо!
              </Text>
            </Reveal>

            <Reveal preset="soft" delay={0.3} className="flex flex-col items-center gap-2">
              <Text variant="overline" className="uppercase tracking-[0.4em] text-[color:var(--slide-color-text-muted)]">
                Telegram
              </Text>
              <Text variant="bodyLg" className="font-mono text-5xl tracking-[0.12em] text-[color:var(--slide-color-text-soft)]">
                @jn0izzze
              </Text>
            </Reveal>

            <Reveal preset="soft" delay={0.38}>
              <Text variant="caption" className="uppercase tracking-[1em] text-[color:var(--slide-color-text-muted)]">
                Конец презентации
              </Text>
            </Reveal>
          </div>
        </div>

        <div className="flex w-full max-w-[1720px] items-end justify-between gap-10 pb-1">
          <Reveal preset="enter-left" delay={0.45} className="max-w-[220px]">
            <Text variant="caption" className="font-mono uppercase leading-relaxed tracking-[0.15em] text-[color:var(--slide-color-text-muted)]">
              // Architecture
              <br />
              // Neural_networks
              <br />
              // Visual_synthesis
              <br />
              // Prompt_engineering
            </Text>
          </Reveal>
          <Reveal preset="enter-right" delay={0.52} className="flex flex-col items-end gap-2 text-right">
            <Text variant="caption" className="uppercase tracking-[0.2em] text-[color:var(--slide-color-text-muted)]">
              Author
            </Text>
            <Text variant="h2" className="max-w-[24ch] text-pretty font-semibold tracking-tight">
              Evseichev Anton
            </Text>
          </Reveal>
        </div>
      </SlideContent>
    </SlideFrame>
  );
}
