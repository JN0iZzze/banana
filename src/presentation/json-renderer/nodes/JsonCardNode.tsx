import type { JsonSlideCard, JsonSlideCardHeaderBadge, JsonSlideCardItemText, JsonSlideGridGap } from '../../jsonSlideTypes';
import { isJsonSlideCardItemText } from '../../jsonSlideTypes';
import { Box, Reveal, SurfaceCard, Text } from '../../../ui/slides';
import { cn } from '../../../ui/slides/cn';
import { cardStackGapCssVar } from '../layouts/cardStackGapCssVar';
import { renderJsonCardComponentItem } from '../jsonSlideCardComponentRegistry';
import { getJsonSlideCardIcon } from '../jsonSlideCardIconRegistry';

export interface JsonCardNodeProps {
  card: JsonSlideCard;
  delay: number;
}

const justifyClass: Record<NonNullable<JsonSlideCard['justify']>, string> = {
  start: 'justify-start',
  end: 'justify-end',
  between: 'justify-between',
};

const headerBadgeToneClass: Record<NonNullable<JsonSlideCardHeaderBadge['tone']>, string> = {
  default: 'border-[color:var(--slide-color-line)] bg-white/[0.04] text-[color:var(--slide-color-text)]',
  accent: 'border-[color:var(--slide-color-line)] bg-white/[0.04] text-[color:var(--slide-color-accent)]',
  onAccent:
    'border-[color:var(--slide-color-line)] bg-white/[0.04] text-[color:var(--slide-color-accent-contrast)]',
};

function renderHeaderBadge(badge: JsonSlideCardHeaderBadge) {
  const tone = badge.tone ?? 'accent';
  return (
    <div
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-[1rem] font-semibold',
        headerBadgeToneClass[tone],
      )}
    >
      {badge.text}
    </div>
  );
}

function renderItemText(
  item: JsonSlideCardItemText,
  reactKey: string,
  onAccent: boolean,
  compactCard: boolean,
  surface: NonNullable<JsonSlideCard['surface']> | undefined,
) {
  const ghost = surface === 'ghost';
  return (
    <Text
      key={`${reactKey}-${item.variant}-${item.text.slice(0, 24)}`}
      variant={item.variant}
      context={onAccent ? 'onAccent' : 'default'}
      className={cn(
        (item.variant === 'h2' || item.variant === 'h3') && 'text-pretty',
        compactCard &&
          item.variant === 'h2' &&
          '!text-[1.65rem] !leading-tight tracking-[-0.03em]',
        surface === 'accentGradient' &&
          item.variant === 'h2' &&
          '!text-[2.35rem] !leading-[1.02] tracking-[-0.03em]',
        ghost && item.variant === 'overline' && 'text-[color:var(--slide-color-accent)]',
        ghost &&
          item.variant === 'h2' &&
          '!text-[2rem] !leading-[1.02] tracking-[-0.03em]',
        onAccent &&
          (item.variant === 'h2' || item.variant === 'h3') &&
          'text-[color:var(--slide-color-accent-contrast)]',
        (item.variant === 'body' || item.variant === 'bodyLg') && 'text-pretty',
        (item.variant === 'body' || item.variant === 'bodyLg') &&
          !onAccent &&
          'text-[color:var(--slide-color-text-soft)]',
      )}
    >
      {item.text}
    </Text>
  );
}

/** Presentation node: optional icons, pinned `subtitle`, content `items[]` with `justify` only on items. */
export function JsonCardNode({ card, delay }: JsonCardNodeProps) {
  const onAccent = card.tone === 'accent';
  const justify = card.justify ?? 'start';
  const padding = card.padding ?? 'default';
  const compactCard = padding === 'compact';
  const stackGapResolved: JsonSlideGridGap = card.stackGap ?? (compactCard ? 'sm' : 'md');
  const stackGapStyle = cardStackGapCssVar(stackGapResolved);
  const surface = card.surface ?? 'box';

  const LeadingIcon = card.leadingIcon ? getJsonSlideCardIcon(card.leadingIcon) : null;
  const WatermarkIcon = card.watermarkIcon ? getJsonSlideCardIcon(card.watermarkIcon) : null;

  const watermarkSize = compactCard ? 140 : card.leadingIcon ? 200 : 160;
  const leadingSize = compactCard ? 32 : onAccent ? 48 : 40;
  const leadingPad = compactCard ? 'p-3' : 'p-4';

  const headerHasPair =
    Boolean(card.headerBadge) &&
    card.items.length >= 2 &&
    isJsonSlideCardItemText(card.items[0]) &&
    card.items[0].variant === 'overline' &&
    isJsonSlideCardItemText(card.items[1]) &&
    card.items[1].variant === 'h2';

  const itemsBody = headerHasPair ? card.items.slice(2) : card.items;

  const inner = (
    <div className="relative flex h-full min-h-0 flex-col" style={{ gap: stackGapStyle }}>
      {card.headerBadge && !headerHasPair ? (
        <div className="pointer-events-none absolute right-4 top-4 z-20">{renderHeaderBadge(card.headerBadge)}</div>
      ) : null}

      {WatermarkIcon ? (
        <div
          className={cn(
            'pointer-events-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4',
            onAccent || surface === 'accentGradient'
              ? 'text-[color:var(--slide-color-accent-contrast)] opacity-[0.12]'
              : 'text-[color:var(--slide-color-text)] opacity-[0.08]',
          )}
          aria-hidden
        >
          <WatermarkIcon size={watermarkSize} />
        </div>
      ) : null}

      {LeadingIcon ? (
        <div
          className={cn(
            'relative z-10 flex w-fit shrink-0 rounded-full',
            onAccent || surface === 'accentGradient'
              ? 'bg-[color:var(--slide-color-accent-contrast)]/20'
              : 'bg-[color:var(--slide-color-text)]/10',
            leadingPad,
          )}
        >
          <LeadingIcon
            size={leadingSize}
            className={cn(
              onAccent || surface === 'accentGradient'
                ? 'opacity-80 text-[color:var(--slide-color-accent-contrast)]'
                : 'text-[color:var(--slide-color-text)]',
            )}
          />
        </div>
      ) : null}

      {card.subtitle ? (
        <div className="relative z-10 shrink-0">
          {renderItemText(card.subtitle, 'subtitle', onAccent, compactCard, surface)}
        </div>
      ) : null}

      {headerHasPair && card.headerBadge ? (
        <div className="relative z-10 flex shrink-0 items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col" style={{ gap: stackGapStyle }}>
            {renderItemText(
              card.items[0] as JsonSlideCardItemText,
              'hdr0',
              onAccent,
              compactCard,
              surface,
            )}
            {renderItemText(
              card.items[1] as JsonSlideCardItemText,
              'hdr1',
              onAccent,
              compactCard,
              surface,
            )}
          </div>
          {renderHeaderBadge(card.headerBadge)}
        </div>
      ) : null}

      <div
        className={cn(
          'relative z-10 flex min-h-0 flex-1 flex-col',
          justifyClass[justify],
          card.headerBadge && !headerHasPair && 'pr-16',
        )}
        style={{ gap: stackGapStyle }}
      >
        {itemsBody.map((item, i) =>
          isJsonSlideCardItemText(item)
            ? renderItemText(item, `body-${i}`, onAccent, compactCard, surface)
            : renderJsonCardComponentItem(card.tone, item, i),
        )}
      </div>
    </div>
  );

  if (surface === 'ghost') {
    return (
      <Reveal preset="soft" delay={delay} className="h-full min-h-0">
        <SurfaceCard
          variant="ghost"
          padding={padding}
          className="h-full min-h-0 border-white/10 bg-white/[0.045] backdrop-blur-[10px]"
        >
          {inner}
        </SurfaceCard>
      </Reveal>
    );
  }

  if (surface === 'accentGradient') {
    return (
      <Reveal preset="soft" delay={delay} className="h-full min-h-0">
        <Box
          tone="accent"
          padding={padding}
          className={cn(
            'h-full',
            'justify-between border-none bg-[linear-gradient(160deg,var(--slide-color-accent),#b53b17)]',
          )}
        >
          {inner}
        </Box>
      </Reveal>
    );
  }

  return (
    <Reveal preset="soft" delay={delay} className="h-full min-h-0">
      <Box
        tone={card.tone}
        padding={padding}
        className={cn(
          'h-full',
          onAccent ? 'border-none' : 'border border-[color:var(--slide-color-line)] shadow-[var(--slide-shadow-soft)]',
        )}
      >
        {inner}
      </Box>
    </Reveal>
  );
}
