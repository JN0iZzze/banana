import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideAssetImage,
  SlideBackdrop,
  SlideColumn,
  SlideContent,
  SlideFrame,
  SlideGrid,
  SlideHeader,
  SlideImageCell,
  SlideImagePair,
  Text,
} from '../../ui/slides';

const IMAGES = {
  angles: '/images/angles/001.png',
  lighting: '/images/angles/002.png',
} as const;

export function CameraAnglesSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <Text variant="meta">{formatSlideMeta('Углы камеры и освещение', index, totalSlides)}</Text>
          }
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={2} className="min-h-0">
            <Reveal
              preset="soft"
              delay={0.12}
              className="flex h-full min-h-0 max-w-[400px] flex-col justify-center gap-6"
            >
              <Text variant="h2" className="max-w-[20ch]">
                Ракурс камеры и освещение
              </Text>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={10} className="min-h-0">
            <SlideImagePair justify="end">
              <Reveal preset="soft" delay={0.22} className="flex h-full min-h-0 shrink-0">
                <SlideImageCell>
                  <SlideAssetImage src={IMAGES.angles} objectAlign="right" />
                </SlideImageCell>
              </Reveal>
              <Reveal preset="soft" delay={0.32} className="flex h-full min-h-0 shrink-0">
                <SlideImageCell>
                  <SlideAssetImage src={IMAGES.lighting} objectAlign="right" />
                </SlideImageCell>
              </Reveal>
            </SlideImagePair>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
