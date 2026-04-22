import type { DeckDefinition } from '../types';
import { JsonSlideRenderer } from '../json-renderer/JsonSlideRenderer';
import { VIBECODING_DECK_SLIDE_IDS } from './vibecodingSlideIds';

export const vibecodingDeck: DeckDefinition = {
  id: 'vibecoding',
  title: 'Вайбкодинг',
  defaultSlideId: VIBECODING_DECK_SLIDE_IDS.demo,
  slides: [
    {
      id: VIBECODING_DECK_SLIDE_IDS.demo,
      title: 'Демо: старт',
      theme: 'signal',
      component: JsonSlideRenderer,
      notes: 'JSON: textStack, slide-vibecoding-demo.json; заготовка отдельной презентации.',
    },
  ],
};
