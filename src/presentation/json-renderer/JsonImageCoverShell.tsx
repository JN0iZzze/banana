import { Fragment, type ReactNode } from 'react';
import type {
  JsonImageCover,
  JsonImageCoverClusterGap,
  JsonImageCoverHeadlineBlock,
  JsonImageCoverHeadlineColor,
  JsonImageCoverHeadlineBlockSize,
  JsonImageCoverRailItem,
  JsonImageCoverRailTextStyle,
} from '../jsonSlideTypes';
import { cn } from '../../ui/slides/cn';
import { Reveal, SlideBackdropFrame, SlideFrame, Text } from '../../ui/slides';
import { useEditableTextProps, useInspectorSelectable } from '../../creator/inline-edit';

function overlayNode(overlay: JsonImageCover['background']['overlay']): ReactNode {
  if (overlay === 'none') {
    return null;
  }
  if (overlay === 'gradientPinkBottom') {
    return <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-pink-500/80" aria-hidden />;
  }
  if (overlay === 'gradientBg55') {
    return (
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-[color-mix(in_srgb,var(--slide-color-bg)_55%,transparent)]"
        aria-hidden
      />
    );
  }
  return (
    <div
      className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-[color-mix(in_srgb,var(--slide-color-bg)_80%,transparent)]"
      aria-hidden
    />
  );
}

const clusterGapClass: Record<JsonImageCoverClusterGap, string> = {
  md: 'gap-8',
  lg: 'gap-12',
};

function linesToNodes(lines: string[]): ReactNode {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {line}
    </Fragment>
  ));
}

type RailBasePath = 'cover.topRail' | 'cover.bottomRail';

function RailEditableLine({
  basePath,
  itemIndex,
  lineIndex,
  text,
  className,
}: {
  basePath: RailBasePath;
  itemIndex: number;
  lineIndex: number;
  text: string;
  className?: string;
}) {
  const editableProps = useEditableTextProps(`${basePath}.items.${itemIndex}.lines.${lineIndex}`);
  return (
    <Text variant="overline" className={className} {...editableProps}>
      {text}
    </Text>
  );
}

function RailEditableLines({
  basePath,
  itemIndex,
  lines,
  className,
}: {
  basePath: RailBasePath;
  itemIndex: number;
  lines: string[];
  className?: string;
}): ReactNode {
  if (lines.length === 1) {
    return (
      <RailEditableLine
        basePath={basePath}
        itemIndex={itemIndex}
        lineIndex={0}
        text={lines[0]!}
        className={className}
      />
    );
  }
  return (
    <span className="flex flex-col">
      {lines.map((line, j) => (
        <RailEditableLine
          key={j}
          basePath={basePath}
          itemIndex={itemIndex}
          lineIndex={j}
          text={line}
          className={className}
        />
      ))}
    </span>
  );
}

const labelCaps = 'font-semibold uppercase tracking-[0.2em]';
const railInverted = `text-white ${labelCaps}`;

function railTextClass(style: JsonImageCoverRailTextStyle | undefined, rowToneInverted: boolean): string {
  if (rowToneInverted) {
    return railInverted;
  }
  if (style === 'inverted') {
    return railInverted;
  }
  if (style === 'label') {
    return labelCaps;
  }
  return '';
}

function railTextAlignClass(align: 'left' | 'center' | 'right' | undefined): string {
  if (align === 'right') {
    return 'text-right';
  }
  if (align === 'center') {
    return 'text-center';
  }
  return '';
}

function renderTopRailItem(
  item: JsonImageCoverRailItem,
  itemIndex: number,
  rowToneInverted: boolean,
): ReactNode {
  if (item.kind === 'cluster') {
    return (
      <div className={cn('flex', clusterGapClass[item.gap])}>
        {item.items.map((sub, j) => (
          <Text
            // eslint-disable-next-line react/no-array-index-key
            key={j}
            variant="overline"
            className={rowToneInverted ? railInverted : undefined}
          >
            {linesToNodes(sub.lines)}
          </Text>
        ))}
      </div>
    );
  }
  return (
    <RailEditableLines
      basePath="cover.topRail"
      itemIndex={itemIndex}
      lines={item.lines}
      className={cn(railTextAlignClass(item.textAlign), railTextClass(item.style, rowToneInverted))}
    />
  );
}

const headlineSizeClass: Record<
  JsonImageCoverHeadlineBlockSize,
  { className: string; italicDefault?: boolean }
> = {
  jumbo: { className: 'text-[18rem] leading-[0.58] tracking-tighter', italicDefault: true },
  mega: { className: 'text-[12rem] leading-[1] tracking-tighter', italicDefault: true },
  display: { className: 'text-[10rem] leading-[0.9] tracking-tight' },
  displayTight: { className: 'text-[10rem] leading-[0.65] tracking-tight' },
  hero: { className: 'text-[8rem] leading-[0.8] tracking-tight', italicDefault: true },
};

const colorClass: Record<JsonImageCoverHeadlineColor, string> = {
  textSoft: 'text-[color:var(--slide-color-text-soft)]',
  white: 'text-white',
  gold: 'text-[#ffd700]',
};

function blockTypography(block: JsonImageCoverHeadlineBlock): string {
  const { size, font, italic, weight } = block;
  const spec = headlineSizeClass[size];
  const italicOn = italic === true || (italic == null && spec.italicDefault === true);
  return cn(
    font === 'display' ? 'font-display' : 'font-serif',
    spec.className,
    italicOn ? 'italic' : 'not-italic',
    weight === 'semibold' ? 'font-semibold' : 'font-normal',
    'whitespace-pre-wrap',
    colorClass[block.color],
  );
}

function HeadlineBlockText({ block, index }: { block: JsonImageCoverHeadlineBlock; index: number }) {
  const editableProps = useEditableTextProps(`cover.headline.blocks.${index}.text`);
  return (
    <Text as="h1" variant="h1" unstyled className={blockTypography(block)} {...editableProps}>
      {block.text}
    </Text>
  );
}

function renderHeadline(headline: JsonImageCover['headline']): ReactNode {
  const y = headline.offsetYPx;
  if (headline.stack === 'br') {
    return (
      <div className="relative z-30 text-center" style={{ transform: `translateY(${y}px)` }}>
        <Reveal preset="enter-up" delay={0.45}>
          <>
            {headline.blocks.map((b, i) => (
              <Fragment key={i}>
                {i > 0 ? <br /> : null}
                <HeadlineBlockText block={b} index={i} />
              </Fragment>
            ))}
          </>
        </Reveal>
      </div>
    );
  }
  if (headline.stack === 'tight') {
    return (
      <div className="relative z-30 text-center" style={{ transform: `translateY(${y}px)` }}>
        <Reveal preset="enter-up" delay={0.5}>
          <div className="flex flex-col gap-1">
            {headline.blocks.map((b, i) => (
              <HeadlineBlockText key={i} block={b} index={i} />
            ))}
          </div>
        </Reveal>
      </div>
    );
  }
  if (headline.blocks.length === 1) {
    const b = headline.blocks[0]!;
    return (
      <div className="relative z-30 text-center" style={{ transform: `translateY(${y}px)` }}>
        <Reveal preset="enter-up" delay={0.5}>
          <HeadlineBlockText block={b} index={0} />
        </Reveal>
      </div>
    );
  }
  return (
    <div className="relative z-30 text-center" style={{ transform: `translateY(${y}px)` }}>
      <Reveal preset="enter-up" delay={0.5}>
        <div className="flex flex-col">
          {headline.blocks.map((b, i) => (
            <HeadlineBlockText key={i} block={b} index={i} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}

const bottomCellClass: Record<'left' | 'center' | 'right', string> = {
  left: 'max-w-[18rem]',
  center: 'text-center',
  right: 'max-w-[18rem] text-right',
};

function bottomTextClass(style: JsonImageCoverRailTextStyle | undefined): string {
  if (style === 'inverted') {
    return railInverted;
  }
  if (style === 'plain') {
    return '';
  }
  return labelCaps;
}

function renderBottomTextItem(
  t: { lines: string[]; style?: JsonImageCoverRailTextStyle },
  itemIndex: number,
): ReactNode {
  return (
    <RailEditableLines
      basePath="cover.bottomRail"
      itemIndex={itemIndex}
      lines={t.lines}
      className={bottomTextClass(t.style)}
    />
  );
}

function renderBottomItem(
  item: JsonImageCoverRailItem,
  itemIndex: number,
  slot: 'left' | 'center' | 'right',
  delay: number,
  options: { centerRule: boolean },
): ReactNode {
  if (item.kind === 'cluster') {
    return (
      <Reveal key={slot} preset="soft" delay={delay} className={bottomCellClass[slot]}>
        <div className={cn('flex', clusterGapClass[item.gap])}>
          {item.items.map((sub, j) => (
            <Text key={j} variant="overline" className={labelCaps}>
              {linesToNodes(sub.lines)}
            </Text>
          ))}
        </div>
      </Reveal>
    );
  }
  if (options.centerRule && slot === 'center' && item.kind === 'text') {
    return (
      <div key={slot} className={bottomCellClass.center}>
        <Reveal preset="soft" delay={delay}>
          <div className="mx-auto mb-4 h-px w-32 bg-white/45" aria-hidden />
          {renderBottomTextItem(item, itemIndex)}
        </Reveal>
      </div>
    );
  }
  if (item.kind === 'text') {
    return (
      <Reveal key={slot} preset="soft" delay={delay} className={bottomCellClass[slot]}>
        {renderBottomTextItem(item, itemIndex)}
      </Reveal>
    );
  }
  return null;
}

function topDelaysForVariant(v: 'two' | 'three', index: number): number {
  if (v === 'two') {
    return index === 0 ? 0.2 : 0.4;
  }
  if (index === 0) {
    return 0.2;
  }
  if (index === 1) {
    return 0.3;
  }
  return 0.4;
}

function RailItemSelectable({
  basePath,
  itemIndex,
  children,
}: {
  basePath: 'cover.topRail' | 'cover.bottomRail';
  itemIndex: number;
  children: ReactNode;
}) {
  const selectable = useInspectorSelectable(
    `${basePath}.items.${itemIndex}`,
    'imageCoverRail',
  );
  return (
    <div {...selectable} className={cn(selectable.className)}>
      {children}
    </div>
  );
}

function HeadlineSelectable({
  selectable,
  children,
}: {
  selectable: ReturnType<typeof useInspectorSelectable>;
  children: ReactNode;
}) {
  if (!selectable.onClick) return <>{children}</>;
  return (
    <div {...selectable} className={cn('relative z-30', selectable.className)}>
      {children}
    </div>
  );
}

export function JsonImageCoverShell({ cover }: { cover: JsonImageCover }) {
  const { background, topRail, bottomRail } = cover;
  const rowInv = topRail.tone === 'inverted';
  const headlineSelectable = useInspectorSelectable('cover.headline', 'imageCoverHeadline');
  const backgroundSelectable = useInspectorSelectable(
    'cover.background',
    'imageCoverBackground',
  );
  return (
    <SlideFrame
      align="center"
      padding="none"
      className="relative isolate items-center justify-center"
    >
      <div
        {...backgroundSelectable}
        className={cn(
          'absolute inset-0 z-0',
          // В презентационном режиме (selectable={}) фон не должен ловить клики
          // и перехватывать поведение. В editor-mode — наоборот, нужен клик.
          backgroundSelectable.onClick ? '' : 'pointer-events-none',
          backgroundSelectable.className,
        )}
      >
        <img src={background.src} alt={background.alt ?? ''} className="pointer-events-none h-full w-full object-cover" />
        {overlayNode(background.overlay)}
      </div>

      {cover.frame ? <SlideBackdropFrame className="z-20" /> : null}

      <div
        className={cn(
          'absolute top-[var(--slide-safe-y-tight)] left-[var(--slide-safe-x-tight)] right-[var(--slide-safe-x-tight)] z-30',
          topRail.variant === 'two' ? 'flex justify-between' : 'flex justify-between gap-[var(--slide-grid-gap-lg)]',
        )}
      >
        {topRail.items.map((item, i) => (
          <RailItemSelectable
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            basePath="cover.topRail"
            itemIndex={i}
          >
            <Reveal
              preset="soft"
              delay={topDelaysForVariant(topRail.variant, i)}
              className={item.kind === 'text' && item.textAlign === 'right' ? 'text-right' : undefined}
            >
              {renderTopRailItem(item, i, rowInv)}
            </Reveal>
          </RailItemSelectable>
        ))}
      </div>

      <HeadlineSelectable selectable={headlineSelectable}>
        {renderHeadline(cover.headline)}
      </HeadlineSelectable>

      <div className="absolute bottom-[var(--slide-safe-y-tight)] left-[var(--slide-safe-x-tight)] right-[var(--slide-safe-x-tight)] z-30 flex justify-between items-end gap-[var(--slide-grid-gap-lg)]">
        <RailItemSelectable basePath="cover.bottomRail" itemIndex={0}>
          {renderBottomItem(bottomRail.items[0], 0, 'left', 0.6, { centerRule: false })}
        </RailItemSelectable>
        <RailItemSelectable basePath="cover.bottomRail" itemIndex={1}>
          {renderBottomItem(bottomRail.items[1], 1, 'center', 0.7, { centerRule: bottomRail.centerAccent?.type === 'rule' })}
        </RailItemSelectable>
        <RailItemSelectable basePath="cover.bottomRail" itemIndex={2}>
          {renderBottomItem(bottomRail.items[2], 2, 'right', 0.8, { centerRule: false })}
        </RailItemSelectable>
      </div>
    </SlideFrame>
  );
}
