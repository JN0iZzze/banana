import type { ReactElement } from 'react';
import type {
  JsonSlideCardComponentId,
  JsonSlideCardItem,
  JsonSlideCardItemIndexedList,
  JsonSlideCardItemTagList,
  JsonSlideCardTone,
} from '../jsonSlideTypes';
import { Text } from '../../ui/slides';
import { cn } from '../../ui/slides/cn';
import { cardStackGapCssVar } from './layouts/cardStackGapCssVar';

/** Card `items[]` rows with `type: "component"` (parser allowlist). */
export type JsonSlideCardComponentItem = Extract<JsonSlideCardItem, { type: 'component' }>;

export interface JsonCardTagListProps {
  tone: JsonSlideCardTone;
  item: JsonSlideCardItemTagList;
}

export interface JsonCardIndexedListProps {
  tone: JsonSlideCardTone;
  item: JsonSlideCardItemIndexedList;
}

/** Per-id React component; keys must stay in sync with `JsonSlideCardComponentId`. */
export type JsonSlideCardComponentRegistry = {
  [K in JsonSlideCardComponentId]: React.ComponentType<{
    tone: JsonSlideCardTone;
    item: Extract<JsonSlideCardItem, { type: 'component'; component: K }>;
  }>;
};

/** Registry-backed `tagList`: pills; tone from card, layout from item. */
export function JsonCardTagList({ tone, item }: JsonCardTagListProps) {
  const onAccent = tone === 'accent';
  const variant = item.variant ?? 'default';
  const direction = item.direction ?? 'row';
  const gap = item.gap ?? 'sm';
  const gapStyle = cardStackGapCssVar(gap);
  const compact = variant === 'compact';

  return (
    <div
      className={cn(
        'mt-auto flex min-h-0 w-full min-w-0 content-end',
        direction === 'row' ? 'flex-row flex-wrap' : 'flex-col flex-nowrap',
      )}
      style={{ gap: gapStyle }}
    >
      {item.items.map((row, idx) => (
        <span
          key={`tag-${idx}-${row.label}`}
          className={cn(
            'inline-flex max-w-full items-center border',
            compact
              ? 'rounded-full px-4 py-2'
              : 'rounded-[var(--slide-radius-inner)] px-[var(--slide-section-x-sm)] py-[var(--slide-section-y-sm)]',
            onAccent
              ? 'border-[color:var(--slide-on-accent-tile-border)] bg-[color:var(--slide-on-accent-tile-bg)]'
              : 'border-[color:var(--slide-color-line)] bg-[color:var(--slide-color-surface-quiet)]',
          )}
        >
          <Text
            variant="body"
            context={onAccent ? 'onAccent' : 'default'}
            as="span"
            className={cn('m-0 text-pretty', compact && '!leading-none')}
          >
            <span className="font-normal">{row.label}</span>
          </Text>
        </span>
      ))}
    </div>
  );
}

/** Registry-backed `indexedList`: numbered rows with title + subtitle; follows card tone. */
export function JsonCardIndexedList({ tone, item }: JsonCardIndexedListProps) {
  const onAccent = tone === 'accent';
  const gap = item.gap ?? 'md';
  const gapStyle = cardStackGapCssVar(gap);

  return (
    <div className="grid min-h-0 w-full" style={{ gap: gapStyle }}>
      {item.items.map((row) => (
        <div
          key={row.index}
          className={cn(
            'flex min-h-0 items-center gap-4 rounded-[18px] border px-4 py-4',
            onAccent ? 'border-white/18 bg-white/10' : 'border-[color:var(--slide-color-line)] bg-[color:var(--slide-color-surface-quiet)]',
          )}
        >
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
              onAccent
                ? 'bg-white/14 text-[color:var(--slide-color-accent-contrast)]'
                : 'bg-[color:var(--slide-color-text)]/10 text-[color:var(--slide-color-text)]',
            )}
          >
            {String(row.index).padStart(2, '0')}
          </div>
          <div className="min-w-0">
            <Text
              variant="bodyLg"
              context={onAccent ? 'onAccent' : 'default'}
              className={cn(
                'm-0 text-pretty',
                onAccent && 'text-[color:var(--slide-color-accent-contrast)]',
              )}
            >
              {row.title}
            </Text>
            <Text
              variant="caption"
              context={onAccent ? 'onAccent' : 'default'}
              className={cn(
                'mt-1 text-pretty',
                onAccent ? 'text-[color:var(--slide-color-accent-contrast)]/72' : 'text-[color:var(--slide-color-text-soft)]',
              )}
            >
              {row.subtitle}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Maps JSON `component` ids to renderers; add a new entry when extending `JSON_SLIDE_CARD_COMPONENT_IDS`. */
export const JSON_SLIDE_CARD_COMPONENT_REGISTRY = {
  tagList: JsonCardTagList,
  indexedList: JsonCardIndexedList,
} satisfies JsonSlideCardComponentRegistry;

/**
 * Renders one registry-backed card item. Parser allowlist and this registry must stay aligned.
 * Exhaustive `switch` ensures a new `JsonSlideCardComponentId` gets a branch here.
 */
export function renderJsonCardComponentItem(
  tone: JsonSlideCardTone,
  item: JsonSlideCardComponentItem,
  index: number,
): ReactElement {
  switch (item.component) {
    case 'tagList':
      return (
        <JSON_SLIDE_CARD_COMPONENT_REGISTRY.tagList
          key={`item-${index}-tagList`}
          tone={tone}
          item={item}
        />
      );
    case 'indexedList':
      return (
        <JSON_SLIDE_CARD_COMPONENT_REGISTRY.indexedList
          key={`item-${index}-indexedList`}
          tone={tone}
          item={item}
        />
      );
    default: {
      const _exhaustive: never = item;
      void _exhaustive;
      throw new Error('Unknown card component item (registry / types out of sync)');
    }
  }
}
