import type {
  JsonSlideMediaGalleryCellVariant,
  JsonSlideMediaGalleryItem,
  JsonSlideMediaGalleryLayout,
  JsonSlideMediaGalleryPreset,
} from '../../jsonSlideTypes';
import { Reveal, SlideAssetImage, SlideImagePair, Text } from '../../../ui/slides';
import { cn } from '../../../ui/slides/cn';
import { bentoGridGapCssVar } from './bentoGridGapVar';

function gridTemplateColumns(count: number): string {
  if (count === 1) return 'repeat(1, minmax(0, 1fr))';
  if (count === 2) return 'repeat(2, minmax(0, 1fr))';
  if (count === 3) return 'repeat(3, minmax(0, 1fr))';
  return 'repeat(2, minmax(0, 1fr))'; // 4 items → 2×2
}

function isAutoPreset(preset: JsonSlideMediaGalleryPreset | undefined): boolean {
  return preset === undefined || preset === 'auto';
}

function effectiveCellMode(cellVariant: JsonSlideMediaGalleryCellVariant | undefined): 'panel' | 'fill' {
  return cellVariant === 'fill' ? 'fill' : 'panel';
}

interface MediaItemProps {
  item: JsonSlideMediaGalleryItem;
  delay: number;
  /**
   * When the gallery splits the row (pair/row), each cell must share width (`flex-1` parents).
   */
  frameWidth?: 'content' | 'fill';
  cellMode?: 'panel' | 'fill';
}

function renderImageFillCell(item: Extract<JsonSlideMediaGalleryItem, { type: 'image' }>) {
  const fit = item.objectFit ?? 'cover';
  return (
    <img
      src={item.src}
      alt={item.alt ?? ''}
      className={cn(
        'block h-full w-full',
        fit === 'cover' ? 'object-cover object-center' : 'object-contain object-center',
      )}
    />
  );
}

function renderVideoFillCell(item: Extract<JsonSlideMediaGalleryItem, { type: 'video' }>) {
  const fit = item.objectFit ?? 'cover';
  return (
    <video
      src={item.src}
      className={cn('h-full w-full', fit === 'cover' ? 'object-cover' : 'object-contain')}
      autoPlay={item.autoplay !== false}
      loop={item.loop !== false}
      muted={item.muted !== false}
      playsInline={item.playsInline !== false}
    />
  );
}

function MediaItem({ item, delay, frameWidth = 'content', cellMode = 'panel' }: MediaItemProps) {
  const showCaption = item.showCaption === true && item.caption != null;
  const mediaFrameMaxHeightClass = showCaption ? 'max-h-[calc(100%_-_1.75rem)]' : 'max-h-full';
  const widthClass = frameWidth === 'fill' ? 'w-full' : 'w-fit';
  const isPairStrip = frameWidth === 'fill' && cellMode === 'panel';

  if (cellMode === 'fill') {
    return (
      <Reveal preset="soft" delay={delay} className="flex h-full min-h-0 w-full min-w-0 flex-col">
        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-[var(--slide-radius-inner)]">
          {item.type === 'image' ? renderImageFillCell(item) : renderVideoFillCell(item)}
        </div>
        {showCaption ? (
          <Text variant="overline" className="mt-2 shrink-0 text-center tracking-[0.35em]">
            {item.caption}
          </Text>
        ) : null}
      </Reveal>
    );
  }

  return (
    <Reveal
      preset="soft"
      delay={delay}
      className={
        isPairStrip
          ? 'flex h-full min-h-0 w-full min-w-0'
          : 'flex h-full min-h-0 w-full min-w-0 flex-col items-center justify-center'
      }
    >
      {isPairStrip ? (
        <div className="flex h-full w-full min-h-0 min-w-0 items-center justify-end overflow-hidden">
          {item.type === 'image' ? (
            item.objectFit === 'cover' ? (
              renderImageFillCell(item)
            ) : (
              <SlideAssetImage
                src={item.src}
                alt={item.alt ?? ''}
                objectAlign={item.objectAlign ?? 'right'}
                className="!h-auto max-h-full"
              />
            )
          ) : (
            <video
              src={item.src}
              className={[
                'h-auto max-w-full max-h-full rounded-3xl',
                item.objectFit === 'cover' ? 'object-cover' : 'object-contain',
              ]
                .filter(Boolean)
                .join(' ')}
              autoPlay={item.autoplay !== false}
              loop={item.loop !== false}
              muted={item.muted !== false}
              playsInline={item.playsInline !== false}
            />
          )}
        </div>
      ) : (
        <div
          className={[
            'flex min-h-0 max-w-full items-center justify-center overflow-hidden rounded-[var(--slide-radius-panel)]',
            widthClass,
            mediaFrameMaxHeightClass,
          ].join(' ')}
        >
          {item.type === 'image' ? (
            item.objectFit === 'cover' ? (
              <img
                src={item.src}
                alt={item.alt ?? ''}
                className="block h-auto max-h-full w-auto max-w-full object-cover object-center"
              />
            ) : (
              <SlideAssetImage
                src={item.src}
                alt={item.alt ?? ''}
                objectAlign={item.objectAlign ?? 'center'}
                className={[
                  '!h-auto',
                  'max-h-full',
                  showCaption ? 'object-bottom' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            )
          ) : (
            <video
              src={item.src}
              className={[
                'h-auto max-w-full rounded-[var(--slide-radius-panel)]',
                'max-h-full',
                item.objectFit === 'cover' ? 'object-cover' : 'object-contain',
                showCaption ? 'object-bottom' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              autoPlay={item.autoplay !== false}
              loop={item.loop !== false}
              muted={item.muted !== false}
              playsInline={item.playsInline !== false}
            />
          )}
        </div>
      )}
      {showCaption && !isPairStrip ? (
        <Text variant="overline" className="mt-2 shrink-0 text-center tracking-[0.35em]">
          {item.caption}
        </Text>
      ) : null}
    </Reveal>
  );
}

export interface JsonMediaGalleryLayoutProps {
  layout: JsonSlideMediaGalleryLayout;
}

function stripJustify(justify: 'start' | 'end' | undefined) {
  return justify === 'start' ? 'start' : 'end';
}

function CountBasedGallery({
  items,
  gapValue,
  cellMode,
}: {
  items: JsonSlideMediaGalleryItem[];
  gapValue: string;
  cellMode: 'panel' | 'fill';
}) {
  const count = items.length;
  if (count >= 5) {
    return (
      <div
        className="flex min-h-0 flex-1 flex-wrap items-stretch justify-center"
        style={{ gap: gapValue }}
      >
        {items.map((item, i) => (
          <div
            key={`mgallery-${i}`}
            className="min-h-0"
            style={{ flexBasis: '20%', maxWidth: '20%' }}
          >
            <MediaItem item={item} delay={0.2 + i * 0.08} cellMode={cellMode} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid min-h-0 w-full flex-1 auto-rows-fr items-stretch"
      style={{ gap: gapValue, gridTemplateColumns: gridTemplateColumns(count) }}
    >
      {items.map((item, i) => (
        <div key={`mgallery-${i}`} className="min-h-0">
          <MediaItem item={item} delay={0.2 + i * 0.08} cellMode={cellMode} />
        </div>
      ))}
    </div>
  );
}

export function JsonMediaGalleryLayoutView({ layout }: JsonMediaGalleryLayoutProps) {
  const { items, gap, preset, rowJustify, cellVariant } = layout;
  const gapValue = bentoGridGapCssVar(gap);
  const j = stripJustify(rowJustify);
  const autoMode = isAutoPreset(preset);
  const cellMode = effectiveCellMode(cellVariant);

  if (autoMode) {
    return <CountBasedGallery items={items} gapValue={gapValue} cellMode={cellMode} />;
  }

  if (preset === 'single') {
    const item = items[0];
    return (
      <div className="flex min-h-0 w-full flex-1 auto-rows-fr items-stretch" style={{ gap: gapValue }}>
        <div className="min-h-0 w-full">
          <MediaItem item={item} delay={0.2} cellMode={cellMode} />
        </div>
      </div>
    );
  }

  if (preset === 'column') {
    const rowTracks = items.map(() => 'minmax(0, 1fr)').join(' ');
    return (
      <div
        className="grid h-full min-h-0 min-w-0 w-full flex-1"
        style={{
          gap: gapValue,
          gridTemplateColumns: 'minmax(0, 1fr)',
          gridTemplateRows: rowTracks,
        }}
      >
        {items.map((item, i) => (
          <div key={`mgallery-col-${i}`} className="min-h-0 min-w-0">
            <MediaItem item={item} delay={0.2 + i * 0.08} cellMode={cellMode} />
          </div>
        ))}
      </div>
    );
  }

  if (preset === 'pair') {
    if (cellMode === 'fill') {
      return (
        <div
          className="grid h-full min-h-0 min-w-0 w-full flex-1 grid-cols-2"
          style={{ gap: gapValue }}
        >
          {items.map((item, i) => (
            <div key={`mgallery-${i}`} className="min-h-0 min-w-0">
              <MediaItem item={item} delay={0.2 + i * 0.08} cellMode="fill" />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
        <SlideImagePair justify={j} className="min-w-0" style={{ gap: gapValue }}>
          {items.map((item, i) => (
            <Reveal
              key={`mgallery-${i}`}
              preset="soft"
              delay={0.2 + i * 0.08}
              className="flex h-full min-h-0 shrink-0"
            >
              <div className="flex h-full min-h-0 shrink-0 items-center justify-end overflow-hidden">
                {item.type === 'image' ? (
                  <SlideAssetImage
                    src={item.src}
                    alt={item.alt ?? ''}
                    objectAlign={item.objectAlign ?? 'right'}
                  />
                ) : (
                  <video
                    src={item.src}
                    className={[
                      'h-auto max-w-full rounded-3xl',
                      item.objectFit === 'cover' ? 'object-cover' : 'object-contain',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    autoPlay={item.autoplay !== false}
                    loop={item.loop !== false}
                    muted={item.muted !== false}
                    playsInline={item.playsInline !== false}
                  />
                )}
              </div>
            </Reveal>
          ))}
        </SlideImagePair>
      </div>
    );
  }

  if (preset === 'row') {
    return (
      <div
        className={[
          'flex min-h-0 w-full flex-1 flex-row items-stretch',
          j === 'end' ? 'justify-end' : 'justify-start',
        ].join(' ')}
        style={{ gap: gapValue }}
      >
        {items.map((item, i) => (
          <div key={`mgallery-${i}`} className="min-h-0 min-w-0 flex-1">
            <MediaItem item={item} delay={0.2 + i * 0.08} frameWidth="fill" cellMode={cellMode} />
          </div>
        ))}
      </div>
    );
  }

  return <CountBasedGallery items={items} gapValue={gapValue} cellMode={cellMode} />;
}
