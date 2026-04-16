import type { PropsWithChildren } from 'react';
import { cn } from './cn';
import { Text } from './Text';

export type BlockCardLayout = 'row' | 'tile';

interface BlockCardProps extends PropsWithChildren {
  /** Строка с круглым индексом слева */
  numbered?: boolean;
  index?: number;
  /** `row` — карточка в стиле ghost (панель); `tile` — плитка на акцентном фоне */
  layout?: BlockCardLayout;
  className?: string;
}

const rowGhostSurface =
  'border border-[color:var(--slide-color-line)] bg-[color:var(--slide-color-surface-quiet)]';

export function BlockCard({
  children,
  numbered = false,
  index,
  layout = 'row',
  className,
}: BlockCardProps) {
  if (layout === 'tile') {
    return (
      <div
        className={cn(
          'flex h-full min-h-0 w-full min-w-0 flex-col items-center justify-center rounded-[var(--slide-radius-inner)] border border-[color:var(--slide-on-accent-tile-border)] bg-[color:var(--slide-on-accent-tile-bg)] px-[var(--slide-on-accent-tile-padding-x)] py-[var(--slide-on-accent-tile-padding-y)] text-center',
          className,
        )}
      >
        {children}
      </div>
    );
  }

  if (numbered) {
    const n = index ?? 1;
    return (
      <article
        className={cn(
          'overflow-hidden rounded-[var(--slide-radius-panel)] p-[var(--slide-card-padding-md)]',
          rowGhostSurface,
          className,
        )}
      >
        <div className="flex items-center gap-[var(--slide-block-card-gap)]">
          <div
            className="flex shrink-0 items-center justify-center rounded-full bg-[color:var(--slide-color-accent-soft)] font-semibold leading-none text-[color:var(--slide-color-accent)]"
            style={{
              width: 'var(--slide-index-bubble-size)',
              height: 'var(--slide-index-bubble-size)',
              fontSize: 'var(--slide-index-bubble-font-size)',
            }}
          >
            {n}
          </div>
          <Text variant="body" className="m-0 min-w-0 flex-1">
            {children}
          </Text>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'overflow-hidden rounded-[var(--slide-radius-panel)] p-[var(--slide-card-padding-md)]',
        rowGhostSurface,
        className,
      )}
    >
      {children}
    </article>
  );
}
