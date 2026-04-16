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
  '/images/grok/g1.jpg',
  '/images/grok/g2.jpg',
  '/images/grok/g3.jpg',
  '/images/grok/g4.jpg',
  '/images/grok/g5.jpg',
  '/images/grok/g6.jpg',
] as const;

const TILE_CLASS =
  'relative flex h-full min-h-0 w-full overflow-hidden rounded-[var(--slide-radius-panel)] bg-[color:var(--slide-color-bg-strong)]';
const HERO_TILE_CLASS =
  'relative aspect-square max-h-full max-w-full min-h-0 min-w-0 overflow-hidden rounded-[var(--slide-radius-panel)] bg-[color:var(--slide-color-bg-strong)]';
/** У `SlideAssetImage` в базе `object-contain`; `cn` без merge — явное `!object-cover`. */
const IMG_CLASS =
  '!block !h-full !min-h-0 !w-full !max-w-none !max-h-none !rounded-none !object-cover';

const RIGHT_ALTS = [
  'Grok Imagine — кадр 2',
  'Grok Imagine — кадр 3',
  'Grok Imagine — кадр 4',
  'Grok Imagine — кадр 5',
  'Grok Imagine — кадр 6',
] as const;

/** Индексы в `IMAGES` / подписи в `RIGHT_ALTS` (g2–g6). */
const RIGHT_TOP = [1, 2] as const;
const RIGHT_BOTTOM = [3, 4, 5] as const;

export function GrokImagineBentoSlide({ index, totalSlides }: SlideRenderProps) {
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
          <Text variant="meta">{formatSlideMeta('Grok Imagine', index, totalSlides)}</Text>
          <Reveal preset="soft" delay={0.08}>
            <Text variant="h1" size="compact" className="max-w-[20ch] leading-[1.02] tracking-[-0.03em]">
              Grok Imagine
            </Text>
          </Reveal>
        </SlideHeader>

        <div className="grid min-h-0 w-full flex-1 grid-cols-2 gap-[var(--slide-grid-gap-md)]">
          <Reveal preset="soft" delay={0.12} className="flex h-full min-h-0 items-center justify-center">
            <div className={HERO_TILE_CLASS}>
              <SlideAssetImage
                src={IMAGES[0]}
                alt="Grok Imagine — кадр 1"
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
                      alt={RIGHT_ALTS[imgIndex - 1]}
                      objectAlign="center"
                      className={IMG_CLASS}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="grid h-full min-h-0 grid-cols-3 gap-[var(--slide-grid-gap-md)]">
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
                      alt={RIGHT_ALTS[imgIndex - 1]}
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
