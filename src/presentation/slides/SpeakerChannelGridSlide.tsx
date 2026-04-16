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
  Text,
} from '../../ui/slides';

const AVATAR = '/images/max-tg.jpg' as const;

const GRID_ITEMS = [
  { kind: 'image' as const, src: '/images/max/001.jpg' },
  { kind: 'image' as const, src: '/images/max/002.jpg' },
  { kind: 'image' as const, src: '/images/max/003.jpg' },
  { kind: 'video' as const, src: '/images/max/004.mp4' },
] as const;

const CELL = 'relative min-h-0 overflow-hidden rounded-[var(--slide-radius-inner)]';
const MEDIA = 'block h-full w-full object-cover';

export function SpeakerChannelGridSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <Text variant="meta">{formatSlideMeta('Макс Кукушкин', index, totalSlides)}</Text>
          }
        />

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={5} className="min-h-0">
            <Reveal
              preset="soft"
              delay={0.1}
              className="flex h-full min-h-0 flex-col items-center justify-center gap-8 text-center"
            >
              <div className="flex h-56 w-56 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[color:var(--slide-color-line)]">
                <img src={AVATAR} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex max-w-xl flex-col gap-2">
                <Text variant="h2" className="text-center">
                  Макс Кукушкин
                </Text>
                <Text variant="bodyLg" className="text-center text-[color:var(--slide-color-text-soft)]">
                  арт-директор в дизайн-студии ЦЕХ
                </Text>
              </div>
              <Text variant="caption" className="font-mono text-[1.5rem] opacity-80">
                t.me/maxkukushkin
              </Text>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={7} className="min-h-0">
            <div className="grid h-full min-h-0 w-full min-w-0 grid-cols-2 grid-rows-2 gap-[var(--slide-grid-gap-md)]">
              {GRID_ITEMS.map((item, i) => (
                <Reveal
                  key={item.src}
                  preset="soft"
                  delay={0.14 + i * 0.08}
                  className="min-h-0 min-w-0"
                >
                  <div className={`${CELL} h-full w-full`}>
                    {item.kind === 'image' ? (
                      <img src={item.src} alt="" className={MEDIA} />
                    ) : (
                      <video
                        src={item.src}
                        className={MEDIA}
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
