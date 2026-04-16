import type { SlideRenderProps } from '../types';
import { Reveal, SlideBackdropFrame, SlideFrame, Text } from '../../ui/slides';

export function NanoBananaProSlide(_props: SlideRenderProps) {
  return (
    <SlideFrame align="center" className="p-0 items-center justify-center">
      <div className="pointer-events-none absolute inset-0 z-0">
        <img src="/bg/banana.png" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-pink-500/80" aria-hidden />
      </div>

      <SlideBackdropFrame className="z-20" />

      <div className="absolute top-[var(--slide-safe-y)] left-[var(--slide-safe-x)] right-[var(--slide-safe-x)] z-30 flex justify-between">
        <Reveal preset="soft" delay={0.2}>
          <Text variant="overline">Gemini · Nano Banana</Text>
        </Reveal>
        <Reveal preset="soft" delay={0.4}>
          <Text variant="overline" className="text-right">
            2026
          </Text>
        </Reveal>
      </div>

      <div className="relative z-30 text-center translate-y-[100px]">
        <Reveal preset="enter-up" delay={0.45}>
          <h1 className="font-display italic text-[18rem] leading-[0.58] tracking-tighter text-[#ffd700]">
            &nbsp;&nbsp;Nano Banana
          </h1>
          <br />
          <h1 className="font-serif italic text-[12rem] leading-[1] tracking-tighter text-[#ffd700]">
            flash, pro, v2
          </h1>
        </Reveal>
      </div>

      <div className="absolute bottom-[var(--slide-safe-y)] left-[var(--slide-safe-x)] right-[var(--slide-safe-x)] z-30 flex justify-between items-end gap-[var(--slide-grid-gap-lg)]">
        <Reveal preset="soft" delay={0.6} className="max-w-[18rem]">
          <Text variant="overline" className="font-semibold uppercase tracking-[0.2em]">
            Flash · Pro · 2
            <br />
            Model tiers
          </Text>
        </Reveal>
        <Reveal preset="soft" delay={0.7} className="text-center">
          <Text variant="overline" className="font-semibold uppercase tracking-[0.2em]">
            Moscow, 105120
            <br />
            UX/UI 2026
          </Text>
        </Reveal>
        <Reveal preset="soft" delay={0.8} className="max-w-[18rem] text-right">
          <Text variant="overline" className="font-semibold uppercase tracking-[0.2em]">
            Edit · composite
            <br />
            Multimodal image
          </Text>
        </Reveal>
      </div>
    </SlideFrame>
  );
}
