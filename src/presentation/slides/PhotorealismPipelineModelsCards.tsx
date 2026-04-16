import type { ComponentType } from 'react';
import ByteDance from '@lobehub/icons/es/ByteDance';
import Flux from '@lobehub/icons/es/Flux';
import Gemini from '@lobehub/icons/es/Gemini';
import OpenAI from '@lobehub/icons/es/OpenAI';
import Volcengine from '@lobehub/icons/es/Volcengine';
import {
  Box,
  Reveal,
  SlideColumn,
  SlideGrid,
  Text,
} from '../../ui/slides';
import { cn } from '../../ui/slides/cn';

type BrandIcon = ComponentType<{ size?: number }>;

type ModelCard = {
  title: string;
  icon: BrandIcon;
  accent?: boolean;
  /** Колонок из 12 в сетке (верхний ряд 4+4+4, нижний 6+6). */
  span: 4 | 6;
};

const CARDS: ModelCard[] = [
  {
    title: 'Nano Banana Pro (v2)',
    icon: Gemini,
    accent: true,
    span: 4,
  },
  {
    title: 'GPT Images 1.5',
    icon: OpenAI,
    span: 4,
  },
  {
    title: 'Seedream 4.5 (5 Lite)',
    icon: ByteDance,
    span: 4,
  },
  {
    title: 'Wan 2.7',
    icon: Volcengine,
    span: 6,
  },
  {
    title: 'Flux 2',
    icon: Flux,
    span: 6,
  },
];

function ModelCardView({ card, index }: { card: ModelCard; index: number }) {
  const Icon = card.icon;
  const isAccent = Boolean(card.accent);

  return (
    <Reveal preset="soft" delay={0.14 + index * 0.05} className="h-full min-h-0">
      <Box
        tone={isAccent ? 'accent' : 'standard'}
        padding="default"
        className={
          isAccent
            ? 'h-full border-none'
            : 'h-full border border-[color:var(--slide-color-line)]'
        }
      >
        <div className="relative flex h-full min-h-0 flex-col">
          <div
            className={
              isAccent
                ? 'pointer-events-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 text-[color:var(--slide-color-accent-contrast)] opacity-[0.12]'
                : 'pointer-events-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 text-[color:var(--slide-color-text)] opacity-[0.08]'
            }
            aria-hidden
          >
            <Icon size={160} />
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end items-start">
            <Text
              variant="h2"
              className={cn(
                'max-w-[20ch] shrink-0 text-pretty pr-32',
                isAccent && 'text-[color:var(--slide-color-accent-contrast)]',
              )}
            >
              {card.title}
            </Text>
          </div>
        </div>
      </Box>
    </Reveal>
  );
}

export function PhotorealismPipelineModelsCards() {
  return (
    <SlideGrid columns={12} gap="sm" className="min-h-0 flex-1 auto-rows-fr items-stretch">
      {CARDS.map((card, index) => (
        <SlideColumn key={card.title} span={card.span} className="min-h-0">
          <ModelCardView card={card} index={index} />
        </SlideColumn>
      ))}
    </SlideGrid>
  );
}
