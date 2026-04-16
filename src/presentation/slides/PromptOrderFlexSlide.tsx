import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Box,
  Reveal,
  SlideBackdrop,
  SlideBackdropFrame,
  SlideContent,
  SlideFrame,
  SlideGrid,
  SlideHeader,
  SlideColumn,
  SurfaceCard,
  Text,
} from '../../ui/slides';

const PROMPT_EN =
  'Extreme low angle shot, Asian model in high-end eccentric pink blazer and gold pleated trousers, dramatic pose, studio lighting, stark concrete backdrop, Hasselblad H6D, fashion editorial, hyper-realistic.';

const PROMPT_RU =
  'Азиатская модель в роскошном эксцентричном розовом блейзере и золотых плиссированных брюках, эффектная поза, студийное освещение, строгий бетонный фон, Hasselblad H6D, модная фотосессия, гиперреалистичный стиль. Съемка с крайне низкого ракурса,';

const PROMPT_MONO =
  'm-0 min-h-0 whitespace-pre-wrap font-mono text-2xl leading-snug text-[color:var(--slide-color-text)]';

export function PromptOrderFlexSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact" align="top" className="relative isolate min-h-full">
      <SlideBackdrop variant="spotlight" accent="primary" className="opacity-70" />
      <SlideBackdropFrame className="z-20" />

      <SlideContent width="wide" density="compact" className="relative z-10 h-full min-h-0 justify-between gap-8">
        <SlideHeader
          className="max-w-[1720px] gap-3"
          meta={<Text variant="meta">{formatSlideMeta('Промпт: порядок', index, totalSlides)}</Text>}
        >
          <Reveal preset="soft" delay={0.04}>
            <Text variant="h1" size="compact" className="max-w-[20ch] leading-[1.02] tracking-[-0.03em]">
              Формула не догма
            </Text>
          </Reveal>
        </SlideHeader>

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={6} className="min-h-0">
            <Reveal preset="enter-left" delay={0.14} className="h-full min-h-0">
              <SurfaceCard
                variant="ghost"
                padding="default"
                className="flex h-full min-h-0 flex-col border-white/10 bg-white/[0.045] backdrop-blur-[10px]"
              >
                <pre className={`${PROMPT_MONO} min-h-0 flex-1`}>{PROMPT_EN}</pre>
              </SurfaceCard>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={6} className="min-h-0">
            <Reveal preset="enter-right" delay={0.2} className="h-full min-h-0">
              <SurfaceCard
                variant="ghost"
                padding="default"
                className="flex h-full min-h-0 flex-col border-white/10 bg-white/[0.045] backdrop-blur-[10px]"
              >
                <pre className={`${PROMPT_MONO} min-h-0 flex-1`}>{PROMPT_RU}</pre>
              </SurfaceCard>
            </Reveal>
          </SlideColumn>
        </SlideGrid>

        <Reveal preset="soft" delay={0.3} className="w-full min-w-0 self-stretch">
          <Box
            tone="accent"
            padding="default"
            className="w-full border-none bg-[linear-gradient(160deg,var(--slide-color-accent),#b53b17)]"
          >
            <Text variant="bodyLg" context="onAccent" className="text-pretty text-[color:var(--slide-color-accent-contrast)]">
              Важнее не священный порядок, а полнота инструкции, ясные приоритеты и отсутствие противоречий.
            </Text>
          </Box>
        </Reveal>
      </SlideContent>
    </SlideFrame>
  );
}
