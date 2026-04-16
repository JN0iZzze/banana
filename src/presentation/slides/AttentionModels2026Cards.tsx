import type { ComponentType } from 'react';
import ByteDance from '@lobehub/icons/es/ByteDance';
import Flux from '@lobehub/icons/es/Flux';
import Gemini from '@lobehub/icons/es/Gemini';
import Grok from '@lobehub/icons/es/Grok';
import Midjourney from '@lobehub/icons/es/Midjourney';
import OpenAI from '@lobehub/icons/es/OpenAI';
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
  note: string;
  icon: BrandIcon;
  accent?: boolean;
};

const CARDS: ModelCard[] = [
  {
    title: 'Nano Banana Pro (v2)',
    note: 'Редактирование, последовательные правки и точное удержание сцены.',
    icon: Gemini,
    accent: true,
  },
  {
    title: 'Seedream 4.5 (5 Lite)',
    note: 'Типографика, высокое разрешение и коммерческая чистота картинки.',
    icon: ByteDance,
  },
  {
    title: 'Midjourney v7(v8)',
    note: 'Стилизация, эстетика и сильная работа с Omni Ref.',
    icon: Midjourney,
  },
  {
    title: 'GPT Image 1.5',
    note: 'Текст в кадре, инструктивность и повседневные рабочие задачи.',
    icon: OpenAI,
  },
  {
    title: 'Recraft V4',
    note: 'Стильные продуктовые иллюстрации и типографика',
    icon: Flux,
  },
  {
    title: 'Grok Imagine',
    note: 'Быстрые вариации, сильная стилизация и свежая альтернатива Midjourney.',
    icon: Grok,
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

          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between">
            <Text
              variant="h2"
              className={cn(
                'max-w-[20ch] shrink-0 text-pretty',
                isAccent && 'text-[color:var(--slide-color-accent-contrast)]',
              )}
            >
              {card.title}
            </Text>
            <Text
              variant="body"
              context={isAccent ? 'onAccent' : 'default'}
              className={cn(
                'text-pretty',
                isAccent ? 'opacity-80' : 'text-[color:var(--slide-color-text-soft)]',
              )}
            >
              {card.note}
            </Text>
          </div>
        </div>
      </Box>
    </Reveal>
  );
}

export function AttentionModels2026Cards() {
  return (
    <SlideGrid columns={12} gap="sm" className="min-h-0 flex-1 auto-rows-fr items-stretch">
      {CARDS.map((card, index) => (
        <SlideColumn key={card.title} span={4} className="min-h-0">
          <ModelCardView card={card} index={index} />
        </SlideColumn>
      ))}
    </SlideGrid>
  );
}
