import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from './cn';

export type SlideTextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'lead'
  | 'body'
  | 'bodyLg'
  | 'caption'
  | 'overline'
  | 'tileAccent'
  | 'meta';

export type SlideTextH1Size = 'display' | 'section' | 'compact';

export type SlideTextContext = 'default' | 'onAccent';

type TextOwnProps = {
  variant: SlideTextVariant;
  /** Только для variant="h1" */
  size?: SlideTextH1Size;
  context?: SlideTextContext;
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

export type TextProps = TextOwnProps & Omit<ComponentPropsWithoutRef<'p'>, keyof TextOwnProps | 'children'>;

const variantClass: Record<SlideTextVariant, string> = {
  h1: '',
  h2: 'slide-text-h2',
  h3: 'slide-text-h3',
  lead: 'slide-text-lead',
  body: 'slide-text-body',
  bodyLg: 'slide-text-body-lg',
  caption: 'slide-text-caption',
  overline: 'slide-text-overline',
  tileAccent: 'slide-text-tile-accent',
  meta: 'slide-text-meta',
};

const h1SizeClass: Record<SlideTextH1Size, string> = {
  display: 'slide-text-h1-display',
  section: 'slide-text-h1-section',
  compact: 'slide-text-h1-compact',
};

function defaultElement(variant: SlideTextVariant): ElementType {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'meta':
    case 'overline':
    case 'tileAccent':
    case 'caption':
      return 'p';
    default:
      return 'p';
  }
}

export function Text({
  variant,
  size = 'display',
  context = 'default',
  as,
  className,
  children,
  ...rest
}: TextProps) {
  const Component = (as ?? defaultElement(variant)) as ElementType;
  const h1Class = variant === 'h1' ? h1SizeClass[size] : variantClass[variant];
  const baseClass = variant === 'h1' ? h1Class : variantClass[variant];

  return (
    <Component
      className={cn(baseClass, className)}
      data-slide-text-context={context === 'onAccent' ? 'onAccent' : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}
