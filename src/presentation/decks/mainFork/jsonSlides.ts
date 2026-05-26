import { defineJsonSlide } from '../defineJsonSlide';
import { MAIN_FORK_SLIDE_IDS } from '../mainForkSlideIds';
import rawWorkshopIntro from './schemas/slide-workshop-floux-intro.json';
import rawFlouxCapabilities from './schemas/slide-floux-capabilities.json';
import rawAttentionModels from './schemas/slide-attention-models-2026.json';
import rawPhotorealismModelPicks from './schemas/slide-photorealism-model-picks.json';

const sid = MAIN_FORK_SLIDE_IDS;

export const mainForkJsonSlides = {
  workshopIntro: defineJsonSlide({
    id: sid.workshopIntro,
    title: 'Воркшоп Floux.pro',
    theme: 'cinema',
    raw: rawWorkshopIntro,
    source: 'slide-workshop-floux-intro.json',
    notes: 'Титульный текстовый слайд форка main-деки для воркшопа Floux.pro.',
  }),
  flouxCapabilities: defineJsonSlide({
    id: sid.flouxCapabilities,
    title: 'Возможности Floux.pro',
    theme: 'cinema',
    raw: rawFlouxCapabilities,
    source: 'slide-floux-capabilities.json',
    notes: 'JSON textStack: секционный заголовок после platforms-ecosystem; cinema, backdrop none + borderFrame.',
  }),
  attentionModels2026: defineJsonSlide({
    id: sid.attentionModels2026,
    title: 'Что актуально сейчас',
    theme: 'editorial',
    raw: rawAttentionModels,
    source: 'slide-attention-models-2026.json',
    notes:
      'JSON: bentoGrid 4×3, две доминантные 2×2 карточки (Nano Banana Pro v2, GPT Image 2) + четыре compact 1×1; fork-версия attention-models.',
  }),
  photorealismModelPicks: defineJsonSlide({
    id: sid.photorealismModelPicks,
    title: 'Редактирование и перенос стиля',
    theme: 'editorial',
    raw: rawPhotorealismModelPicks,
    source: 'slide-photorealism-model-picks.json',
    notes:
      'JSON: bentoGrid 4×3, две доминантные 2×2 (Nano Banana Pro v2, GPT Image 2.0) + три compact 1×1; fork-версия photorealism-model-picks.',
  }),
};

export type MainForkJsonSlideKey = keyof typeof mainForkJsonSlides;
