import type {
  JsonSlideMediaGalleryCellVariant,
  JsonSlideMediaGalleryItem,
  JsonSlideMediaGalleryLayout,
  JsonSlideMediaGalleryPreset,
  JsonSlideMediaGalleryVerticalAlign,
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

/** Single source for media corners inside JSON `mediaGallery` (must match `contain` vs `clip` rules below). */
const GALLERY_MEDIA_RADIUS = 'rounded-[var(--slide-radius-media)]';

function effectiveVerticalAlign(
  v: JsonSlideMediaGalleryVerticalAlign | undefined,
): JsonSlideMediaGalleryVerticalAlign {
  return v ?? 'center';
}

/** For `flex-row` containers, vertical alignment uses `items-*` (cross axis). */
function rowCrossForVertical(
  v: JsonSlideMediaGalleryVerticalAlign,
): 'items-start' | 'items-center' | 'items-end' {
  if (v === 'top') return 'items-start';
  if (v === 'bottom') return 'items-end';
  return 'items-center';
}

/** For `flex-col` containers, vertical alignment uses `justify-*` (main axis). */
function colMainForVertical(
  v: JsonSlideMediaGalleryVerticalAlign,
): 'justify-start' | 'justify-center' | 'justify-end' {
  if (v === 'top') return 'justify-start';
  if (v === 'bottom') return 'justify-end';
  return 'justify-center';
}

interface MediaItemProps {
  item: JsonSlideMediaGalleryItem;
  delay: number;
  /**
   * When the gallery splits the row (pair/row), each cell must share width (`flex-1` parents).
   */
  frameWidth?: 'content' | 'fill';
  cellMode?: 'panel' | 'fill';
  verticalAlign?: JsonSlideMediaGalleryVerticalAlign;
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

function mediaItemObjectFit(item: JsonSlideMediaGalleryItem): 'cover' | 'contain' {
  return item.objectFit ?? 'cover';
}

function MediaItem({ item, delay, frameWidth = 'content', cellMode = 'panel', verticalAlign }: MediaItemProps) {
  const v = effectiveVerticalAlign(verticalAlign);
  const showCaption = item.showCaption === true && item.caption != null;
  const mediaFrameMaxHeightClass = showCaption ? 'max-h-[calc(100%_-_1.75rem)]' : 'max-h-full';
  const widthClass = frameWidth === 'fill' ? 'w-full' : 'w-fit';
  const isPairStrip = frameWidth === 'fill' && cellMode === 'panel';
  const fit = mediaItemObjectFit(item);

  if (cellMode === 'fill') {
    if (fit === 'contain' && (item.type === 'image' || item.type === 'video')) {
      return (
        <Reveal preset="scale-in" delay={delay} className="flex h-full min-h-0 w-full min-w-0 flex-col">
          <div
            className={cn('relative flex min-h-0 min-w-0 flex-1 justify-center', rowCrossForVertical(v))}
          >
            {item.type === 'image' ? (
              <img
                src={item.src}
                alt={item.alt ?? ''}
                className={cn(
                  'block h-auto max-h-full w-auto max-w-full object-contain object-center',
                  GALLERY_MEDIA_RADIUS,
                )}
              />
            ) : (
              <video
                src={item.src}
                className={cn('h-auto max-h-full max-w-full w-auto object-contain', GALLERY_MEDIA_RADIUS)}
                autoPlay={item.autoplay !== false}
                loop={item.loop !== false}
                muted={item.muted !== false}
                playsInline={item.playsInline !== false}
              />
            )}
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
      <Reveal preset="scale-in" delay={delay} className="flex h-full min-h-0 w-full min-w-0 flex-col">
        <div
          className={cn('relative min-h-0 min-w-0 flex-1 overflow-hidden', GALLERY_MEDIA_RADIUS)}
        >
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
      preset="scale-in"
      delay={delay}
      className={
        isPairStrip
          ? 'flex h-full min-h-0 w-full min-w-0'
          : cn('flex h-full min-h-0 w-full min-w-0 flex-col items-center', colMainForVertical(v))
      }
    >
      {isPairStrip ? (
        <div
          className={cn(
            'flex h-full w-full min-h-0 min-w-0 justify-end overflow-hidden',
            rowCrossForVertical(v),
          )}
        >
          {item.type === 'image' ? (
            item.objectFit === 'cover' ? (
              <div
                className={cn('h-full w-full min-h-0 min-w-0 overflow-hidden', GALLERY_MEDIA_RADIUS)}
              >
                {renderImageFillCell(item)}
              </div>
            ) : (
              <SlideAssetImage
                src={item.src}
                alt={item.alt ?? ''}
                objectAlign={item.objectAlign ?? 'right'}
                className={cn('!h-auto max-h-full', GALLERY_MEDIA_RADIUS)}
              />
            )
          ) : (
            <video
              src={item.src}
              className={cn(
                'h-auto max-w-full max-h-full',
                GALLERY_MEDIA_RADIUS,
                item.objectFit === 'cover' ? 'object-cover' : 'object-contain',
              )}
              autoPlay={item.autoplay !== false}
              loop={item.loop !== false}
              muted={item.muted !== false}
              playsInline={item.playsInline !== false}
            />
          )}
        </div>
      ) : fit === 'cover' && (item.type === 'image' || item.type === 'video') ? (
        <div
          className={cn(
            'flex min-h-0 max-w-full justify-center overflow-hidden',
            rowCrossForVertical(v),
            GALLERY_MEDIA_RADIUS,
            widthClass,
            mediaFrameMaxHeightClass,
          )}
        >
          {item.type === 'image' ? (
            <img
              src={item.src}
              alt={item.alt ?? ''}
              className="block h-auto max-h-full w-auto max-w-full object-cover object-center"
            />
          ) : (
            <video
              src={item.src}
              className={cn(
                'h-auto max-w-full max-h-full',
                item.objectFit === 'cover' ? 'object-cover' : 'object-contain',
                showCaption ? 'object-bottom' : '',
              )}
              autoPlay={item.autoplay !== false}
              loop={item.loop !== false}
              muted={item.muted !== false}
              playsInline={item.playsInline !== false}
            />
          )}
        </div>
      ) : (
        <div
          className={cn(
            'flex min-h-0 max-w-full justify-center',
            rowCrossForVertical(v),
            widthClass,
            mediaFrameMaxHeightClass,
          )}
        >
          {item.type === 'image' ? (
            <SlideAssetImage
              src={item.src}
              alt={item.alt ?? ''}
              objectAlign={item.objectAlign ?? 'center'}
              className={cn(
                '!h-auto',
                'max-h-full',
                GALLERY_MEDIA_RADIUS,
                showCaption ? 'object-bottom' : '',
              )}
            />
          ) : (
            <video
              src={item.src}
              className={cn(
                'h-auto max-w-full max-h-full',
                GALLERY_MEDIA_RADIUS,
                item.objectFit === 'cover' ? 'object-cover' : 'object-contain',
                showCaption ? 'object-bottom' : '',
              )}
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
  verticalAlign,
}: {
  items: JsonSlideMediaGalleryItem[];
  gapValue: string;
  cellMode: 'panel' | 'fill';
  verticalAlign: JsonSlideMediaGalleryVerticalAlign | undefined;
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
            <MediaItem
              item={item}
              delay={0.2 + i * 0.08}
              cellMode={cellMode}
              verticalAlign={verticalAlign}
            />
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
          <MediaItem
            item={item}
            delay={0.2 + i * 0.08}
            cellMode={cellMode}
            verticalAlign={verticalAlign}
          />
        </div>
      ))}
    </div>
  );
}

export function JsonMediaGalleryLayoutView({ layout }: JsonMediaGalleryLayoutProps) {
  const { items, gap, preset, rowJustify, cellVariant, verticalAlign } = layout;
  const gapValue = bentoGridGapCssVar(gap);
  const j = stripJustify(rowJustify);
  const autoMode = isAutoPreset(preset);
  const cellMode = effectiveCellMode(cellVariant);
  const va = verticalAlign;

  if (autoMode) {
    return <CountBasedGallery items={items} gapValue={gapValue} cellMode={cellMode} verticalAlign={va} />;
  }

  if (preset === 'single') {
    const item = items[0];
    return (
      <div className="flex min-h-0 w-full flex-1 auto-rows-fr items-stretch" style={{ gap: gapValue }}>
        <div className="min-h-0 w-full">
          <MediaItem item={item} delay={0.2} cellMode={cellMode} verticalAlign={va} />
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
            <MediaItem item={item} delay={0.2 + i * 0.08} cellMode={cellMode} verticalAlign={va} />
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
              <MediaItem item={item} delay={0.2 + i * 0.08} cellMode="fill" verticalAlign={va} />
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
              preset="scale-in"
              delay={0.2 + i * 0.08}
              className="flex h-full min-h-0 shrink-0"
            >
              <div
                className={cn(
                  'flex h-full min-h-0 shrink-0 justify-end overflow-hidden',
                  rowCrossForVertical(effectiveVerticalAlign(va)),
                )}
              >
                {item.type === 'image' ? (
                  <SlideAssetImage
                    src={item.src}
                    alt={item.alt ?? ''}
                    objectAlign={item.objectAlign ?? 'right'}
                    className={GALLERY_MEDIA_RADIUS}
                  />
                ) : (
                  <video
                    src={item.src}
                    className={cn(
                      'h-auto max-w-full',
                      GALLERY_MEDIA_RADIUS,
                      item.objectFit === 'cover' ? 'object-cover' : 'object-contain',
                    )}
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
            <MediaItem
              item={item}
              delay={0.2 + i * 0.08}
              frameWidth="fill"
              cellMode={cellMode}
              verticalAlign={va}
            />
          </div>
        ))}
      </div>
    );
  }

  return <CountBasedGallery items={items} gapValue={gapValue} cellMode={cellMode} verticalAlign={va} />;
}
