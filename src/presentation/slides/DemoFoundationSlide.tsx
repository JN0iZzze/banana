import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  BlockCard,
  Box,
  Reveal,
  SlideBackdrop,
  SlideColumn,
  SlideContent,
  SlideFrame,
  SlideGrid,
  SlideHeader,
  Text,
} from '../../ui/slides';

const systemPrinciples = [
  'Единые safe-area, max-width и vertical rhythm для всех слайдов.',
  'Темы оформлены как токены и presets, а не как разрозненные utility-наборы.',
  'Новые слайды собираются через composable JSX-кирпичики без дублирования layout-кода.',
];

const buildingBlocks = [
  'Frame + Backdrop',
  'Header + Title + Lead',
  'Grid + Column',
  'Box + BlockCard + Text',
];

export function DemoFoundationSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader className="max-w-[1720px] gap-3" meta={<Text variant="meta">{formatSlideMeta('Каркас презентации', index, totalSlides)}</Text>}>
          <Reveal preset="soft" delay={0}>
            <Text variant="h1" size="compact" className="leading-[1.02] tracking-[-0.03em]">
              Система для будущих слайдов,
              <br />
              а&nbsp;не одноразовый макет
            </Text>
          </Reveal>
          <Reveal preset="soft" delay={0.1}>
            <Text variant="lead" className="max-w-[70ch]">
              Каркас уже стандартизирует поля, композицию, темы и surface-patterns, чтобы следующие
              слайды можно было быстро собирать из готовых кирпичиков.
            </Text>
          </Reveal>
        </SlideHeader>

        <SlideGrid columns={12} gap="sm" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          <SlideColumn span={7}>
            <Reveal preset="soft" delay={0.2} className="h-full">
              <Box tone="standard" padding="default" className="h-full">
                <div className="flex h-full min-h-0 flex-col justify-between gap-[var(--slide-stack-gap-md)]">
                  <div className="space-y-[var(--slide-stack-gap-sm)]">
                    <Text variant="overline">System Guarantees</Text>
                    <Text variant="h3" className="max-w-[30ch]">
                      Один язык layout-решений для любой будущей сцены презентации.
                    </Text>
                  </div>

                  <div className="grid gap-[var(--slide-block-card-gap-sm)]">
                    {systemPrinciples.map((principle, principleIndex) => (
                      <BlockCard key={principle} numbered index={principleIndex + 1}>
                        {principle}
                      </BlockCard>
                    ))}
                  </div>
                </div>
              </Box>
            </Reveal>
          </SlideColumn>

          <SlideColumn span={5}>
            <Reveal preset="soft" delay={0.28} className="h-full">
              <Box tone="accent" padding="default" className="h-full">
                <Text variant="overline" context="onAccent" className="shrink-0">
                  Ready Bricks
                </Text>
                <div className="grid min-h-0 min-w-0 flex-1 grid-cols-2 grid-rows-2 gap-[var(--slide-block-card-gap)] [grid-template-rows:repeat(2,minmax(0,1fr))] [grid-template-columns:repeat(2,minmax(0,1fr))]">
                  {buildingBlocks.map((block) => (
                    <BlockCard key={block} layout="tile">
                      <Text variant="tileAccent" as="span">
                        {block}
                      </Text>
                    </BlockCard>
                  ))}
                </div>
              </Box>
            </Reveal>
          </SlideColumn>
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
