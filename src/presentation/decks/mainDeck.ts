import type { DeckDefinition } from '../types';
import { ReferenceCountsSlide } from '../slides/ReferenceCountsSlide';
import { PhotorealismSlide } from '../slides/PhotorealismSlide';
import { PhotorealismSlideCopy } from '../slides/PhotorealismSlideCopy';
import { LeoFluxVsGptSlide } from '../slides/LeoFluxVsGptSlide';
import { CompositionSlide } from '../slides/CompositionSlide';
import { SpeakerChannelGridSlide } from '../slides/SpeakerChannelGridSlide';
import { GamepadStyleTransferSlide } from '../slides/GamepadStyleTransferSlide';
import { ToolsGrowthSlide } from '../slides/ToolsGrowthSlide';
import { Early2025Slide } from '../slides/Early2025Slide';
import { CombGripSlide } from '../slides/CombGripSlide';
import { StructuredPromptsSlide } from '../slides/StructuredPromptsSlide';
import { JsonPromptingDefinitionSlide } from '../slides/JsonPromptingDefinitionSlide';
import { ThankYouSlide } from '../slides/ThankYouSlide';
import { mainJsonSlides as m } from './main/jsonSlides';

export const mainDeck: DeckDefinition = {
  id: 'main',
  title: 'GEN AI 2026',
  slides: [
    m.heroJourneyBento,
    m.aboutMe,
    m.asymmetric,
    m.equal,
    m.bento,
    {
      id: 'tools-growth',
      title: 'Популярные ИИ-модели',
      theme: 'signal',
      component: ToolsGrowthSlide,
      notes: 'Горизонтальные бары: рост числа заметных инструментов по годам (анимация framer-motion).',
    },
    {
      id: 'early-2025-pastgen',
      title: 'Начало 2025',
      theme: 'cinema',
      component: Early2025Slide,
      notes: 'Из 20Feb Early2025: тема cinema как spotlight-demo; три компактные панели в ряд, водяной PastGen; без изображений.',
    },
    m.platformsEcosystem,
    m.higgsfield,
    m.nodeBasedSystems,
    m.flouxDemo,
    m.attentionModels2026,
    m.nanoBananaProCover,
    m.nanoBananaUseCases,
    m.midjourneyVsNanoBanana,
    m.agenticWorkflow,
    m.nanoBananaVersions,
    m.agenticWorkflowResult,
    {
      id: 'comb-grip',
      title: 'Держаться за гребень',
      theme: 'cinema',
      component: CombGripSlide,
      notes: 'Из 20Feb CombGrip: фон comb-surf, заголовок и роли «чуть чуть»; тема cinema, spotlight.',
      preloadAssets: ['/images/comb-surf.jpg'],
    },
    m.promptStructure,
    m.promptOrderFlex,
    m.promptOrderPairImages,
    m.proContradictions,
    // Идея для следующего слайда: пример про отсутствие противоречий (девушка заказывает кофе).
    m.editingPromptStructure,
    m.editingPromptPrinciples,
    m.styleCopyPromptPrinciples,
    m.styleCopyPromptPrinciplesCopy4,
    m.styleCopyPromptPrinciplesCopy2,
    m.styleCopyPromptPrinciplesCopy3,
    // Фотореалистичность
    // Мокапы
    // Точечное редактирование
    m.multiReferenceCover,
    {
      id: 'reference-counts',
      title: 'Сколько референсов допускают модели',
      theme: 'cinema',
      component: ReferenceCountsSlide,
      notes: 'Из 20Feb ReferenceCounts: таблица лимитов; без сетки иконок слева.',
    },
    m.referenceRoles,
    m.leoWideShot,
    {
      id: 'leo-flux-vs-gpt',
      title: 'Сравнение',
      theme: 'editorial',
      component: LeoFluxVsGptSlide,
      notes:
        'Как PromptOrderPairImagesSlide: spotlight, 3+9, SlideImagePair; два горизонтальных кадра 16∶9 — flux2.png, gpt_images.png.',
      preloadAssets: ['/images/leo/flux2.png', '/images/leo/gpt_images.png'],
    },
    // В Нано Банана мультиреференсность работает несколько иначе чем в других нейросетях
    // Как именно использовать референс (как стиль, композицию, ракурс)
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
    m.referenceAnalysis,
    m.anglesLighting,
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
    m.lessObviousUseCases,
    m.photorealismModelPicks,
    m.photorealismSectionTitle,
    m.grokImagineBento,
    m.recraftV4Bento,
    m.midjorneyBento,
    m.nanoBananaConnection,
    m.lessObviousSectionTitle,
    m.texturingModelingCover,
    m.textureWorkflow,
    m.threeDTwoRefsTwoOuts,
    m.workflowComparison,
    m.threeDWorkflowLink,
    {
      id: 'speaker-channel-grid',
      title: 'Макс Кукушкин',
      theme: 'editorial',
      component: SpeakerChannelGridSlide,
      notes:
        'Из 20Feb SpeakerChannelSlide (левая колонка: аватар, имя, роль, t.me) + Grid4Slide (2×2 /images/max/001–003 + 004.mp4).',
      preloadAssets: [
        '/images/max-tg.jpg',
        '/images/max/001.jpg',
        '/images/max/002.jpg',
        '/images/max/003.jpg',
        '/images/max/004.mp4',
      ],
    },
    // Пример на практике
    m.jsonPromptingCover,
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
    m.jsonImagesTriptych,
    m.compositionPhotoLink,
    m.otherExamplesFlouxProjects,
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
