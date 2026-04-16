import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideAssetImage,
  SlideBackdrop,
  SlideBackdropFrame,
  SlideColumn,
  SlideContent,
  SlideFrame,
  SlideGrid,
  SlideHeader,
  Text,
} from '../../ui/slides';

const ASSETS = {
  video: '/images/workflow/extra-v.mp4',
  extra1: '/images/workflow/extra1.png',
  extra2: '/images/workflow/extra2.png',
} as const;

export function WorkflowComparisonSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" className="relative isolate">
      <SlideBackdrop variant="spotlight" accent="primary" />
      <SlideBackdropFrame className="z-20" />

      <SlideContent width="wide" density="compact" className="relative z-30 h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <Text variant="meta">{formatSlideMeta('3D воркфлоу', index, totalSlides)}</Text>
          }
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={6} className="min-h-0">
            <Reveal
              preset="soft"
              delay={0.12}
              className="flex h-full relative min-h-0 items-center justify-center overflow-hidden rounded-3xl"
            >
              <video
                src={ASSETS.video}
                className="inset-[-5%] absolute h-full max-h-full w-auto max-w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </Reveal>
          </SlideColumn>

          <SlideColumn span={6} className="min-h-0">
            <div className="flex h-full min-h-0 flex-col gap-[var(--slide-grid-gap-md)]">
              <Reveal
                preset="soft"
                delay={0.22}
                className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-3xl"
              >
                <SlideAssetImage src={ASSETS.extra1} objectAlign="center" />
              </Reveal>
              <Reveal
                preset="soft"
                delay={0.32}
                className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-3xl"
              >
                <SlideAssetImage src={ASSETS.extra2} objectAlign="center" />
              </Reveal>
            </div>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
