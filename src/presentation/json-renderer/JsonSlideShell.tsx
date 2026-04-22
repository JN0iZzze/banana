import type { ReactNode } from 'react';
import type { JsonSlideDefaultDocument } from '../jsonSlideTypes';
import { formatSlideMeta } from '../slideMeta';
import { cn } from '../../ui/slides/cn';
import { Reveal, SlideBackdrop, SlideBackdropFrame, SlideContent, SlideFrame, SlideHeader, Text } from '../../ui/slides';

export interface JsonSlideShellProps {
  doc: JsonSlideDefaultDocument;
  index: number;
  totalSlides: number;
  children: ReactNode;
}

export function JsonSlideShell({ doc, index, totalSlides, children }: JsonSlideShellProps) {
  const frame = doc.frame ?? {};
  const backdrop = doc.backdrop ?? {};
  const content = doc.content ?? {};
  const backdropVariant = backdrop.variant ?? 'grid';
  // `SlideBackdrop` already renders `SlideBackdropFrame` for `grid` and `mesh`; adding it here too doubled the frame.
  const backdropAlreadyHasFrame = backdropVariant === 'grid' || backdropVariant === 'mesh';
  const showShellBorderFrame = backdrop.borderFrame === true && !backdropAlreadyHasFrame;
  const showDimmedSpotlight = backdrop.dimmed === true && backdropVariant === 'spotlight';

  return (
    <SlideFrame align={frame.align ?? 'top'} padding={frame.padding ?? 'compact'} className="relative isolate">
      <SlideBackdrop
        variant={backdropVariant}
        className={cn(showDimmedSpotlight ? 'opacity-70' : undefined)}
      />
      {showShellBorderFrame ? <SlideBackdropFrame className="z-20" /> : null}

      <SlideContent
        width={content.width ?? 'wide'}
        density={content.density ?? 'compact'}
        align={content.align ?? 'left'}
        className={cn('relative h-full min-h-0 justify-between gap-6', showShellBorderFrame ? 'z-30' : 'z-10')}
      >
        <SlideHeader
          align={doc.header.align ?? 'left'}
          className="max-w-[1720px] shrink-0 gap-3"
          meta={<Text variant="meta">{formatSlideMeta(doc.header.meta, index, totalSlides)}</Text>}
        >
          {doc.header.title != null && doc.header.title.length > 0 ? (
            <Reveal preset="soft" delay={0.12}>
              <Text
                variant="h1"
                size="compact"
                className={[
                  'max-w-[28ch] leading-[1.02] tracking-[-0.03em]',
                  doc.header.align === 'center' ? 'text-center' : '',
                ].join(' ').trim()}
              >
                {doc.header.title}
              </Text>
            </Reveal>
          ) : null}
          {doc.header.lead ? (
            <Reveal preset="soft" delay={0.18}>
              <Text
                variant="lead"
                className={[
                  'max-w-[70ch] text-pretty',
                  doc.header.align === 'center' ? 'text-center' : '',
                ].join(' ').trim()}
              >
                {doc.header.lead}
              </Text>
            </Reveal>
          ) : null}
        </SlideHeader>

        {children}
      </SlideContent>
    </SlideFrame>
  );
}
