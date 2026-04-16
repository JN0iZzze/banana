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
  Text,
} from '../../ui/slides';

const IMAGE = '/images/higgsfield.png' as const;

export function HiggsfieldSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          align="center"
          className="max-w-[1720px] shrink-0 gap-4"
          meta={
            <Text variant="meta" className="text-center">
              {formatSlideMeta('Higgsfield', index, totalSlides)}
            </Text>
          }
        >
          <Reveal preset="soft" delay={0.1}>
            <Text variant="h1" size="section" className="text-center">
              Higgsfield
            </Text>
          </Reveal>
        </SlideHeader>

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={12} className="min-h-0">
            <Reveal preset="soft" delay={0.2} className="flex h-full min-h-0 flex-col">
              <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-[var(--slide-radius-panel)]">
                <SlideAssetImage src={IMAGE} objectAlign="center" alt="Higgsfield" />
              </div>
            </Reveal>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
