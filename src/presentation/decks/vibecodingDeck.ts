import type { DeckDefinition } from '../types';
import { vibecodingJsonSlides } from './vibecoding/jsonSlides';

/**
 * Дека `/vibecoding` пересобирается с нуля по новому сценарию (апрель 2026).
 * Активные слайды — в `./vibecoding/jsonSlides.ts`. Legacy (18 прошлых слайдов) —
 * в `./vibecoding/archive/`, не импортируется декой.
 *
 * Чтобы вернуть отдельный legacy-слайд в новую композицию:
 *   import { vibecodingLegacyJsonSlides } from './vibecoding/archive/legacyJsonSlides';
 *   slides: [...vibecodingJsonSlides, vibecodingLegacyJsonSlides[N]]
 */
export const vibecodingDeck: DeckDefinition = {
  id: 'vibecoding',
  title: 'Вайбкодинг',
  slides: vibecodingJsonSlides,
};
