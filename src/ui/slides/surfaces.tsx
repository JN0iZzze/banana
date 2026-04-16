import type { PropsWithChildren } from 'react';
import { cn } from './cn';

type CardVariant = 'outline' | 'solid' | 'ghost';
type CardPadding = 'compact' | 'default' | 'spacious';
type CardTone = 'default' | 'accent';
type MediaRatio = 'wide' | 'landscape' | 'square' | 'portrait';

interface SurfaceCardProps extends PropsWithChildren {
  variant?: CardVariant;
  padding?: CardPadding;
  tone?: CardTone;
  className?: string;
}

interface MediaFrameProps extends PropsWithChildren {
  ratio?: MediaRatio;
  overlay?: 'shade' | 'glow' | 'none';
  className?: string;
}

const cardVariantClasses: Record<CardVariant, string> = {
  outline:
    'border border-[color:var(--slide-color-line)] bg-[color:var(--slide-color-surface)] shadow-[var(--slide-shadow-soft)]',
  solid:
    'border border-transparent bg-[color:var(--slide-color-accent)] text-[color:var(--slide-color-accent-contrast)] shadow-[var(--slide-shadow-solid)]',
  ghost:
    'border border-[color:var(--slide-color-line)] bg-[color:var(--slide-color-surface-quiet)]',
};

const cardPaddingClasses: Record<CardPadding, string> = {
  compact: 'p-[var(--slide-card-padding-sm)]',
  default: 'p-[var(--slide-card-padding-md)]',
  spacious: 'p-[var(--slide-card-padding-lg)]',
};

const cardToneClasses: Record<CardTone, string> = {
  default: '',
  accent: 'border-[color:var(--slide-color-accent)]',
};

const mediaRatioClasses: Record<MediaRatio, string> = {
  wide: 'aspect-[16/7]',
  landscape: 'aspect-[16/10]',
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
};

export function SurfaceCard({
  children,
  variant = 'outline',
  padding = 'default',
  tone = 'default',
  className,
}: SurfaceCardProps) {
  return (
    <article
      className={cn(
        'relative flex h-full flex-col gap-5 overflow-hidden rounded-[var(--slide-radius-panel)]',
        cardVariantClasses[variant],
        cardPaddingClasses[padding],
        cardToneClasses[tone],
        className,
      )}
    >
      {children}
    </article>
  );
}

export function MediaFrame({
  children,
  ratio = 'landscape',
  overlay = 'shade',
  className,
}: MediaFrameProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--slide-radius-panel)] border border-[color:var(--slide-color-line)] bg-[linear-gradient(145deg,var(--slide-color-bg-strong),var(--slide-color-surface))]',
        mediaRatioClasses[ratio],
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.2),transparent_22%),linear-gradient(135deg,transparent,rgba(255,255,255,0.1))]" />
      {overlay === 'shade' ? (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.22))]" />
      ) : null}
      {overlay === 'glow' ? (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--slide-color-accent),transparent_42%)] opacity-40" />
      ) : null}
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}
