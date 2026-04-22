import { defineJsonSlide } from '../defineJsonSlide';
import type { JsonSlideDefinition } from '../../types';
import { VIBECODING_DECK_SLIDE_IDS } from '../vibecodingSlideIds';

import rawCover from './schemas/slide-vibecoding-v2-01-cover.json';
import rawPastTeam from './schemas/slide-vibecoding-v2-02-past-team.json';
import rawNowSoloAi from './schemas/slide-vibecoding-v2-03-now-solo-ai.json';
import rawShiftIsReal from './schemas/slide-vibecoding-v2-04-shift-is-real.json';
import rawBooster from './schemas/slide-vibecoding-v2-05-booster.json';
import rawHero from './schemas/slide-vibecoding-v2-06-hero.json';
import rawThreeFears from './schemas/slide-vibecoding-v2-07-three-fears.json';
import rawAct2Separator from './schemas/slide-vibecoding-v2-08-act2-separator.json';

const sid = VIBECODING_DECK_SLIDE_IDS;

/**
 * Активные JSON-слайды вайбкодинг-деки. Сценарий — `vibecoding-deck-plan.md`.
 * Legacy-слайды прежней версии: `./archive/legacyJsonSlides.ts`.
 */
export const vibecodingJsonSlides: JsonSlideDefinition[] = [
  defineJsonSlide({
    id: sid.cover,
    title: 'Вайбкодинг',
    theme: 'editorial',
    raw: rawCover,
    source: 'slide-vibecoding-v2-01-cover.json',
    notes: 'Акт I · Обложка. Пролог — путь героя от идеи к продукту.',
  }),
  defineJsonSlide({
    id: sid.pastTeam,
    title: 'Раньше: команда и полгода',
    theme: 'editorial',
    raw: rawPastTeam,
    source: 'slide-vibecoding-v2-02-past-team.json',
    notes: 'Акт I · Обычный мир. MVP как команда из 5–6 человек и полугода.',
  }),
  defineJsonSlide({
    id: sid.nowSoloAi,
    title: 'Сейчас: один + ИИ × недели',
    theme: 'editorial',
    raw: rawNowSoloAi,
    source: 'slide-vibecoding-v2-03-now-solo-ai.json',
    notes: 'Акт I · Зов к приключению. Сдвиг: доступ к производству продуктов, не революция в коде.',
  }),
  defineJsonSlide({
    id: sid.shiftIsReal,
    title: 'Сдвиг уже случился',
    theme: 'editorial',
    raw: rawShiftIsReal,
    source: 'slide-vibecoding-v2-04-shift-is-real.json',
    notes: 'Акт I · Подтверждение. Цифры: App Store ≈8–11K/нед, стоимость MVP ~$40–80K медиана.',
  }),
  defineJsonSlide({
    id: sid.booster,
    title: 'Вайбкодинг — бустер',
    theme: 'editorial',
    raw: rawBooster,
    source: 'slide-vibecoding-v2-05-booster.json',
    notes: 'Акт I · Переход порога. Определение Карпатого: ты — куратор контекста, агент — руки.',
  }),
  defineJsonSlide({
    id: sid.hero,
    title: 'Герой: дизайнер с идеями',
    theme: 'editorial',
    raw: rawHero,
    source: 'slide-vibecoding-v2-06-hero.json',
    notes: 'Акт I · Герой. Слушатель узнаёт себя: дизайнер с идеями, без команды и года — и с главным вопросом «как превращать идеи в продукты».',
  }),
  defineJsonSlide({
    id: sid.threeFears,
    title: 'Три страха на пороге',
    theme: 'editorial',
    raw: rawThreeFears,
    source: 'slide-vibecoding-v2-07-three-fears.json',
    notes: 'Акт I · Отказ от зова. Три возражения дизайнера — почему они звучат убедительно и куда уводят от действия.',
  }),
  defineJsonSlide({
    id: sid.act2Separator,
    title: 'Акт II · Выбор инструмента',
    theme: 'editorial',
    raw: rawAct2Separator,
    source: 'slide-vibecoding-v2-08-act2-separator.json',
    notes: 'Сепаратор Акта II. Переключение с «почему» на «чем».',
  }),
];
