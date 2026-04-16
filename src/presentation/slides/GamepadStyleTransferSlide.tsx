import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideBackdrop,
  SlideColumn,
  SlideContent,
  SlideFrame,
  SlideGrid,
  SlideHeader,
  SlidePromptQuote,
  Text,
} from '../../ui/slides';

const IMAGES = {
  ref: '/images/yndx/ref.png',
  gamepad: '/images/yndx/gampad.png',
} as const;

const PROMPT = 'Playstation DualSense gamepad in this style, ignore round coin-shaped object';

export function GamepadStyleTransferSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <Text variant="meta">{formatSlideMeta('Перенос стиля', index, totalSlides)}</Text>
          }
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={3} className="min-h-0">
            <Reveal
              preset="soft"
              delay={0.12}
              className="flex h-full min-h-0 max-w-[400px] flex-col justify-center gap-6"
            >
              <Text variant="overline">Перенос стиля</Text>
              <SlidePromptQuote>{PROMPT}</SlidePromptQuote>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={9} className="min-h-0">
            <div className="grid h-full min-h-0 w-full grid-cols-[380px_minmax(0,1fr)] items-start gap-[var(--slide-grid-gap-md)] overflow-hidden">
              <Reveal preset="soft" delay={0.22} className="min-h-0 w-full max-w-[380px] shrink-0">
                <div className="overflow-hidden rounded-[var(--slide-radius-inner)]">
                  <img src={IMAGES.ref} alt="" className="block max-h-full w-full object-contain" />
                </div>
              </Reveal>

              <Reveal preset="soft" delay={0.32} className="flex h-full min-h-0 items-start justify-end">
                <div className="aspect-square h-full max-h-full min-h-0 w-auto overflow-hidden rounded-[var(--slide-radius-inner)]">
                  <img src={IMAGES.gamepad} alt="" className="h-full w-full object-cover" />
                </div>
              </Reveal>
            </div>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
