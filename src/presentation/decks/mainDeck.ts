import type { DeckDefinition } from '../types';
import { DemoFoundationSlide } from '../slides/DemoFoundationSlide';
import { DemoSpotlightStackSlide } from '../slides/DemoSpotlightStackSlide';
import { DemoTriptychSlide } from '../slides/DemoTriptychSlide';
import { AgenticWorkflowSlide } from '../slides/AgenticWorkflowSlide';
import { ReferenceCountsSlide } from '../slides/ReferenceCountsSlide';
import { PlaceholderNanoBananaVersionsSlide } from '../slides/PlaceholderNanoBananaVersionsSlide';
import { PhotorealismSlide } from '../slides/PhotorealismSlide';
import { PhotorealismSlideCopy } from '../slides/PhotorealismSlideCopy';
import { LeoFluxVsGptSlide } from '../slides/LeoFluxVsGptSlide';
import { ThreeDRefsSlide } from '../slides/ThreeDRefsSlide';
import { CompositionSlide } from '../slides/CompositionSlide';
import { SpeakerChannelGridSlide } from '../slides/SpeakerChannelGridSlide';
import { GamepadStyleTransferSlide } from '../slides/GamepadStyleTransferSlide';
import { ToolsGrowthSlide } from '../slides/ToolsGrowthSlide';
import { Early2025Slide } from '../slides/Early2025Slide';
import { CombGripSlide } from '../slides/CombGripSlide';
import { StructuredPromptsSlide } from '../slides/StructuredPromptsSlide';
import { JsonPromptingDefinitionSlide } from '../slides/JsonPromptingDefinitionSlide';
import { PromptOrderFlexSlide } from '../slides/PromptOrderFlexSlide';
import { MinimalTitleMultiLinkSlide } from '../slides/MinimalTitleMultiLinkSlide';
import { WorkflowComparisonSlide } from '../slides/WorkflowComparisonSlide';
import { TextureWorkflowSlide } from '../slides/TextureWorkflowSlide';
import { ThankYouSlide } from '../slides/ThankYouSlide';
import { JsonSlideRenderer } from '../json-renderer/JsonSlideRenderer';
import { DEMO_JSON_SLIDE_IDS, MIGRATED_JSON_SLIDE_IDS } from '../jsonSlideDocumentRegistry';

export const mainDeck: DeckDefinition = {
  id: 'main',
  title: 'GEN AI 2026',
  slides: [
    {
      id: DEMO_JSON_SLIDE_IDS.heroJourneyBento,
      title: 'Демо: путь героя (bento)',
      theme: 'editorial',
      component: JsonSlideRenderer,
      hidden: true,
      notes:
        'JSON: bentoGrid 4×3 с разными span, slide-demo-hero-journey-bento.json; этапы мономифа Кэмпбелла сгруппированы в крупные, высокие, мини- и широкие ячейки.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.aboutMe,
      title: 'Евсеичев Антон',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes: 'Из 20Feb AboutMe: имя, роли, Floux.pro founder; без изображений.',
    },
    {
      id: 'foundation-demo',
      title: 'Система для будущих слайдов, а не одноразовый макет',
      theme: 'editorial',
      component: DemoFoundationSlide,
      hidden: true,
      notes: 'Эталонный слайд для будущей сборки deck из composable primitives.',
    },
    {
      id: 'triptych-demo',
      title: 'Три колонки — один ритм',
      theme: 'signal',
      component: DemoTriptychSlide,
      hidden: true,
      notes: 'Три равные колонки, фон mesh — другой ритм сетки относительно 7+5.',
    },
    {
      id: 'spotlight-stack-demo',
      title: 'Вертикальный протокол',
      theme: 'cinema',
      component: DemoSpotlightStackSlide,
      hidden: true,
      notes: 'Узкий центрированный столбик и SlideSection вместо боковой сетки.',
    },
    {
      id: DEMO_JSON_SLIDE_IDS.asymmetric,
      title: 'JSON renderer: неравные колонки',
      theme: 'editorial',
      component: JsonSlideRenderer,
      hidden: true,
      notes: 'MVP schema-driven slide: layout asymmetricColumns (7+5), данные в demo-grid-asymmetric.json.',
    },
    {
      id: DEMO_JSON_SLIDE_IDS.equal,
      title: 'JSON renderer: три равные колонки',
      theme: 'signal',
      component: JsonSlideRenderer,
      hidden: true,
      notes: 'MVP schema-driven slide: layout equalColumns (4+4+4), данные в demo-grid-equal.json.',
    },
    {
      id: DEMO_JSON_SLIDE_IDS.bento,
      title: 'JSON renderer: bento-сетка',
      theme: 'editorial',
      component: JsonSlideRenderer,
      hidden: true,
      notes: 'MVP schema-driven slide: layout bentoGrid 4×3, данные в demo-grid-bento.json.',
    },
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
    {
      id: MIGRATED_JSON_SLIDE_IDS.platformsEcosystem,
      title: 'Платформы и модели',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes:
        'JSON: bentoGrid 4×3, slide-platforms-ecosystem.json; leadingIcon + watermarkIcon через registry.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.higgsfield,
      title: 'Higgsfield',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes: 'JSON: mediaGallery 1 image, center header; slide-higgsfield.json.',
      preloadAssets: ['/images/higgsfield.png'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.nodeBasedSystems,
      title: 'Нодовые системы',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes: 'JSON: mediaGallery 3 images с captions, center header; slide-node-based-systems.json.',
      preloadAssets: ['/images/nodes/freepik.png', '/images/nodes/krea.png', '/images/nodes/weavy.png'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.flouxDemo,
      title: 'Floux.pro',
      theme: 'signal',
      component: JsonSlideRenderer,
      notes: 'JSON: mediaGallery 1 video, mesh backdrop, тема signal; slide-floux-demo.json.',
      preloadAssets: ['/flow.mp4'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.attentionModels2026,
      title: 'Что актуально сейчас',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes: 'JSON: uniformGrid 3 колонки × 6 карточек, slide-attention-models-2026.json; watermarkIcon.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.nanoBananaProCover,
      title: 'Nano Banana — flash, pro, v2',
      theme: 'signal',
      component: JsonSlideRenderer,
      notes: 'JSON template imageCover, slide-image-cover-nano-banana-pro.json; фон, рамка, rails, two-block display headline.',
      preloadAssets: ['/bg/banana.png'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.nanoBananaUseCases,
      title: 'Сценарии использования',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes:
        'JSON: bentoGrid 4×3, slide-nano-banana-use-cases.json; lucide icons через registry.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.midjourneyVsNanoBanana,
      title: 'Midjourney vs Nano Banana',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes: 'JSON: equalColumns 6+6, component tagList; slide-midjourney-vs-nano-banana.json.',
    },
    {
      id: 'agentic-workflow',
      title: 'Nano Banana Pro — как агент',
      theme: 'editorial',
      component: AgenticWorkflowSlide,
      notes: 'Из 20Feb AgenticWorkflow: три шага (думает → проверяет → рисует), lucide; без изображений.',
    },
    {
      id: 'nano-banana-versions',
      title: 'Nano Banana',
      theme: 'signal',
      component: PlaceholderNanoBananaVersionsSlide,
      notes: 'Из 20Feb NanoBananaComparisonSlide: Flash / Pro / 2, строки параметров в колонках без таблицы; Pro — акцентный Box.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.agenticWorkflowResult,
      title: 'Результат агента',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 3+9, quote + mediaGallery single; slide-agentic-workflow-result.json; spotlight + borderFrame.',
      preloadAssets: ['/images/stranger.jpg'],
    },
    {
      id: 'comb-grip',
      title: 'Держаться за гребень',
      theme: 'cinema',
      component: CombGripSlide,
      notes: 'Из 20Feb CombGrip: фон comb-surf, заголовок и роли «чуть чуть»; тема cinema, spotlight.',
      preloadAssets: ['/images/comb-surf.jpg'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.promptStructure,
      title: 'Структура промпта',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 4+8, accentGradient + indexedList слева, uniformGrid 2×2 ghost cards + headerBadge + tagList; slide-prompt-structure.json; spotlight + borderFrame.',
    },
    {
      id: 'prompt-order-flex',
      title: 'Формула не догма',
      theme: 'cinema',
      component: PromptOrderFlexSlide,
      notes:
        'Из 20Feb PromptOrderFlexSlide: два варианта одного промпта (A/B), вывод про полноту и приоритеты; без изображений.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.promptOrderPairImages,
      title: 'Промпт: порядок',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 3+9, quote + mediaGallery pair; slide-prompt-order-pair-images.json; spotlight dimmed + borderFrame.',
      preloadAssets: ['/images/prompt/001.png', '/images/prompt/002.png'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.proContradictions,
      title: 'про противоречия',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes: 'Чёрный минималистичный титул: одна строка по центру, без декора и мета.',
    },
    // Идея для следующего слайда: пример про отсутствие противоречий (девушка заказывает кофе).
    {
      id: MIGRATED_JSON_SLIDE_IDS.editingPromptStructure,
      title: 'Промпт на редактирование',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 4+8, accentGradient + indexedList слева, uniformGrid 2×1 ghost cards; slide-editing-prompt-structure.json; spotlight + borderFrame.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.editingPromptPrinciples,
      title: 'Промпт на изменение',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes: 'JSON: splitLayout 3+9, quote + mediaGallery pair; slide-editing-prompt-principles.json; grid backdrop.',
      preloadAssets: ['/images/editing/input.png', '/images/editing/output.png'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.styleCopyPromptPrinciples,
      title: 'Копирование стиля',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 3+9, quote + mediaGallery pair; slide-style-copy-prompt-principles.json; grid backdrop.',
      preloadAssets: ['/images/editing/ref.jpg', '/images/editing/input.png'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.styleCopyPromptPrinciplesCopy4,
      title: 'Копирование стиля',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 3+9, quote + mediaGallery pair; slide-style-copy-prompt-principles-copy-4.json; grid backdrop.',
      preloadAssets: ['/images/editing/var2.png', '/images/editing/var3.png'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.styleCopyPromptPrinciplesCopy2,
      title: 'Точечное редактирование',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 3+9, quote + mediaGallery pair; slide-style-copy-prompt-principles-copy-2.json; grid backdrop.',
      preloadAssets: ['/images/editing/wrong.png', '/images/editing/output.png'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.styleCopyPromptPrinciplesCopy3,
      title: 'Точечное редактирование',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 3+9, quote + mediaGallery pair; slide-style-copy-prompt-principles-copy-3.json; grid backdrop.',
      preloadAssets: ['/images/editing/inpainting.png', '/images/editing/result2.png'],
    },
    // Фотореалистичность
    // Мокапы
    // Точечное редактирование
    {
      id: MIGRATED_JSON_SLIDE_IDS.multiReferenceCover,
      title: 'Мульти референсность',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes: 'JSON imageCover, slide-image-cover-multi-reference.json; обложка riding.png, hero display headline.',
      preloadAssets: ['/images/riding.png'],
    },
    {
      id: 'reference-counts',
      title: 'Сколько референсов допускают модели',
      theme: 'cinema',
      component: ReferenceCountsSlide,
      notes: 'Из 20Feb ReferenceCounts: таблица лимитов; без сетки иконок слева.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.referenceRoles,
      title: 'Роли референсов',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 3+9 quote + nested split 4+8; stackLayout 3+9 pair+single fill + single result; slide-reference-roles.json.',
      preloadAssets: [
        '/images/multiref/Character.png',
        '/images/multiref/Horse.jpg',
        '/images/multiref/Clothes.jpg',
        '/images/multiref/result.jpg',
      ],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.leoWideShot,
      title: 'Фотореализм',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 3+9 quote + nested split 5+7; mediaGallery column fill refs/results; slide-leo-wide-shot.json.',
      preloadAssets: [
        '/images/leo/ref1.png',
        '/images/leo/ref2.jpg',
        '/images/leo/ref3.jpg',
        '/images/leo/result1.png',
        '/images/leo/result2.png',
      ],
    },
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
    {
      id: MIGRATED_JSON_SLIDE_IDS.referenceAnalysis,
      title: 'Анализ референса',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes: 'JSON: mediaGallery (2), caption + showCaption; slide-reference-analysis.json; face/001–002.',
      preloadAssets: ['/images/face/001.jpg', '/images/face/002.jpg'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.anglesLighting,
      title: 'Ракурс камеры и освещение',
      theme: 'signal',
      component: JsonSlideRenderer,
      notes: 'JSON: splitLayout 2+10, text region + mediaGallery pair; slide-angles-lighting.json; angles/001–002.',
      preloadAssets: ['/images/angles/001.png', '/images/angles/002.png'],
    },
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
    {
      id: MIGRATED_JSON_SLIDE_IDS.lessObviousUseCases,
      title: 'Ссылка на пример',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.photorealismModelPicks,
      title: 'Редактирование и перенос стиля',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes:
        'JSON: bentoGrid 12×2 (4+4+4 / 6+6), slide-photorealism-model-picks.json; только названия моделей снизу, watermark; Nano Banana accent.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.photorealismSectionTitle,
      title: 'Где Nano Banana не лучший выбор',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.grokImagineBento,
      title: 'Grok Imagine',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 5+7 + mediaGallery, slide-grok-imagine-bento.json; слева g1, справа 2+3 кадра; spotlight.',
      preloadAssets: [
        '/images/grok/g1.jpg',
        '/images/grok/g2.jpg',
        '/images/grok/g3.jpg',
        '/images/grok/g4.jpg',
        '/images/grok/g5.jpg',
        '/images/grok/g6.jpg',
      ],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.recraftV4Bento,
      title: 'Recraft V4',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 5+7, slide-recraft-v4-bento.json; слева 001, справа два ряда 2+2; spotlight.',
      preloadAssets: [
        '/images/recraft/001.jpg',
        '/images/recraft/002.jpg',
        '/images/recraft/003.jpg',
        '/images/recraft/004.jpg',
        '/images/recraft/005.jpg',
      ],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.midjorneyBento,
      title: 'Midjorney',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes:
        'JSON: splitLayout 5+7, slide-midjorney-bento.json; слева 001, справа 2+4; jpg+png; spotlight.',
      preloadAssets: [
        '/images/midjorney/001.jpg',
        '/images/midjorney/002.jpg',
        '/images/midjorney/003.jpg',
        '/images/midjorney/004.jpg',
        '/images/midjorney/005.png',
        '/images/midjorney/006.png',
        '/images/midjorney/007.png',
      ],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.nanoBananaConnection,
      title: 'Про связку с Nano Banana',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.lessObviousSectionTitle,
      title: 'Менее очевидные сценарии использования',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.texturingModelingCover,
      title: 'Текстурирование и моделинг',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes: 'JSON imageCover, slide-image-cover-texturing-modeling.json; creme, inverted rails, center rule, white display title.',
      preloadAssets: ['/images/creme.png'],
    },
    {
      id: 'texture-workflow',
      title: 'Texture workflow',
      theme: 'editorial',
      component: TextureWorkflowSlide,
      notes:
        'Из 20Feb TextureWorkflowSlide: промпт слева, справа 002 object-contain + 003 квадрат object-cover; декор ®©; grid.',
      preloadAssets: ['/images/workflow/002.png', '/images/workflow/003.png'],
    },
    {
      id: '3d-two-refs-two-outs',
      title: '3D',
      theme: 'editorial',
      component: ThreeDRefsSlide,
      notes: 'Как LeoWideShot: сетка 3+9; слева промпт; два референса в левой колонке сетки, два результата в правой; /images/3d/.',
      preloadAssets: [
        '/images/3d/ref1.png',
        '/images/3d/ref2.jpg',
        '/images/3d/out1.png',
        '/images/3d/out2.png',
      ],
    },
    {
      id: 'workflow-comparison',
      title: '3D воркфлоу',
      theme: 'cinema',
      component: WorkflowComparisonSlide,
      notes:
        'Из 20Feb WorkflowComparison: слева видео extra-v.mp4, справа два кадра extra1/extra2; cinema, spotlight.',
      preloadAssets: ['/images/workflow/extra-v.mp4', '/images/workflow/extra1.png', '/images/workflow/extra2.png'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.threeDWorkflowLink,
      title: 'Ссылка на пример',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
    },
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
    {
      id: MIGRATED_JSON_SLIDE_IDS.jsonPromptingCover,
      title: 'JSON промптинг',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes: 'JSON imageCover, slide-image-cover-json-prompting.json; /bg/bg2.png, triple top rail, displayTight headline.',
      preloadAssets: ['/bg/bg2.png'],
    },
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
      notes:
        'Из 20Feb StructuredPrompts: псевдо-окно редактора с примером JSON; переиспользуемый SlideCodeWindow.',
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.jsonImagesTriptych,
      title: 'JSON и изображения',
      theme: 'editorial',
      component: JsonSlideRenderer,
      notes:
        'JSON: equalColumns 4+4+4, stackLayout h2 + mediaGallery; slide-json-images-triptych.json; grid.',
      preloadAssets: ['/images/json/via_ref.png', '/images/json/001.png', '/images/composition/ref.jpg'],
    },
    {
      id: MIGRATED_JSON_SLIDE_IDS.compositionPhotoLink,
      title: 'Ссылка на пример',
      theme: 'cinema',
      component: JsonSlideRenderer,
      notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
    },
    {
      id: 'other-examples-floux-projects',
      title: 'Другие примеры',
      theme: 'cinema',
      component: MinimalTitleMultiLinkSlide,
      notes: 'Тот же минималистичный титул, несколько ссылок на проекты Floux.',
      links: [
        { href: 'https://app.floux.pro/w/sEdt6HD5IK4E', label: 'Примеры раз' },
        { href: 'https://app.floux.pro/w/hPhGWhUNgmgH', label: 'Примеры два' },
        { href: 'https://app.floux.pro/w/n8uIn8wki5HZ', label: 'Примеры три' },
      ],
    },
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

