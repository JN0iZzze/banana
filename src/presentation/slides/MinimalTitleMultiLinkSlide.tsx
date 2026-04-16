import type { SlideRenderProps } from '../types';
import { Reveal, SlideBackdrop, SlideContent, SlideFrame, Text } from '../../ui/slides';

const linkClassName =
  'block text-center font-mono text-3xl tracking-[0.06em] text-[color:var(--slide-color-accent)] underline decoration-white/25 underline-offset-[0.35em] transition-colors hover:text-[color:var(--slide-color-text-soft)] hover:decoration-white/50';

export function MinimalTitleMultiLinkSlide({ slide }: SlideRenderProps) {
  const items = slide.links;
  if (!items?.length) {
    throw new Error('MinimalTitleMultiLinkSlide: задайте непустой массив slide.links');
  }

  return (
    <SlideFrame padding="default" align="center">
      <SlideBackdrop variant="none" />

      <SlideContent
        width="full"
        align="center"
        density="relaxed"
        className="h-full min-h-0 justify-center"
      >
        <div className="flex flex-col items-center gap-8">
          <Reveal preset="soft" delay={0}>
            <Text
              variant="h1"
              size="display"
              className="mx-auto max-w-[var(--slide-content-wide)] text-center text-pretty tracking-tight"
            >
              {slide.title}
            </Text>
          </Reveal>

          <ul className="flex list-none flex-col items-center gap-5">
            {items.map((item, i) => (
              <li key={item.href}>
                <Reveal preset="soft" delay={0.08 + i * 0.06}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    {item.label}
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </SlideContent>
    </SlideFrame>
  );
}
