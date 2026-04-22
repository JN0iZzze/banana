import type { JsonSlideCardItemText, JsonSlideGridGap, JsonSlideTextRegionPayload } from '../../jsonSlideTypes';
import { Reveal, Text } from '../../../ui/slides';
import { cn } from '../../../ui/slides/cn';
import { cardStackGapCssVar } from '../layouts/cardStackGapCssVar';

export interface JsonTextRegionNodeProps {
  text: JsonSlideTextRegionPayload;
  delay: number;
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

function renderTextRow(item: JsonSlideCardItemText, index: number) {
  return (
    <Text
      key={`tr-${index}`}
      variant={item.variant}
      className={cn(
        (item.variant === 'h2' || item.variant === 'h3') && 'text-pretty',
        (item.variant === 'body' || item.variant === 'bodyLg') && 'text-pretty',
        (item.variant === 'body' || item.variant === 'bodyLg') && 'text-[color:var(--slide-color-text-soft)]',
      )}
    >
      {item.text}
    </Text>
  );
}

/**
 * Plain text stack in `splitLayout` / `stackLayout` — no `SurfaceCard` or card chrome.
 */
export function JsonTextRegionNode({ text, delay }: JsonTextRegionNodeProps) {
  const align = text.align ?? 'left';
  const stackGapResolved: JsonSlideGridGap = text.stackGap ?? 'md';
  const stackGapStyle = cardStackGapCssVar(stackGapResolved);

  return (
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
        {text.items.map((item, i) => renderTextRow(item, i))}
      </div>
    </Reveal>
  );
}
