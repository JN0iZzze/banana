import type { PropsWithChildren } from 'react';
import { cn } from './cn';

export type BoxTone = 'standard' | 'accent';
export type BoxPadding = 'compact' | 'default' | 'spacious';

interface BoxProps extends PropsWithChildren {
  tone?: BoxTone;
  padding?: BoxPadding;
  className?: string;
}

const toneClasses: Record<BoxTone, string> = {
  standard:
    'bg-[color:var(--slide-color-surface)] shadow-[var(--slide-shadow-soft)] text-[color:var(--slide-color-text)]',
  accent:
    'bg-[color:var(--slide-color-accent)] text-[color:var(--slide-color-accent-contrast)] shadow-[var(--slide-shadow-solid)]',
};

const paddingClasses: Record<BoxPadding, string> = {
  compact: 'p-[var(--slide-card-padding-sm)]',
  default: 'p-[var(--slide-box-padding-md)]',
  spacious: 'p-[var(--slide-card-padding-lg)]',
};

export function Box({ children, tone = 'standard', padding = 'default', className }: BoxProps) {
  return (
    <div
      className={cn(
        'relative flex h-full min-h-0 w-full flex-col gap-[var(--slide-stack-gap-md)] overflow-hidden rounded-[var(--slide-radius-panel)]',
        toneClasses[tone],
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
