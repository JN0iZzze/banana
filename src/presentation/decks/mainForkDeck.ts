import type { DeckDefinition } from '../types';
import { ReferenceCountsSlide } from '../slides/ReferenceCountsSlide';
import { PhotorealismSlide } from '../slides/PhotorealismSlide';
import { PhotorealismSlideCopy } from '../slides/PhotorealismSlideCopy';
import { CompositionSlide } from '../slides/CompositionSlide';
import { GamepadStyleTransferSlide } from '../slides/GamepadStyleTransferSlide';
import { Early2025Slide } from '../slides/Early2025Slide';
import { CombGripSlide } from '../slides/CombGripSlide';
import { StructuredPromptsSlide } from '../slides/StructuredPromptsSlide';
import { JsonPromptingDefinitionSlide } from '../slides/JsonPromptingDefinitionSlide';
import { ThankYouSlide } from '../slides/ThankYouSlide';
import { mainJsonSlides as base } from './main/jsonSlides';
import { mainForkJsonSlides as m } from './mainFork/jsonSlides';

export const mainForkDeck: DeckDefinition = {
  id: 'main-fork',
  title: 'Workshop Floux.pro',
  slides: [
    m.workshopIntro,
    base.aboutMe,
    base.flouxDemo,
    base.nodeBasedSystems,
    {
      id: 'early-2025-pastgen',
      title: 'Начало 2025',
      theme: 'cinema',
      component: Early2025Slide,
      notes: 'Из 20Feb Early2025: тема cinema как spotlight-demo; три компактные панели в ряд, водяной PastGen; без изображений.',
    },
    base.platformsEcosystem,
    m.flouxCapabilities,
    m.attentionModels2026,
    base.nanoBananaProCover,
    base.nanoBananaUseCases,
    base.midjourneyVsNanoBanana,
    base.nanoBananaVersions,
    base.agenticWorkflowResult,
    {
      id: 'comb-grip',
      title: 'Держаться за гребень',
      theme: 'cinema',
      component: CombGripSlide,
      notes: 'Из 20Feb CombGrip: фон comb-surf, заголовок и роли «чуть чуть»; тема cinema, spotlight.',
      preloadAssets: ['/images/comb-surf.jpg'],
    },
    base.promptStructure,
    base.promptOrderFlex,
    base.promptOrderPairImages,
    base.proContradictions,
    base.editingPromptStructure,
    base.editingPromptPrinciples,
    base.styleCopyPromptPrinciples,
    base.styleCopyPromptPrinciplesCopy4,
    base.styleCopyPromptPrinciplesCopy2,
    base.styleCopyPromptPrinciplesCopy3,
    base.multiReferenceCover,
    {
      id: 'reference-counts',
      title: 'Сколько референсов допускают модели',
      theme: 'cinema',
      component: ReferenceCountsSlide,
      notes: 'Из 20Feb ReferenceCounts: таблица лимитов; без сетки иконок слева.',
    },
    base.referenceRoles,
    base.leoWideShot,
    {
      id: 'photorealism-clothing',
      title: 'Перенос одежды',
      theme: 'editorial',
      component: PhotorealismSlide,
      notes: 'Как editing: сетка 3+9; слева промпт, справа колонка из двух референсов + результат.',
      preloadAssets: ['/images/fashion/person.png', '/images/fashion/ref.png', '/images/fashion/out.png'],
    },
    {
      id: 'composition-multi-ref',
      title: 'Композиция',
      theme: 'editorial',
      component: CompositionSlide,
      notes:
        'Бенто 2fr+3fr: слева верхний ряд из двух референсов, под ним ref; справа out на всю высоту.',
      preloadAssets: [
        '/images/composition/person.png',
        '/images/composition/person1.png',
        '/images/composition/ref.jpg',
        '/images/composition/out.png',
      ],
    },
    base.referenceAnalysis,
    base.anglesLighting,
    {
      id: 'gamepad-style-transfer',
      title: 'Перенос стиля',
      theme: 'editorial',
      component: GamepadStyleTransferSlide,
      notes:
        'Из 20Feb GamepadStyleTransferSlide: промпт слева; справа узкая колонка с маленьким референсом сверху и крупный квадратный результат.',
      preloadAssets: ['/images/yndx/ref.png', '/images/yndx/gampad.png'],
    },
    {
      id: 'photorealism-clothing-copy',
      title: 'Перенос одежды',
      theme: 'editorial',
      component: PhotorealismSlideCopy,
      notes: 'Как editing: сетка 3+9; слева промпт, справа колонка из двух референсов + результат.',
      preloadAssets: ['/images/fashion/person.png', '/images/fashion/ref.png', '/images/fashion/out.png'],
    },
    base.lessObviousUseCases,
    m.photorealismModelPicks,
    base.photorealismSectionTitle,
    base.grokImagineBento,
    base.recraftV4Bento,
    base.midjorneyBento,
    base.nanoBananaConnection,
    base.lessObviousSectionTitle,
    base.texturingModelingCover,
    base.textureWorkflow,
    base.threeDTwoRefsTwoOuts,
    base.workflowComparison,
    base.threeDWorkflowLink,
    base.jsonPromptingCover,
    {
      id: 'json-prompting-definition',
      title: 'Что такое JSON-промптинг',
      theme: 'cinema',
      component: JsonPromptingDefinitionSlide,
      notes:
        'Из 20Feb JsonPromptingDefinitionSlide: слева SlideCodeWindow prompt.json со скелетом полей, справа заголовок, лид и 2×2 кейса.',
    },
    {
      id: 'structured-prompt-json',
      title: 'Структурированный промпт',
      theme: 'cinema',
      component: StructuredPromptsSlide,
      notes: 'Из 20Feb StructuredPrompts: псевдо-окно редактора с примером JSON; переиспользуемый SlideCodeWindow.',
    },
    base.jsonImagesTriptych,
    base.compositionPhotoLink,
    base.otherExamplesFlouxProjects,
    {
      id: 'thank-you',
      title: 'Спасибо!',
      theme: 'cinema',
      component: ThankYouSlide,
      notes: 'Из 20Feb ThankYouSlide: /bg-intro.png, контакты, автор; финал дека.',
      preloadAssets: ['/bg-intro.png'],
    },
  ],
};
