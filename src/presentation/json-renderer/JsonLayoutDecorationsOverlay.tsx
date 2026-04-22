import type {
  JsonSlideLayoutDecoration,
  JsonSlideLayoutDecorationIconBadge,
  JsonSlideLayoutIconBadgeDecorationSize,
} from '../jsonSlideTypes';
import { Reveal } from '../../ui/slides';
import { cn } from '../../ui/slides/cn';
import { getJsonSlideCardIcon } from './jsonSlideCardIconRegistry';

const ICON_BADGE_DECORATION_SIZE_CLASS: Record<
  JsonSlideLayoutIconBadgeDecorationSize,
  { iconPx: number; box: string; pad: string }
> = {
  md: { iconPx: 28, box: 'h-14 w-14', pad: 'p-3' },
  lg: { iconPx: 36, box: 'h-[4.5rem] w-[4.5rem]', pad: 'p-4' },
  xl: { iconPx: 48, box: 'h-24 w-24', pad: 'p-6' },
};

function JsonLayoutIconBadgeDecoration({ item, delay }: { item: JsonSlideLayoutDecorationIconBadge; delay: number }) {
  const Icon = getJsonSlideCardIcon(item.icon);
  const { iconPx, box, pad } = ICON_BADGE_DECORATION_SIZE_CLASS[item.size];
  const surface = item.tone === 'surface';

  return (
    <Reveal
      preset="scale-in"
      delay={delay}
      className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full border',
          box,
          pad,
          surface
            ? 'border-[color:var(--slide-color-line)] bg-white shadow-[var(--slide-shadow-soft)]'
            : 'border-[color:var(--slide-color-accent)] bg-white',
        )}
      >
        <Icon
          size={iconPx}
          className={cn(
            surface ? 'text-[color:var(--slide-color-text)]' : 'text-[color:var(--slide-color-accent)]',
          )}
          aria-hidden
        />
      </div>
    </Reveal>
  );
}

export function JsonLayoutDecorationsOverlay({ decorations }: { decorations: JsonSlideLayoutDecoration[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden>
      {decorations.map((d, i) => (
        <JsonLayoutIconBadgeDecoration
          key={`dec-${i}-${d.icon}`}
          item={d}
          delay={0.28 + i * 0.06}
        />
      ))}
    </div>
  );
}
