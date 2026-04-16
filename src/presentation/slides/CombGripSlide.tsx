import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideBackdrop,
  SlideBackdropFrame,
  SlideContent,
  SlideFrame,
  SlideHeader,
  SlidePromptQuote,
  Text,
} from '../../ui/slides';

const BG = '/images/comb-surf.jpg' as const;

const PROMPT = `«Сделай так, что три фигуры под угрозой расплющивания:
I — уже расплющило и придавило AI-волной
T — почти расплющило
M — нависла угроза тень

Только последняя фигура счастлива и остается на вершине»`;

const SKILLS: readonly { label: string; top: string; left: string }[] = [
  { label: 'разработчиком', top: '8rem', left: '2rem' },
  { label: 'видеографом', top: '14rem', left: '6rem' },
  { label: 'моушн дизайнером', top: '6rem', left: '20rem' },
  { label: 'режиссёром', top: '20rem', left: '3rem' },
  { label: '3D-шником', top: '12rem', left: '22rem' },
  { label: 'фотографом', top: '19rem', left: '19rem' },
] as const;

export function CombGripSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame align="top" padding="default" className="relative isolate !p-0 overflow-hidden">
      <SlideBackdrop variant="spotlight" accent="primary" />
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        <img src={BG} alt="" className="h-full w-full object-cover" />
      </div>
      <SlideBackdropFrame className="z-20" />

      <SlideContent
        width="full"
        density="compact"
        className="relative z-30 h-full min-h-0 px-[var(--slide-safe-x)] py-[var(--slide-safe-y)]"
      >
        <SlideHeader
          className="max-w-[1720px]"
          meta={
            <Text variant="meta" className="text-[color:var(--slide-color-text)]">
              {formatSlideMeta('Держаться за гребень', index, totalSlides)}
            </Text>
          }
        />

        <div className="relative mt-4 min-h-0 flex-1">
          <div className="relative z-10 max-w-[1200px]">
            <Reveal preset="enter-left" delay={0.12} className="flex flex-col gap-6">
              <Text
                variant="h1"
                size="display"
                className="!max-w-[14ch] !text-[4rem] !leading-[0.95] !text-white"
              >
                Держаться
                <br />
                за гребень
              </Text>
              <Text variant="h2" className="!text-[2.25rem] !font-normal !text-white/75">
                Быть чуть чуть
              </Text>
            </Reveal>
          </div>

          <div className="pointer-events-none absolute left-0 top-[8rem] z-10 h-[min(640px,calc(100%-14rem))] w-full">
            {SKILLS.map((skill, i) => (
              <Reveal key={skill.label} preset="soft" delay={0.22 + i * 0.08}>
                <span
                  className="absolute whitespace-nowrap rounded-full border-2 border-white bg-transparent px-6 py-3 text-[1.875rem] leading-none text-white"
                  style={{ top: skill.top, left: skill.left }}
                >
                  {skill.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal
          preset="enter-up"
          delay={0.28}
          className="pointer-events-auto absolute bottom-[calc(var(--slide-stack-gap-lg)+var(--slide-stack-gap-md))] right-[calc(var(--slide-stack-gap-lg)+var(--slide-stack-gap-md))] z-[15] max-w-[720px]"
        >
          <div className="rounded-2xl bg-black/55 p-6 backdrop-blur-md">
            <SlidePromptQuote className="border-l-[color:var(--slide-color-accent)] [&_pre]:text-[1.2rem] [&_pre]:leading-snug [&_pre]:text-white/95">
              {PROMPT}
            </SlidePromptQuote>
          </div>
        </Reveal>
      </SlideContent>
    </SlideFrame>
  );
}
