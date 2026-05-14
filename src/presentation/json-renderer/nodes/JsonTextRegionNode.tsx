import type { JsonSlideCardItemText, JsonSlideGridGap, JsonSlideTextRegionPayload } from '../../jsonSlideTypes';
import { Reveal, Text } from '../../../ui/slides';
import { cn } from '../../../ui/slides/cn';
import { useEditableTextProps, useInspectorSelectable, useIsEditorActive } from '../../../creator/inline-edit';
import { cardStackGapCssVar } from '../layouts/cardStackGapCssVar';

export interface JsonTextRegionNodeProps {
  text: JsonSlideTextRegionPayload;
  delay: number;
  /**
   * Absolute path from the document root to this text region
   * (e.g. `layout.equalColumns.items.0.region.text`).
   *
   * When provided, each item connects to the inline-edit helper via
   * `${editorPath}.items.${j}.text`. Без пути helper вернёт пустой объект —
   * презентационный режим остаётся без изменений.
   */
  editorPath?: string;
}

const alignToItemsClass: Record<NonNullable<JsonSlideTextRegionPayload['align']>, string> = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
};

const alignToTextClass: Record<NonNullable<JsonSlideTextRegionPayload['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

interface JsonTextRegionTextItemProps {
  item: JsonSlideCardItemText;
  index: number;
  itemPath: string | null;
}

const MULTILINE_REGION_VARIANTS = new Set(['prompt', 'body', 'bodyLg', 'h2', 'h3']);

function JsonTextRegionTextItem({ item, index, itemPath }: JsonTextRegionTextItemProps) {
  const editableProps = useEditableTextProps(itemPath ?? '');
  const isEditorActive = useIsEditorActive();
  const isPrompt = item.variant === 'prompt';
  const isBodyRow = item.variant === 'body' || item.variant === 'bodyLg';
  return (
    <Text
      key={`tr-${index}`}
      variant={item.variant}
      className={cn(
        (item.variant === 'h2' || item.variant === 'h3') && 'text-pretty',
        !isPrompt && isBodyRow && 'text-pretty',
        !isPrompt && isBodyRow && 'text-[color:var(--slide-color-text-soft)]',
        isPrompt && 'max-w-full min-w-0',
        itemPath != null && isEditorActive && 'pointer-events-auto',
      )}
      {...editableProps}
      multiline={MULTILINE_REGION_VARIANTS.has(item.variant)}
    >
      {item.text}
    </Text>
  );
}

/**
 * Plain text stack in `splitLayout` / `stackLayout` — no `SurfaceCard` or card chrome.
 */
export function JsonTextRegionNode({ text, delay, editorPath }: JsonTextRegionNodeProps) {
  const align = text.align ?? 'left';
  const stackGapResolved: JsonSlideGridGap = text.stackGap ?? 'md';
  const stackGapStyle = cardStackGapCssVar(stackGapResolved);
  const regionSelectable = useInspectorSelectable(editorPath, 'textRegion');

  return (
    <div
      {...regionSelectable}
      className={cn('h-full min-h-0 w-full', regionSelectable.className)}
    >
    <Reveal
      preset="soft"
      delay={delay}
      className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-col justify-center"
    >
      <div
        className={cn(
          'flex min-h-0 w-full min-w-0 max-w-full flex-col',
          alignToItemsClass[align],
          alignToTextClass[align],
        )}
        style={{ gap: stackGapStyle }}
      >
        {text.items.map((item, i) => (
          <JsonTextRegionTextItem
            key={`tr-${i}`}
            item={item}
            index={i}
            itemPath={editorPath != null ? `${editorPath}.items.${i}.text` : null}
          />
        ))}
      </div>
    </Reveal>
    </div>
  );
}
