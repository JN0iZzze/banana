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

const VIDEO_SRC = '/flow.mp4' as const;

export function FlouxDemoSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="default" className="min-h-0">
      <SlideBackdrop variant="mesh" accent="primary" />

      <SlideContent
        width="wide"
        density="compact"
        className="h-full min-h-0 justify-between gap-[var(--slide-stack-gap-md)]"
      >
        <SlideHeader
          className="max-w-[var(--slide-content-wide)] shrink-0"
          meta={
            <Text variant="meta">{formatSlideMeta('Floux.pro', index, totalSlides)}</Text>
          }
        >
          <Reveal preset="soft" delay={0.1}>
            <Text
              variant="h1"
              size="section"
              className="text-[color:var(--slide-color-text-soft)] tracking-tight"
            >
              Floux.pro
            </Text>
          </Reveal>
        </SlideHeader>

        <Reveal
          preset="soft"
          delay={0.2}
          className="flex min-h-0 w-full flex-1 items-center justify-center"
        >
          <video
            src={VIDEO_SRC}
            className="max-h-full max-w-full rounded-[2rem] object-contain"
            autoPlay
            loop
            muted
            playsInline
          />
        </Reveal>
      </SlideContent>
    </SlideFrame>
  );
}
