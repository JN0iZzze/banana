import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from './cn';
import { Text } from './Text';

type FrameAlign = 'top' | 'center' | 'bottom';
type FramePadding = 'compact' | 'default' | 'spacious';
type SectionPadding = 'compact' | 'default' | 'spacious';
type ContentWidth = 'full' | 'wide' | 'content' | 'narrow';
type ContentDensity = 'compact' | 'comfortable' | 'relaxed';
type ContentAlign = 'left' | 'center';
type SectionVariant = 'stack' | 'panel' | 'quiet';
type GridGap = 'sm' | 'md' | 'lg';
type ColumnAlign = 'start' | 'center' | 'end' | 'stretch';

interface SlideFrameProps extends PropsWithChildren {
  align?: FrameAlign;
  padding?: FramePadding;
  className?: string;
}

interface SlideBackdropProps {
  variant?: 'grid' | 'spotlight' | 'mesh' | 'none';
  accent?: 'primary' | 'secondary';
  className?: string;
}

type SlideBackdropFrameInset = 'sm' | 'md';

interface SlideBackdropFrameProps {
  /** Отступы от края сцены; соответствуют `--slide-backdrop-frame-*`. */
  inset?: SlideBackdropFrameInset;
  className?: string;
}

const slideBackdropFrameInsetClasses: Record<SlideBackdropFrameInset, string> = {
  sm: 'left-[var(--slide-backdrop-frame-x-sm)] right-[var(--slide-backdrop-frame-x-sm)] top-[var(--slide-backdrop-frame-y-sm)] bottom-[var(--slide-backdrop-frame-y-sm)]',
  md: 'left-[var(--slide-backdrop-frame-x-md)] right-[var(--slide-backdrop-frame-x-md)] top-[var(--slide-backdrop-frame-y-md)] bottom-[var(--slide-backdrop-frame-y-md)]',
};

interface SlideContentProps extends PropsWithChildren {
  width?: ContentWidth;
  density?: ContentDensity;
  align?: ContentAlign;
  className?: string;
}

interface SlideHeaderProps extends PropsWithChildren {
  align?: ContentAlign;
  className?: string;
  meta?: ReactNode;
}

interface SlideTitleProps extends PropsWithChildren {
  size?: 'display' | 'section' | 'compact';
  className?: string;
}

interface SlideLeadProps extends PropsWithChildren {
  className?: string;
}

interface SlideSectionProps extends PropsWithChildren {
  variant?: SectionVariant;
  padding?: SectionPadding;
  className?: string;
}

interface SlideGridProps extends PropsWithChildren {
  columns?: 2 | 3 | 4 | 6 | 12;
  gap?: GridGap;
  className?: string;
}

interface SlideColumnProps extends PropsWithChildren {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  align?: ColumnAlign;
  className?: string;
}

const frameAlignClasses: Record<FrameAlign, string> = {
  top: 'justify-start',
  center: 'justify-center',
  bottom: 'justify-end',
};

const framePaddingClasses: Record<FramePadding, string> = {
  compact: 'px-[var(--slide-safe-x-tight)] py-[var(--slide-safe-y-tight)]',
  default: 'px-[var(--slide-safe-x)] py-[var(--slide-safe-y)]',
  spacious: 'px-[var(--slide-safe-x-loose)] py-[var(--slide-safe-y-loose)]',
};

const contentWidthClasses: Record<ContentWidth, string> = {
  full: 'max-w-none',
  wide: 'max-w-[var(--slide-content-wide)]',
  content: 'max-w-[var(--slide-content-main)]',
  narrow: 'max-w-[var(--slide-content-reading)]',
};

const contentDensityClasses: Record<ContentDensity, string> = {
  compact: 'gap-[var(--slide-stack-gap-sm)]',
  comfortable: 'gap-[var(--slide-stack-gap-md)]',
  relaxed: 'gap-[var(--slide-stack-gap-lg)]',
};

const contentAlignClasses: Record<ContentAlign, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
};

const sectionVariantClasses: Record<SectionVariant, string> = {
  stack: 'bg-transparent border-none shadow-none',
  panel: 'border border-[color:var(--slide-color-line)] bg-[color:var(--slide-color-surface)] shadow-[var(--slide-shadow-soft)]',
  quiet: 'border border-[color:var(--slide-color-line)] bg-[color:var(--slide-color-surface-quiet)]',
};

const sectionPaddingClasses: Record<SectionPadding, string> = {
  compact: 'px-[var(--slide-section-x-sm)] py-[var(--slide-section-y-sm)]',
  default: 'px-[var(--slide-section-x-md)] py-[var(--slide-section-y-md)]',
  spacious: 'px-[var(--slide-section-x-lg)] py-[var(--slide-section-y-lg)]',
};

const gridColumnsClasses: Record<SlideGridProps['columns'] & number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const gridGapClasses: Record<GridGap, string> = {
  sm: 'gap-[var(--slide-grid-gap-sm)]',
  md: 'gap-[var(--slide-grid-gap-md)]',
  lg: 'gap-[var(--slide-grid-gap-lg)]',
};

const columnSpanClasses: Record<SlideColumnProps['span'] & number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
};

const columnAlignClasses: Record<ColumnAlign, string> = {
  start: 'self-start',
  center: 'self-center',
  end: 'self-end',
  stretch: 'self-stretch',
};

export function SlideFrame({
  children,
  align = 'top',
  padding = 'default',
  className,
}: SlideFrameProps) {
  return (
    <section
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden',
        frameAlignClasses[align],
        framePaddingClasses[padding],
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Декоративная рамка сцены (та же геометрия, что у `SlideBackdrop` grid/mesh). */
export function SlideBackdropFrame({ inset = 'sm', className }: SlideBackdropFrameProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute rounded-[var(--slide-radius-frame)] border border-[color:var(--slide-color-line)]',
        slideBackdropFrameInsetClasses[inset],
        className,
      )}
    />
  );
}

export function SlideBackdrop({
  variant = 'grid',
  accent: _accent = 'primary',
  className,
}: SlideBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {variant === 'grid' && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(168deg,var(--slide-color-bg),var(--slide-color-bg-strong))]" />
          <SlideBackdropFrame />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--slide-color-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--slide-color-grid)_1px,transparent_1px)] bg-[size:128px_128px] opacity-35" />
        </>
      )}
      {variant === 'spotlight' && (
        <div className="absolute inset-0 bg-[linear-gradient(168deg,var(--slide-color-bg),var(--slide-color-bg-strong))]" />
      )}
      {variant === 'mesh' && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(168deg,var(--slide-color-bg),var(--slide-color-bg-strong))]" />
          <SlideBackdropFrame />
        </>
      )}
    </div>
  );
}

export function SlideContent({
  children,
  width = 'content',
  density = 'comfortable',
  align = 'left',
  className,
}: SlideContentProps) {
  return (
    <div
      className={cn(
        'relative z-10 mx-auto flex w-full flex-col',
        contentWidthClasses[width],
        contentDensityClasses[density],
        contentAlignClasses[align],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SlideHeader({ children, align = 'left', meta, className }: SlideHeaderProps) {
  return (
    <header className={cn('flex w-full flex-col gap-5', contentAlignClasses[align], className)}>
      {meta ? (
        <div className={cn('w-full', align === 'center' ? 'text-center' : 'text-left')}>{meta}</div>
      ) : null}
      {children}
    </header>
  );
}

export function SlideTitle({ children, size = 'display', className }: SlideTitleProps) {
  return (
    <Text variant="h1" size={size} className={className}>
      {children}
    </Text>
  );
}

export function SlideLead({ children, className }: SlideLeadProps) {
  return (
    <Text variant="lead" className={className}>
      {children}
    </Text>
  );
}

export function SlideSection({
  children,
  variant = 'stack',
  padding = 'default',
  className,
}: SlideSectionProps) {
  return (
    <section
      className={cn(
        'relative w-full rounded-[var(--slide-radius-panel)]',
        sectionVariantClasses[variant],
        variant === 'stack' ? '' : sectionPaddingClasses[padding],
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SlideGrid({
  children,
  columns = 12,
  gap = 'md',
  className,
}: SlideGridProps) {
  return (
    <div
      className={cn(
        'grid w-full',
        gridColumnsClasses[columns],
        gridGapClasses[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SlideColumn({
  children,
  span = 12,
  align = 'stretch',
  className,
}: SlideColumnProps) {
  return (
    <div className={cn(columnSpanClasses[span], columnAlignClasses[align], className)}>{children}</div>
  );
}
