import type { ComponentType } from 'react';
import {
  BarChart3,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  Palette,
  PenTool,
  Share2,
  Sparkles,
  Type,
} from 'lucide-react';
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

type TileIcon = ComponentType<{ size?: number; className?: string }>;

function TallAccentCard({
  title,
  note,
  Icon,
  delay,
}: {
  title: string;
  note: string;
  Icon: TileIcon;
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
            <Text variant="body" context="onAccent" className="max-w-[22ch] text-pretty opacity-80">
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
  WatermarkIcon: TileIcon;
  SmallIcon: TileIcon;
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
            <Text variant="body" className="max-w-[22ch] text-pretty text-[color:var(--slide-color-text-soft)]">
              {note}
            </Text>
          </div>
        </div>
      </Box>
    </Reveal>
  );
}

function SmallUseCaseCard({
  title,
  note,
  Icon,
  delay,
}: {
  title: string;
  note: string;
  Icon: TileIcon;
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

export function NanoBananaUseCasesSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between gap-6">
        <SlideHeader
          className="max-w-[1720px] shrink-0 gap-3"
          meta={
            <Text variant="meta">{formatSlideMeta('Nano Banana · кейсы', index, totalSlides)}</Text>
          }
        >
          <Reveal preset="soft" delay={0.08}>
            <Text variant="h1" size="compact" className="max-w-[28ch] leading-[1.02] tracking-[-0.03em]">
              Сценарии использования
            </Text>
          </Reveal>
          <Reveal preset="soft" delay={0.12}>
            <Text variant="lead" className="max-w-[70ch] text-pretty">
              Задачи, с которыми Nano Banana справится лучше хорошо
            </Text>
          </Reveal>
        </SlideHeader>

        <div className="grid min-h-0 w-full flex-1 grid-cols-4 grid-rows-3 gap-4">
          <div className="col-span-1 row-span-2 min-h-0">
            <TallAccentCard
              delay={0.14}
              title="Фотореализм"
              note="Генерация объектов и персонажей с сохранением идентичности референса"
              Icon={ImageIcon}
            />
          </div>
          <div className="col-span-1 row-span-2 min-h-0">
            <TallStandardCard
              delay={0.18}
              title="Перенос стиля"
              note="Перенос стиля, материалов и текстур из референса на другие объекты"
              WatermarkIcon={Palette}
              SmallIcon={Palette}
            />
          </div>
          <div className="col-span-1 row-span-2 min-h-0">
            <TallStandardCard
              delay={0.22}
              title="Мокапы"
              note="Упаковка, интерфейсы и предметы в готовой сцене"
              WatermarkIcon={LayoutTemplate}
              SmallIcon={LayoutTemplate}
            />
          </div>
          <div className="col-span-1 row-span-1 min-h-0">
            <SmallUseCaseCard
              delay={0.26}
              title="Иллюстрации"
              note="Стилизация, плоскости и выразительный рисунок"
              Icon={PenTool}
            />
          </div>
          <div className="col-span-1 row-span-1 min-h-0">
            <SmallUseCaseCard
              delay={0.3}
              title="Точечные правки"
              note="Меняем зону или деталь, остальное держим как есть"
              Icon={Sparkles}
            />
          </div>
          <div className="col-span-1 row-span-1 min-h-0">
            <SmallUseCaseCard
              delay={0.34}
              title="Инфографика"
              note="Схемы, диаграммы и наглядная подача данных"
              Icon={BarChart3}
            />
          </div>
          <div className="col-span-1 row-span-1 min-h-0">
            <SmallUseCaseCard
              delay={0.38}
              title="Готовая типографика"
              note="Текст как часть макета, читаемость в кадре"
              Icon={Type}
            />
          </div>
          <div className="col-span-1 row-span-1 min-h-0">
            <SmallUseCaseCard
              delay={0.42}
              title="Стилизация"
              note="Генерация изображений по референсу в новой стилистике"
              Icon={Layers}
            />
          </div>
          <div className="col-span-1 row-span-1 min-h-0">
            <SmallUseCaseCard
              delay={0.46}
              title="Креативы для соцсетей"
              note="Обложки, карусели и баннеры под формат площадки"
              Icon={Share2}
            />
          </div>
        </div>
      </SlideContent>
    </SlideFrame>
  );
}
