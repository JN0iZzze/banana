import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
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

const columns = [
  {
    overline: 'Слой',
    title: 'Каркас',
    body: 'SlideFrame задаёт safe-area, вертикальное выравнивание и общий ритм сцены.',
  },
  {
    overline: 'Слой',
    title: 'Контент',
    body: 'SlideContent ограничивает ширину и плотность стека, чтобы текст не «плыл» по всему кадру.',
  },
  {
    overline: 'Слой',
    title: 'Сетка',
    body: 'SlideGrid и SlideColumn дают предсказуемую 12-колоночную раскладку без кастомных процентов.',
  },
] as const;

export function DemoTriptychSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="mesh" accent="primary" />

      <SlideContent width="wide" density="comfortable" className="h-full min-h-0 justify-between">
        <SlideHeader className="max-w-[1720px]" meta={<Text variant="meta">{formatSlideMeta('Сетка 4+4+4', index, totalSlides)}</Text>}>
          <Reveal preset="soft" delay={0}>
            <Text variant="h1" size="section" className="max-w-[18ch]">
              Три колонки — один ритм
            </Text>
          </Reveal>
          <Reveal preset="soft" delay={0.08}>
            <Text variant="lead" className="max-w-[52ch]">
              Лэйаут 4+4+4: три равные вертикали вместо пары 7+5. Подходит для сравнения трёх сущностей или этапов
              в одной сцене.
            </Text>
          </Reveal>
        </SlideHeader>

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          {columns.map((col, colIndex) => (
            <SlideColumn key={col.title} span={4}>
              <Reveal preset="soft" delay={0.14 + colIndex * 0.07} className="h-full">
                <Box tone="standard" padding="default" className="h-full">
                  <div className="flex h-full min-h-0 flex-col gap-[var(--slide-stack-gap-md)]">
                    <Text variant="overline">{col.overline}</Text>
                    <Text variant="h2" className="max-w-[12ch]">
                      {col.title}
                    </Text>
                    <Text variant="body" className="min-h-0 flex-1 text-pretty">
                      {col.body}
                    </Text>
                  </div>
                </Box>
              </Reveal>
            </SlideColumn>
          ))}
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
