import type { JsonSlideCard, JsonSlideCardHeaderBadge, JsonSlideCardItemText, JsonSlideGridGap } from '../../jsonSlideTypes';
import { isJsonSlideCardItemText } from '../../jsonSlideTypes';
import { Box, Reveal, SurfaceCard, Text } from '../../../ui/slides';
import { cn } from '../../../ui/slides/cn';
import { cardStackGapCssVar } from '../layouts/cardStackGapCssVar';
import { renderJsonCardComponentItem } from '../jsonSlideCardComponentRegistry';
import { getJsonSlideCardIcon } from '../jsonSlideCardIconRegistry';
import { useEditableTextProps, useIsEditorActive } from '../../../creator/inline-edit';

export interface JsonCardNodeProps {
  card: JsonSlideCard;
  delay: number;
  /**
   * Absolute dot-path to the card inside the slide document, e.g.
   * `layout.equalColumns.items.0.region.card` or `layout.splitLayout.left.card`.
   * When omitted, inline editing stays off — the helper returns `{}`.
   */
  editorPath?: string;
}

/** Path placeholder for cases where the card has no editor path attached. */
const NOOP_EDITOR_PATH = '__noop__';

const justifyClass: Record<NonNullable<JsonSlideCard['justify']>, string> = {
  start: 'justify-start',
  end: 'justify-end',
  between: 'justify-between',
};

const headerBadgeToneClass: Record<NonNullable<JsonSlideCardHeaderBadge['tone']>, string> = {
  default: 'bg-white/[0.04] text-[color:var(--slide-color-text)]',
  accent: 'bg-white/[0.04] text-[color:var(--slide-color-accent)]',
  onAccent: 'bg-white/[0.04] text-[color:var(--slide-color-accent-contrast)]',
};

function renderHeaderBadge(badge: JsonSlideCardHeaderBadge, onAccentCard: boolean) {
  const tone = badge.tone ?? 'accent';
  return (
    <div
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-[1rem] font-semibold',
        onAccentCard
          ? 'border-white/18'
          : 'border-[color:var(--slide-color-line)]',
        headerBadgeToneClass[tone],
      )}
    >
      {badge.text}
    </div>
  );
}

interface JsonCardTextItemProps {
  item: JsonSlideCardItemText;
  reactKey: string;
  onAccent: boolean;
  compactCard: boolean;
  surface: NonNullable<JsonSlideCard['surface']> | undefined;
  tailClassName?: string;
  /** Absolute path to this text item; pass `NOOP_EDITOR_PATH` to disable inline editing. */
  editorPath: string;
}

function JsonCardTextItem({
  item,
  reactKey,
  onAccent,
  compactCard,
  surface,
  tailClassName,
  editorPath,
}: JsonCardTextItemProps) {
  const editableProps = useEditableTextProps(editorPath);
  const isEditorActive = useIsEditorActive();
  const ghost = surface === 'ghost';
  const isPrompt = item.variant === 'prompt';
  const isBodyRow = item.variant === 'body' || item.variant === 'bodyLg';
  return (
    <Text
      key={`${reactKey}-${item.variant}-${item.text.slice(0, 24)}`}
      variant={item.variant}
      context={onAccent ? 'onAccent' : 'default'}
      className={cn(
        (item.variant === 'h2' || item.variant === 'h3') && 'text-pretty',
        compactCard &&
          item.variant === 'h2' &&
          '!text-[1.65rem] !leading-tight tracking-[-0.03em]',
        surface === 'accentGradient' &&
          item.variant === 'h2' &&
          '!text-[2.35rem] !leading-[1.02] tracking-[-0.03em]',
        ghost && item.variant === 'overline' && 'text-[color:var(--slide-color-accent)]',
        ghost &&
          item.variant === 'h2' &&
          '!text-[2rem] !leading-[1.02] tracking-[-0.03em]',
        onAccent &&
          (item.variant === 'h2' || item.variant === 'h3') &&
          'text-[color:var(--slide-color-accent-contrast)]',
        !isPrompt && isBodyRow && 'text-pretty',
        !isPrompt && isBodyRow && !onAccent && 'text-[color:var(--slide-color-text-soft)]',
        isPrompt && 'min-h-0 w-full min-w-0 flex-1',
        isEditorActive && 'pointer-events-auto',
        tailClassName,
      )}
      {...editableProps}
    >
      {item.text}
    </Text>
  );
}

/**
 * Presentation node: optional icons, pinned `subtitle`, `items[]`.
 * When `headerBadge` + leading `overline`/`h2`, the badge is pinned to the top-right of the card; `justify: "between"` splits space between that header text row and the remaining `items` block; inner body stack can still use `between` when there are multiple tail rows.
 * Authoring heuristics for "good cards" live in `json-renderer/README.md` under the card contract.
 */
export function JsonCardNode({ card, delay, editorPath }: JsonCardNodeProps) {
  const subtitlePath = editorPath ? `${editorPath}.subtitle.text` : NOOP_EDITOR_PATH;
  const onAccent = card.tone === 'accent';
  const surface = card.surface ?? 'box';
  const onAccentCard = onAccent || surface === 'accentGradient';
  const justify = card.justify ?? 'start';
  const padding = card.padding ?? 'default';
  const compactCard = padding === 'compact';
  const stackGapResolved: JsonSlideGridGap = card.stackGap ?? (compactCard ? 'sm' : 'md');
  const stackGapStyle = cardStackGapCssVar(stackGapResolved);

  const LeadingIcon = card.leadingIcon ? getJsonSlideCardIcon(card.leadingIcon) : null;
  const WatermarkIcon = card.watermarkIcon ? getJsonSlideCardIcon(card.watermarkIcon) : null;

  const watermarkSize = compactCard ? 140 : card.leadingIcon ? 200 : 160;
  const leadingSize = compactCard ? 32 : onAccent ? 48 : 40;
  const leadingPad = compactCard ? 'p-3' : 'p-4';

  const flatItems = card.items ?? [];

  const headerHasPair =
    !card.slots &&
    Boolean(card.headerBadge) &&
    flatItems.length >= 2 &&
    isJsonSlideCardItemText(flatItems[0]) &&
    flatItems[0].variant === 'overline' &&
    isJsonSlideCardItemText(flatItems[1]) &&
    flatItems[1].variant === 'h2';

  const itemsBody = headerHasPair ? flatItems.slice(2) : flatItems;
  /** `between` applies between header row and body when badge + overline/h2 pattern matches. */
  const distributeHeaderAndBody =
    Boolean(headerHasPair && card.headerBadge && justify === 'between');
  /** Without header/body split, single tail row + `between` still needs `mt-auto`. */
  const pinBodyTailToBottom = justify === 'between' && itemsBody.length === 1 && !distributeHeaderAndBody;

  const bodyStackJustifyClass = distributeHeaderAndBody
    ? itemsBody.length <= 1
      ? 'justify-end'
      : 'justify-between'
    : pinBodyTailToBottom
      ? 'justify-start'
      : justifyClass[justify];

  const headerPairRow =
    headerHasPair && card.headerBadge ? (
      <div className="relative z-10 flex shrink-0 items-start">
        <div
          className="flex min-w-0 flex-1 flex-col pr-16"
          style={{ gap: stackGapStyle }}
        >
          <JsonCardTextItem
            item={flatItems[0] as JsonSlideCardItemText}
            reactKey="hdr0"
            onAccent={onAccent}
            compactCard={compactCard}
            surface={surface}
            editorPath={editorPath ? `${editorPath}.items.0.text` : NOOP_EDITOR_PATH}
          />
          <JsonCardTextItem
            item={flatItems[1] as JsonSlideCardItemText}
            reactKey="hdr1"
            onAccent={onAccent}
            compactCard={compactCard}
            surface={surface}
            editorPath={editorPath ? `${editorPath}.items.1.text` : NOOP_EDITOR_PATH}
          />
        </div>
      </div>
    ) : null;

  const bodyStack = card.slots ? (
    <div
      className={cn(
        'relative z-10 flex min-h-0 flex-1 flex-col',
        justifyClass[justify],
        card.headerBadge && 'pr-16',
      )}
      style={justify === 'between' ? undefined : { gap: stackGapStyle }}
    >
      {card.slots.map((slot, si) => {
        const slotGap = slot.gap ? cardStackGapCssVar(slot.gap) : stackGapStyle;
        return (
          <div
            key={`slot-${si}`}
            className="flex min-w-0 flex-col"
            style={{ gap: slotGap }}
          >
            {slot.items.map((item, ii) =>
              isJsonSlideCardItemText(item) ? (
                <JsonCardTextItem
                  key={`slot-${si}-item-${ii}-${item.variant}-${item.text.slice(0, 24)}`}
                  item={item}
                  reactKey={`slot-${si}-item-${ii}`}
                  onAccent={onAccent}
                  compactCard={compactCard}
                  surface={surface}
                  editorPath={
                    editorPath ? `${editorPath}.slots.${si}.items.${ii}.text` : NOOP_EDITOR_PATH
                  }
                />
              ) : (
                renderJsonCardComponentItem(card.tone, item, ii)
              ),
            )}
          </div>
        );
      })}
    </div>
  ) : (
    <div
      className={cn(
        'relative z-10 flex min-h-0 flex-col',
        distributeHeaderAndBody && 'min-w-0 flex-1',
        !distributeHeaderAndBody && 'flex-1',
        bodyStackJustifyClass,
        card.headerBadge && 'pr-16',
      )}
      style={{ gap: stackGapStyle }}
    >
      {itemsBody.map((item, i) => {
        const absoluteIndex = headerHasPair ? i + 2 : i;
        const itemEditorPath = editorPath
          ? `${editorPath}.items.${absoluteIndex}.text`
          : NOOP_EDITOR_PATH;
        if (isJsonSlideCardItemText(item)) {
          return (
            <JsonCardTextItem
              key={`body-${i}-${item.variant}-${item.text.slice(0, 24)}`}
              item={item}
              reactKey={`body-${i}`}
              onAccent={onAccent}
              compactCard={compactCard}
              surface={surface}
              tailClassName={pinBodyTailToBottom ? 'mt-auto' : undefined}
              editorPath={itemEditorPath}
            />
          );
        }
        return pinBodyTailToBottom ? (
          <div key={`body-${i}-comp`} className="mt-auto min-w-0 w-full">
            {renderJsonCardComponentItem(card.tone, item, i)}
          </div>
        ) : (
          renderJsonCardComponentItem(card.tone, item, i)
        );
      })}
    </div>
  );

  const inner = (
    <div className="relative flex h-full min-h-0 flex-col" style={{ gap: stackGapStyle }}>
      {card.headerBadge ? (
        <div className="pointer-events-none absolute right-0 top-0 z-20">
          {renderHeaderBadge(card.headerBadge, onAccentCard)}
        </div>
      ) : null}

      {WatermarkIcon ? (
        <div
          className={cn(
            'pointer-events-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4',
            onAccent || surface === 'accentGradient'
              ? 'text-[color:var(--slide-color-accent-contrast)] opacity-[0.12]'
              : 'text-[color:var(--slide-color-text)] opacity-[0.08]',
          )}
          aria-hidden
        >
          <WatermarkIcon size={watermarkSize} />
        </div>
      ) : null}

      {LeadingIcon ? (
        <div
          className={cn(
            'relative z-10 flex w-fit shrink-0 rounded-full',
            onAccent || surface === 'accentGradient'
              ? 'bg-[color:var(--slide-color-accent-contrast)]/20'
              : 'bg-[color:var(--slide-color-text)]/10',
            leadingPad,
          )}
        >
          <LeadingIcon
            size={leadingSize}
            className={cn(
              onAccent || surface === 'accentGradient'
                ? 'opacity-80 text-[color:var(--slide-color-accent-contrast)]'
                : 'text-[color:var(--slide-color-text)]',
            )}
          />
        </div>
      ) : null}

      {card.subtitle ? (
        <div className="relative z-10 shrink-0">
          <JsonCardTextItem
            item={card.subtitle}
            reactKey="subtitle"
            onAccent={onAccent}
            compactCard={compactCard}
            surface={surface}
            editorPath={subtitlePath}
          />
        </div>
      ) : null}

      {distributeHeaderAndBody && headerPairRow ? (
        <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col justify-between">
          {headerPairRow}
          {bodyStack}
        </div>
      ) : (
        <>
          {headerPairRow}
          {bodyStack}
        </>
      )}
    </div>
  );

  if (surface === 'ghost') {
    return (
      <Reveal preset="soft" delay={delay} className="h-full min-h-0">
        <SurfaceCard
          variant="ghost"
          padding={padding}
          className="h-full min-h-0 border-white/10 bg-white/[0.045] backdrop-blur-[10px]"
        >
          {inner}
        </SurfaceCard>
      </Reveal>
    );
  }

  if (surface === 'accentGradient') {
    return (
      <Reveal preset="soft" delay={delay} className="h-full min-h-0">
        <Box
          tone="accent"
          padding={padding}
          className={cn(
            'h-full',
            'justify-between border-none bg-[linear-gradient(160deg,var(--slide-color-accent),#b53b17)]',
          )}
        >
          {inner}
        </Box>
      </Reveal>
    );
  }

  return (
    <Reveal preset="soft" delay={delay} className="h-full min-h-0">
      <Box
        tone={card.tone}
        padding={padding}
        className={cn(
          'h-full',
          onAccent ? 'border-none' : 'border border-[color:var(--slide-color-line)] shadow-[var(--slide-shadow-soft)]',
        )}
      >
        {inner}
      </Box>
    </Reveal>
  );
}
