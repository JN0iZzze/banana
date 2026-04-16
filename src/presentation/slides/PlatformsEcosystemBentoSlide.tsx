import type { ComponentType } from 'react';
import ByteDance from '@lobehub/icons/es/ByteDance';
import Gemini from '@lobehub/icons/es/Gemini';
import Grok from '@lobehub/icons/es/Grok';
import Midjourney from '@lobehub/icons/es/Midjourney';
import OpenAI from '@lobehub/icons/es/OpenAI';
import { Clapperboard, Palette, Video, Workflow } from 'lucide-react';
import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Box,
  Reveal,
  SlideBackdrop,
  SlideContent,
  SlideFrame,
  SlideHeader,
  Text,
} from '../../ui/slides';

type BrandIcon = ComponentType<{ size?: number; className?: string }>;

function TallAccentCard({
  title,
  note,
  Icon,
  delay,
}: {
  title: string;
  note: string;
  Icon: BrandIcon;
  delay: number;
}) {
  return (
    <Reveal preset="soft" delay={delay} className="h-full min-h-0">
      <Box tone="accent" padding="default" className="h-full border-none">
        <div className="relative flex h-full min-h-0 flex-col justify-between">
          <div
            className="pointer-events-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 text-[color:var(--slide-color-accent-contrast)] opacity-[0.12]"
            aria-hidden
          >
            <Icon size={200} />
          </div>
          <div className="relative z-10 flex w-fit rounded-full bg-[color:var(--slide-color-accent-contrast)]/20 p-4">
            <Icon size={48} className="opacity-80 text-[color:var(--slide-color-accent-contrast)]" />
          </div>
          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end gap-4">
            <Text
              variant="h2"
              className="max-w-[14ch] text-pretty text-[color:var(--slide-color-accent-contrast)]"
            >
              {title}
            </Text>
            <Text variant="bodyLg" context="onAccent" className="max-w-[22ch] text-pretty opacity-80">
              {note}
            </Text>
          </div>
        </div>
      </Box>
    </Reveal>
  );
}

function TallStandardCard({
  title,
  note,
  WatermarkIcon,
  SmallIcon,
  delay,
}: {
  title: string;
  note: string;
  WatermarkIcon: BrandIcon;
  SmallIcon: BrandIcon;
  delay: number;
}) {
  return (
    <Reveal preset="soft" delay={delay} className="h-full min-h-0">
      <Box
        tone="standard"
        padding="default"
        className="h-full border border-[color:var(--slide-color-line)] shadow-[var(--slide-shadow-soft)]"
      >
        <div className="relative flex h-full min-h-0 flex-col justify-between">
          <div
            className="pointer-events-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 text-[color:var(--slide-color-text)] opacity-[0.06]"
            aria-hidden
          >
            <WatermarkIcon size={200} />
          </div>
          <div className="relative z-10 flex w-fit rounded-full bg-[color:var(--slide-color-text)]/10 p-4">
            <SmallIcon size={40} className="text-[color:var(--slide-color-text)]" />
          </div>
          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end gap-3">
            <Text variant="h2" className="max-w-[14ch] text-pretty">
              {title}
            </Text>
            <Text variant="bodyLg" className="max-w-[22ch] text-pretty text-[color:var(--slide-color-text-soft)]">
              {note}
            </Text>
          </div>
        </div>
      </Box>
    </Reveal>
  );
}

function SmallToolCard({
  title,
  note,
  Icon,
  delay,
}: {
  title: string;
  note: string;
  Icon: BrandIcon;
  delay: number;
}) {
  return (
    <Reveal preset="soft" delay={delay} className="h-full min-h-0">
      <Box
        tone="standard"
        padding="compact"
        className="h-full justify-between border border-[color:var(--slide-color-line)] shadow-[var(--slide-shadow-soft)]"
      >
        <div className="relative z-10 flex w-fit rounded-full bg-[color:var(--slide-color-text)]/10 p-3">
          <Icon size={32} className="text-[color:var(--slide-color-text)]" />
        </div>
        <div className="relative z-10 mt-4 flex flex-col gap-1">
          <Text
            variant="h2"
            className="max-w-[18ch] text-pretty !text-[1.65rem] !leading-tight tracking-[-0.03em]"
          >
            {title}
          </Text>
          <Text variant="body" className="max-w-[24ch] text-pretty text-[color:var(--slide-color-text-soft)]">
            {note}
          </Text>
        </div>
      </Box>
    </Reveal>
  );
}

export function PlatformsEcosystemBentoSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between gap-6">
        <SlideHeader
          className="max-w-[1720px] shrink-0 gap-3"
          meta={
            <Text variant="meta">{formatSlideMeta('Экосистема генерации', index, totalSlides)}</Text>
          }
        >
          <Reveal preset="soft" delay={0.08}>
            <Text variant="h1" size="compact" className="max-w-[24ch] leading-[1.02] tracking-[-0.03em]">
              Платформы и модели
            </Text>
          </Reveal>
          <Reveal preset="soft" delay={0.12}>
            <Text variant="lead" className="max-w-[70ch] text-pretty">
              Кто задаёт тон в генерации изображений, видео и сборке воркфлоу в&nbsp;2026
            </Text>
          </Reveal>
        </SlideHeader>

        <div className="grid min-h-0 w-full flex-1 grid-cols-4 grid-rows-3 gap-4">
          <div className="col-span-1 row-span-2 min-h-0">
            <TallAccentCard
              delay={0.14}
              title="Nano Banana Pro (2)"
              note="Главный сдвиг в генерации и редактировании"
              Icon={Gemini}
            />
          </div>
          <div className="col-span-1 row-span-2 min-h-0">
            <TallStandardCard
              delay={0.18}
              title="Higgsfield"
              note="Cinema Studio 2.0, AI Influencer и новые motion-сценарии"
              WatermarkIcon={Clapperboard}
              SmallIcon={Clapperboard}
            />
          </div>
          <div className="col-span-1 row-span-2 min-h-0">
            <TallStandardCard
              delay={0.22}
              title="Weavy.ai и др."
              note="Нодовая платформа для сборки рабочих процессов"
              WatermarkIcon={Workflow}
              SmallIcon={Workflow}
            />
          </div>
          <div className="col-span-1 row-span-1 min-h-0">
            <SmallToolCard delay={0.26} title="Recraft V4" note="Векторные иллюстрации и типографика" Icon={Palette} />
          </div>
          <div className="col-span-1 row-span-1 min-h-0">
            <SmallToolCard
              delay={0.3}
              title="GPT Image 1.5"
              note="Обновленная флагманская модель"
              Icon={OpenAI}
            />
          </div>
          <div className="col-span-1 row-span-1 min-h-0">
            <SmallToolCard
              delay={0.34}
              title="Kling 3.0 · Seedance 2.0"
              note="Реалистичная генерация видео с поддержкой мультисцен"
              Icon={Video}
            />
          </div>
          <div className="col-span-1 row-span-1 min-h-0">
            <SmallToolCard delay={0.38} title="Grok Imagine" note="Новый игрок" Icon={Grok} />
          </div>
          <div className="col-span-1 row-span-1 min-h-0">
            <SmallToolCard delay={0.42} title="Seedream 4.5" note="Типографика и 4K" Icon={ByteDance} />
          </div>
          <div className="col-span-1 row-span-1 min-h-0">
            <SmallToolCard
              delay={0.46}
              title="Midjourney v8"
              note="Эстетика и Omni Ref"
              Icon={Midjourney}
            />
          </div>
        </div>
      </SlideContent>
    </SlideFrame>
  );
}
