import type { SlideRenderProps } from '../types';
import { Reveal, SlideBackdrop, SlideContent, SlideFrame, Text } from '../../ui/slides';

export function MinimalTitleSlide({ slide }: SlideRenderProps) {
  return (
    <SlideFrame padding="default" align="center">
      <SlideBackdrop variant="none" />

      <SlideContent
        width="full"
        align="center"
        density="relaxed"
        className="h-full min-h-0 justify-center"
      >
        <Reveal preset="soft" delay={0}>
          <Text
            variant="h1"
            size="display"
            className="mx-auto max-w-[var(--slide-content-wide)] text-center text-pretty tracking-tight"
          >
            {slide.title}
          </Text>
        </Reveal>
      </SlideContent>
    </SlideFrame>
  );
}
