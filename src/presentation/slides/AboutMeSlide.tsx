import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideBackdrop,
  SlideContent,
  SlideFrame,
  SlideHeader,
  Text,
} from '../../ui/slides';

const ROLE_CLASS =
  'text-center text-pretty !max-w-none !font-bold !text-[3.75rem] !leading-[0.98] !tracking-[-0.03em]';

export function AboutMeSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="default" align="center">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent
        width="wide"
        align="center"
        density="relaxed"
        className="h-full min-h-0 justify-center"
      >
        <SlideHeader
          align="center"
          className="max-w-[var(--slide-content-wide)] shrink-0 gap-[var(--slide-stack-gap-md)]"
          meta={
            <Text variant="meta" className="text-center">
              {formatSlideMeta('Обо мне', index, totalSlides)}
            </Text>
          }
        />

        <div className="flex flex-col items-center gap-[var(--slide-stack-gap-sm)] text-center">
          <Reveal preset="soft" delay={0.1}>
            <Text
              variant="h1"
              size="section"
              className="!max-w-none text-center text-pretty text-[color:var(--slide-color-text-soft)]"
            >
              Евсеичев Антон
            </Text>
          </Reveal>

          <Reveal preset="soft" delay={0.2}>
            <Text variant="h2" className={ROLE_CLASS}>
              Ex-Frontend Developer
            </Text>
          </Reveal>

          <Reveal preset="soft" delay={0.3}>
            <Text variant="h2" className={ROLE_CLASS}>
              Product Designer
            </Text>
          </Reveal>

          <Reveal preset="soft" delay={0.4}>
            <Text variant="h2" className={ROLE_CLASS}>
              Vibe Coder
            </Text>
          </Reveal>

          <Reveal preset="soft" delay={0.5}>
            <Text variant="h2" className={ROLE_CLASS}>
              Solopreneur
            </Text>
          </Reveal>

          <Reveal preset="soft" delay={0.6}>
            <Text variant="h2" className={ROLE_CLASS}>
              <span className="text-[color:var(--slide-color-accent)]">Floux.pro</span> founder
            </Text>
          </Reveal>
        </div>
      </SlideContent>
    </SlideFrame>
  );
}
