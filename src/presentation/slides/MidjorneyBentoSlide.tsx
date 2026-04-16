import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideAssetImage,
  SlideBackdrop,
  SlideBackdropFrame,
  SlideContent,
  SlideFrame,
  SlideHeader,
  Text,
} from '../../ui/slides';

const IMAGES = [
  '/images/midjorney/001.jpg',
  '/images/midjorney/002.jpg',
  '/images/midjorney/003.jpg',
  '/images/midjorney/004.jpg',
  '/images/midjorney/005.png',
  '/images/midjorney/006.png',
  '/images/midjorney/007.png',
] as const;

const TILE_CLASS =
  'relative flex h-full min-h-0 w-full overflow-hidden rounded-[var(--slide-radius-panel)] bg-[color:var(--slide-color-bg-strong)]';
const HERO_TILE_CLASS =
  'relative aspect-square max-h-full max-w-full min-h-0 min-w-0 overflow-hidden rounded-[var(--slide-radius-panel)] bg-[color:var(--slide-color-bg-strong)]';
const IMG_CLASS =
  '!block !h-full !min-h-0 !w-full !max-w-none !max-h-none !rounded-none !object-cover';

const ALTS = [
  'Midjorney — кадр 1',
  'Midjorney — кадр 2',
  'Midjorney — кадр 3',
  'Midjorney — кадр 4',
  'Midjorney — кадр 5',
  'Midjorney — кадр 6',
  'Midjorney — кадр 7',
] as const;

const RIGHT_TOP = [1, 2] as const;
const RIGHT_BOTTOM = [3, 4, 5, 6] as const;

export function MidjorneyBentoSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" className="relative isolate min-h-0">
      <SlideBackdrop variant="spotlight" accent="primary" />
      <SlideBackdropFrame className="z-20" />

      <SlideContent
        width="wide"
        density="compact"
        className="relative z-30 h-full min-h-0 justify-between gap-[var(--slide-stack-gap-md)]"
      >
        <SlideHeader className="max-w-[1720px] shrink-0 gap-3">
          <Text variant="meta">{formatSlideMeta('Midjorney', index, totalSlides)}</Text>
          <Reveal preset="soft" delay={0.08}>
            <Text variant="h1" size="compact" className="max-w-[20ch] leading-[1.02] tracking-[-0.03em]">
              Midjorney
            </Text>
          </Reveal>
        </SlideHeader>

        <div className="grid min-h-0 w-full flex-1 grid-cols-2 gap-[var(--slide-grid-gap-md)]">
          <Reveal preset="soft" delay={0.12} className="flex h-full min-h-0 items-center justify-center">
            <div className={HERO_TILE_CLASS}>
              <SlideAssetImage
                src={IMAGES[0]}
                alt={ALTS[0]}
                objectAlign="center"
                className={IMG_CLASS}
              />
            </div>
          </Reveal>

          <div className="grid h-full min-h-0 min-w-0 grid-rows-2 gap-[var(--slide-grid-gap-md)] [grid-template-rows:minmax(0,1fr)_minmax(0,1fr)]">
            <div className="grid h-full min-h-0 grid-cols-2 gap-[var(--slide-grid-gap-md)]">
              {RIGHT_TOP.map((imgIndex, i) => (
                <Reveal
                  key={IMAGES[imgIndex]}
                  preset="soft"
                  delay={0.16 + i * 0.04}
                  className="h-full min-h-0"
                >
                  <div className={TILE_CLASS}>
                    <SlideAssetImage
                      src={IMAGES[imgIndex]}
                      alt={ALTS[imgIndex]}
                      objectAlign="center"
                      className={IMG_CLASS}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="grid h-full min-h-0 grid-cols-4 gap-[var(--slide-grid-gap-md)]">
              {RIGHT_BOTTOM.map((imgIndex, i) => (
                <Reveal
                  key={IMAGES[imgIndex]}
                  preset="soft"
                  delay={0.24 + i * 0.04}
                  className="h-full min-h-0"
                >
                  <div className={TILE_CLASS}>
                    <SlideAssetImage
                      src={IMAGES[imgIndex]}
                      alt={ALTS[imgIndex]}
                      objectAlign="center"
                      className={IMG_CLASS}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </SlideContent>
    </SlideFrame>
  );
}
