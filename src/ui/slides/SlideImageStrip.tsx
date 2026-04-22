import type { CSSProperties, PropsWithChildren } from 'react';
import { cn } from './cn';

type StripJustify = 'start' | 'end';

const stripJustifyClass: Record<StripJustify, string> = {
  start: 'justify-start',
  end: 'justify-end',
};

interface SlideImagePairProps extends PropsWithChildren {
  /** Расположение пары картинок вдоль главной оси ряда. */
  justify?: StripJustify;
  className?: string;
  /** Переопределяет `gap` между ячейками (по умолчанию `var(--slide-grid-gap-md)`). */
  style?: CSSProperties;
}

/** Горизонтальный ряд под две картинки: gap из токенов слайда, на всю высоту родителя. */
export function SlideImagePair({ children, justify = 'end', className, style }: SlideImagePairProps) {
  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-row items-stretch gap-[var(--slide-grid-gap-md)] overflow-hidden',
        stripJustifyClass[justify],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

interface SlideImageCellProps extends PropsWithChildren {
  className?: string;
}

/** Обёртка под одну картинку в паре: выравнивание по высоте и прижатие содержимого. */
export function SlideImageCell({ children, className }: SlideImageCellProps) {
  return (
    <div
      className={cn('flex h-full min-h-0 shrink-0 items-center justify-end overflow-hidden', className)}
    >
      {children}
    </div>
  );
}
