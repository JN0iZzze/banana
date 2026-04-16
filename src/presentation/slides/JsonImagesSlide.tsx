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

/** Заголовок над каждым изображением (пустая строка — строка заголовка не показывается) */
const JSON_IMAGE_PANELS: readonly { src: string; title: string }[] = [
  { src: '/images/composition/ref.jpg', title: 'Оригинал' },
  { src: '/images/json/via_ref.png', title: 'По референсу' },
  { src: '/images/json/001.png', title: 'По JSON-промпту' },
];

const CELL =
  'relative min-h-0 flex-1 overflow-hidden rounded-[var(--slide-radius-inner)]';
const IMG = 'block h-full w-full object-cover object-center';

export function JsonImagesSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={<Text variant="meta">{formatSlideMeta('JSON и изображения', index, totalSlides)}</Text>}
        />

        <div className="grid min-h-0 w-full flex-1 auto-rows-fr grid-cols-3 gap-[var(--slide-grid-gap-md)] self-stretch">
          {JSON_IMAGE_PANELS.map((panel, i) => (
            <Reveal
              key={panel.src}
              preset="soft"
              delay={0.12 + i * 0.1}
              className="flex h-full min-h-0 flex-col gap-[var(--slide-stack-gap-sm)]"
            >
              {panel.title.trim() ? (
                <Text variant="h2" className="shrink-0 text-center">
                  {panel.title.trim()}
                </Text>
              ) : null}
              <div className={CELL}>
                <img src={panel.src} alt="" className={IMG} />
              </div>
            </Reveal>
          ))}
        </div>
      </SlideContent>
    </SlideFrame>
  );
}
