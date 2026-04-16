import type { DeckDefinition } from '../types';
import { AboutMeSlide } from '../slides/AboutMeSlide';
import { DemoFoundationSlide } from '../slides/DemoFoundationSlide';
import { DemoSpotlightStackSlide } from '../slides/DemoSpotlightStackSlide';
import { DemoTriptychSlide } from '../slides/DemoTriptychSlide';
import { CameraAnglesSlide } from '../slides/CameraAnglesSlide';
import { ReferenceAnalysisSlide } from '../slides/ReferenceAnalysisSlide';
import { PlaceholderMidjourneyVsNanoBananaSlide } from '../slides/PlaceholderMidjourneyVsNanoBananaSlide';
import { AgenticWorkflowSlide } from '../slides/AgenticWorkflowSlide';
import { MultiReferenceCoverSlide } from '../slides/MultiReferenceCoverSlide';
import { ReferenceCountsSlide } from '../slides/ReferenceCountsSlide';
import { PlaceholderNanoBananaVersionsSlide } from '../slides/PlaceholderNanoBananaVersionsSlide';
import { NanoBananaUseCasesSlide } from '../slides/NanoBananaUseCasesSlide';
import { NanoBananaProSlide } from '../slides/NanoBananaProSlide';
import { EditingPromptPrinciplesSlide } from '../slides/EditingPromptPrinciplesSlide';
import { StyleCopyPromptPrinciplesSlide } from '../slides/StyleCopyPromptPrinciplesSlide';
import { StyleCopyPromptPrinciplesSlideCopy2 } from '../slides/StyleCopyPromptPrinciplesSlideCopy2';
import { StyleCopyPromptPrinciplesSlideCopy3 } from '../slides/StyleCopyPromptPrinciplesSlideCopy3';
import { StyleCopyPromptPrinciplesSlideCopy4 } from '../slides/StyleCopyPromptPrinciplesSlideCopy4';
import { PhotorealismSlide } from '../slides/PhotorealismSlide';
import { PhotorealismSlideCopy } from '../slides/PhotorealismSlideCopy';
import { LeoWideShotSlide } from '../slides/LeoWideShotSlide';
import { LeoFluxVsGptSlide } from '../slides/LeoFluxVsGptSlide';
import { ThreeDRefsSlide } from '../slides/ThreeDRefsSlide';
import { CompositionSlide } from '../slides/CompositionSlide';
import { RecraftV4BentoSlide } from '../slides/RecraftV4BentoSlide';
import { ReferenceRolesSlide } from '../slides/ReferenceRolesSlide';
import { SpeakerChannelGridSlide } from '../slides/SpeakerChannelGridSlide';
import { GamepadStyleTransferSlide } from '../slides/GamepadStyleTransferSlide';
import { GrokImagineBentoSlide } from '../slides/GrokImagineBentoSlide';
import { ToolsGrowthSlide } from '../slides/ToolsGrowthSlide';
import { AttentionModels2026Slide } from '../slides/AttentionModels2026Slide';
import { PhotorealismPipelineModelsSlide } from '../slides/PhotorealismPipelineModelsSlide';
import { PlatformsEcosystemBentoSlide } from '../slides/PlatformsEcosystemBentoSlide';
import { Early2025Slide } from '../slides/Early2025Slide';
import { AgenticWorkflowResultSlide } from '../slides/AgenticWorkflowResultSlide';
import { CombGripSlide } from '../slides/CombGripSlide';
import { PromptStructureSlide } from '../slides/PromptStructureSlide';
import { StructuredPromptsSlide } from '../slides/StructuredPromptsSlide';
import { JsonPromptingCoverSlide } from '../slides/JsonPromptingCoverSlide';
import { JsonPromptingDefinitionSlide } from '../slides/JsonPromptingDefinitionSlide';
import { JsonImagesSlide } from '../slides/JsonImagesSlide';
import { PromptOrderFlexSlide } from '../slides/PromptOrderFlexSlide';
import { PromptOrderPairImagesSlide } from '../slides/PromptOrderPairImagesSlide';
import { MinimalTitleSlide } from '../slides/MinimalTitleSlide';
import { MidjorneyBentoSlide } from '../slides/MidjorneyBentoSlide';
import { EditingPromptStructureSlide } from '../slides/EditingPromptStructureSlide';
import { NodeBasedSlide } from '../slides/NodeBasedSlide';
import { FlouxDemoSlide } from '../slides/FlouxDemoSlide';
import { WorkflowComparisonSlide } from '../slides/WorkflowComparisonSlide';
import { TextureWorkflowSlide } from '../slides/TextureWorkflowSlide';
import { TexturingModelingCoverSlide } from '../slides/TexturingModelingCoverSlide';
import { HiggsfieldSlide } from '../slides/HiggsfieldSlide';
import { ThankYouSlide } from '../slides/ThankYouSlide';

export const mainDeck: DeckDefinition = {
  id: 'main',
  title: 'NewGen Presentation Base',
  slides: [
    {
      id: 'about-me',
      title: 'Обо мне',
      theme: 'editorial',
      component: AboutMeSlide,
      notes: 'Из 20Feb AboutMe: имя, роли, Floux.pro founder; без изображений.',
    },
    {
      id: 'foundation-demo',
      title: 'Foundation Demo',
      theme: 'editorial',
      component: DemoFoundationSlide,
      hidden: true,
      notes: 'Эталонный слайд для будущей сборки deck из composable primitives.',
    },
    {
      id: 'triptych-demo',
      title: 'Triptych 4+4+4',
      theme: 'signal',
      component: DemoTriptychSlide,
      hidden: true,
      notes: 'Три равные колонки, фон mesh — другой ритм сетки относительно 7+5.',
    },
    {
      id: 'spotlight-stack-demo',
      title: 'Spotlight stack',
      theme: 'cinema',
      component: DemoSpotlightStackSlide,
      hidden: true,
      notes: 'Узкий центрированный столбик и SlideSection вместо боковой сетки.',
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
      title: 'Начало 2025 (PastGen)',
      theme: 'cinema',
      component: Early2025Slide,
      notes: 'Из 20Feb Early2025: тема cinema как spotlight-demo; три компактные панели в ряд, водяной PastGen; без изображений.',
    },
    {
      id: 'platforms-ecosystem-bento',
      title: 'Платформы и модели (бенто)',
      theme: 'editorial',
      component: PlatformsEcosystemBentoSlide,
      notes:
        'Сетка 4×3 из 20Feb BigFour: три высоких столбца + колонка из двух компактных + нижний ряд из четырёх; @lobehub/icons и lucide; без статики из public.',
    },
    {
      id: 'higgsfield',
      title: 'Higgsfield',
      theme: 'editorial',
      component: HiggsfieldSlide,
      notes: 'Из 20Feb HiigsfieldSlide: один скриншот; как NodeBasedSlide, одна колонка на всю ширину.',
      preloadAssets: ['/images/higgsfield.png'],
    },
    {
      id: 'node-based-systems',
      title: 'Нодовые системы',
      theme: 'editorial',
      component: NodeBasedSlide,
      notes: 'Из 20Feb NodeBasedSlide: три скриншота nodes; сетка 4+4+4, SlideAssetImage.',
      preloadAssets: ['/images/nodes/freepik.png', '/images/nodes/krea.png', '/images/nodes/weavy.png'],
    },
    {
      id: 'floux-demo',
      title: 'Демо Floux.pro',
      theme: 'signal',
      component: FlouxDemoSlide,
      notes: 'Из 20Feb FlouxDemoSlide: тема signal (синий), mesh backdrop; заголовок + видео /flow.mp4 (object-contain).',
      preloadAssets: ['/flow.mp4'],
    },
    {
      id: 'attention-models-2026',
      title: 'Что актуально сейчас',
      theme: 'editorial',
      component: AttentionModels2026Slide,
      notes: 'Как foundation: grid backdrop, сетка 3×2 карточек (gap sm); иконки @lobehub/icons; первая карточка — акцент.',
    },
    {
      id: 'nano-banana-pro',
      title: 'Nano Banana Pro',
      theme: 'signal',
      component: NanoBananaProSlide,
      notes: 'Фон /bg/banana.png, градиент вниз розовый, заголовок по центру.',
      preloadAssets: ['/bg/banana.png'],
    },
    {
      id: 'nano-banana-use-cases',
      title: 'Nano Banana — сценарии использования',
      theme: 'editorial',
      component: NanoBananaUseCasesSlide,
      notes:
        'Бенто 4×3 как platforms-ecosystem: три высоких + шесть компактных; кейсы NB + коллажи и соцкреативы; grid, Box accent/standard.',
    },
    {
      id: 'midjourney-vs-nano-banana',
      title: 'Midjourney vs Nano Banana',
      theme: 'editorial',
      component: PlaceholderMidjourneyVsNanoBananaSlide,
      notes: 'Заглушка: сравнение двух инструментов, сетка 6+6.',
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
      title: 'Версии Nano Banana (Flash / Pro / 2)',
      theme: 'signal',
      component: PlaceholderNanoBananaVersionsSlide,
      notes: 'Из 20Feb NanoBananaComparisonSlide: Flash / Pro / 2, строки параметров в колонках без таблицы; Pro — акцентный Box.',
    },
    {
      id: 'agentic-workflow-result',
      title: 'Результат агента',
      theme: 'cinema',
      component: AgenticWorkflowResultSlide,
      notes: 'Из 20Feb AgenticWorkflowResult: промпт слева, инфографика Stranger Things справа; тема cinema.',
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
      id: 'prompt-structure',
      title: 'Структура промпта',
      theme: 'cinema',
      component: PromptStructureSlide,
      notes: 'Чёрный фон, сетка 2×2: Что / Где / В каком стиле / Как снято; цветные шапки и тёмные списки.',
    },
    {
      id: 'prompt-order-flex',
      title: 'Промпт: порядок не догма',
      theme: 'cinema',
      component: PromptOrderFlexSlide,
      notes:
        'Из 20Feb PromptOrderFlexSlide: два варианта одного промпта (A/B), вывод про полноту и приоритеты; без изображений.',
    },
    {
      id: 'prompt-order-pair-images',
      title: 'Промпт: порядок — кадры',
      theme: 'cinema',
      component: PromptOrderPairImagesSlide,
      notes: 'Продолжение prompt-order-flex: сетка как у editing-prompt-principles, два рендера /images/prompt/001.png и 002.png.',
      preloadAssets: ['/images/prompt/001.png', '/images/prompt/002.png'],
    },
    {
      id: 'pro-contradictions',
      title: 'про противоречия',
      theme: 'cinema',
      component: MinimalTitleSlide,
      notes: 'Чёрный минималистичный титул: одна строка по центру, без декора и мета.',
    },
    // Идея для следующего слайда: пример про отсутствие противоречий (девушка заказывает кофе).
    {
      id: 'editing-prompt-structure',
      title: 'Промпт на редактирование (структура)',
      theme: 'cinema',
      component: EditingPromptStructureSlide,
      notes: 'Как prompt-structure, но 2 колонки: что правим / что сохраняем; слева акцентный блок Edit prompt.',
    },
    {
      id: 'editing-prompt-principles',
      title: 'Промпт на изменение',
      theme: 'editorial',
      component: EditingPromptPrinciplesSlide,
      notes: 'Промпт слева, input/output справа; декор ®©.',
      preloadAssets: ['/images/editing/input.png', '/images/editing/output.png'],
    },
    {
      id: 'style-copy-prompt-principles',
      title: 'Копирование стиля',
      theme: 'editorial',
      component: StyleCopyPromptPrinciplesSlide,
      notes: 'Как editing-prompt-principles: промпт слева, input/output справа.',
      preloadAssets: ['/images/editing/input.png', '/images/editing/output.png'],
    },
    {
      id: 'style-copy-prompt-principles-copy-4',
      title: 'Копирование стиля — слайд 4',
      theme: 'editorial',
      component: StyleCopyPromptPrinciplesSlideCopy4,
      notes: 'Копия layout style-copy; править текст и пути картинок в компоненте Copy4.',
      preloadAssets: ['/images/editing/ref.jpg', '/images/editing/input.png'],
    },
    {
      id: 'style-copy-prompt-principles-copy-2',
      title: 'Копирование стиля — слайд 2',
      theme: 'editorial',
      component: StyleCopyPromptPrinciplesSlideCopy2,
      notes: 'Копия layout style-copy; править текст и пути картинок в компоненте Copy2.',
      preloadAssets: ['/images/editing/input.png', '/images/editing/output.png'],
    },
    {
      id: 'style-copy-prompt-principles-copy-3',
      title: 'Копирование стиля — слайд 3',
      theme: 'editorial',
      component: StyleCopyPromptPrinciplesSlideCopy3,
      notes: 'Копия layout style-copy; править текст и пути картинок в компоненте Copy3.',
      preloadAssets: ['/images/editing/input.png', '/images/editing/output.png'],
    },
    // Фотореалистичность
    // Мокапы
    // Точечное редактирование
    {
      id: 'multi-reference',
      title: 'Мультиреференсность',
      theme: 'cinema',
      component: MultiReferenceCoverSlide,
      notes: 'Обложка: riding.png, типографика как в 20Feb MultireferenceCover.',
      preloadAssets: ['/images/riding.png'],
    },
    {
      id: 'reference-counts',
      title: 'Лимиты референсов по моделям',
      theme: 'cinema',
      component: ReferenceCountsSlide,
      notes: 'Из 20Feb ReferenceCounts: таблица лимитов; без сетки иконок слева.',
    },
    {
      id: 'reference-roles',
      title: 'Роли референсов',
      theme: 'editorial',
      component: ReferenceRolesSlide,
      notes:
        'Из 20Feb ReferenceRolesSlide: тот же бенто-layout, что CompositionSlide; Character/Horse/Clothes + result в /images/multiref/.',
      preloadAssets: [
        '/images/multiref/Character.png',
        '/images/multiref/Horse.jpg',
        '/images/multiref/Clothes.jpg',
        '/images/multiref/result.jpg',
      ],
    },
    {
      id: 'leo-wide-shot',
      title: 'Широкий план (Leo)',
      theme: 'editorial',
      component: LeoWideShotSlide,
      notes:
        'Промпт 3 колонки; слева три референса 16∶9; справа два результата 16∶9; у всех явный aspect-ratio.',
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
      title: 'Сравнение: Flux 2 и GPT Images',
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
      title: 'Композиция (мультиреференс)',
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
      id: 'reference-analysis',
      title: 'Анализ референсов',
      theme: 'editorial',
      component: ReferenceAnalysisSlide,
      notes: 'Два референса face/001–002, сравнение в колонках 6+6.',
      preloadAssets: ['/images/face/001.jpg', '/images/face/002.jpg'],
    },
    {
      id: 'angles-lighting',
      title: 'Особенности: углы, ракурсы, освещение',
      theme: 'signal',
      component: CameraAnglesSlide,
      notes: 'Ракурсы и освещение: два референс-изображения, декор comb.png.',
      preloadAssets: ['/images/angles/001.png', '/images/angles/002.png', '/comb.png'],
    },
    {
      id: 'gamepad-style-transfer',
      title: 'Перенос стиля (геймпад)',
      theme: 'editorial',
      component: GamepadStyleTransferSlide,
      notes:
        'Из 20Feb GamepadStyleTransferSlide: промпт слева; справа узкая колонка с маленьким референсом сверху и крупный квадратный результат.',
      preloadAssets: ['/images/yndx/ref.png', '/images/yndx/gampad.png'],
    },
    {
      id: 'photorealism-clothing-copy',
      title: 'Перенос стиля',
      theme: 'editorial',
      component: PhotorealismSlideCopy,
      notes: 'Как editing: сетка 3+9; слева промпт, справа колонка из двух референсов + результат.',
      preloadAssets: ['/images/fashion/person.png', '/images/fashion/ref.png', '/images/fashion/out.png'],
    },
    {
      id: 'pro-contradictions',
      title: 'Пример на практике с переносом стиля',
      theme: 'cinema',
      component: MinimalTitleSlide,
      notes: 'Чёрный минималистичный титул: одна строка по центру, без декора и мета.',
    },
    {
      id: 'photorealism-model-picks',
      title: 'Редактирование и перенос стиля',
      theme: 'editorial',
      component: PhotorealismPipelineModelsSlide,
      notes:
        'Как attention-models-2026: grid, пять карточек 3+2, только названия моделей; заголовок в карточке снизу; Nano Banana с акцентом.',
    },
    {
      id: 'photorealism-section-title',
      title: 'Где Nano Banana не лучший выбор',
      theme: 'cinema',
      component: MinimalTitleSlide,
      notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
    },
    {
      id: 'grok-imagine-bento',
      title: 'Grok Imagine',
      theme: 'cinema',
      component: GrokImagineBentoSlide,
      notes: 'Бенто-сетка из шести кадров /images/grok/g1.jpg … g6.jpg; spotlight как у cinema.',
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
      id: 'recraft-v4-bento',
      title: 'Recraft V4',
      theme: 'cinema',
      component: RecraftV4BentoSlide,
      notes: 'Как Grok Imagine bento: слева квадрат 001, справа два ряда 2+2 из /images/recraft/002…005.',
      preloadAssets: [
        '/images/recraft/001.jpg',
        '/images/recraft/002.jpg',
        '/images/recraft/003.jpg',
        '/images/recraft/004.jpg',
        '/images/recraft/005.jpg',
      ],
    },
    {
      id: 'midjorney-bento',
      title: 'Midjorney',
      theme: 'cinema',
      component: MidjorneyBentoSlide,
      notes: 'Как bento Grok/Recraft: слева 001, справа 2+4 из /images/midjorney (jpg+png); заголовок Midjorney.',
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
      id: 'less-obvious-use-cases',
      title: 'Про связку с Nano Banana',
      theme: 'cinema',
      component: MinimalTitleSlide,
      notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
    },
    {
      id: 'less-obvious-use-cases',
      title: 'Менее очевидные сценарии использования',
      theme: 'cinema',
      component: MinimalTitleSlide,
      notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
    },
    {
      id: 'texturing-modeling-cover',
      title: 'Текстурирование и моделинг',
      theme: 'cinema',
      component: TexturingModelingCoverSlide,
      notes: 'Обложка из 20Feb TexturingModeling: фон /images/creme.png, верх/низ мета, розовый display-заголовок.',
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
      title: '3D: два референса → два результата',
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
      title: '3D workflow',
      theme: 'cinema',
      component: WorkflowComparisonSlide,
      notes:
        'Из 20Feb WorkflowComparison: слева видео extra-v.mp4, справа два кадра extra1/extra2; cinema, spotlight.',
      preloadAssets: ['/images/workflow/extra-v.mp4', '/images/workflow/extra1.png', '/images/workflow/extra2.png'],
    },
    {
      id: 'less-obvious-use-cases',
      title: 'Пример на практике',
      theme: 'cinema',
      component: MinimalTitleSlide,
      notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
    },
    {
      id: 'speaker-channel-grid',
      title: 'Спикер и сетка работ',
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
      id: 'json-prompting-cover',
      title: 'JSON-промптинг',
      theme: 'cinema',
      component: JsonPromptingCoverSlide,
      notes: 'Обложка из 20Feb JsonPrompting: /bg/bg2.png, верх/низ мета как в оригинале.',
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
      title: 'Структурированный промпт (JSON)',
      theme: 'cinema',
      component: StructuredPromptsSlide,
      notes:
        'Из 20Feb StructuredPrompts: псевдо-окно редактора с примером JSON; переиспользуемый SlideCodeWindow.',
    },
    {
      id: 'json-images-triptych',
      title: 'JSON — три изображения',
      theme: 'editorial',
      component: JsonImagesSlide,
      notes:
        'Из 20Feb JsonImagesSlide: три колонки, равный gap; у каждого кадра свой заголовок (JSON_IMAGE_PANELS.title); без VS.',
      preloadAssets: ['/images/json/001.jpg', '/images/json/002.jpg', '/images/composition/ref.jpg'],
    },
    {
      id: 'less-obvious-use-cases',
      title: 'Другие примеры',
      theme: 'cinema',
      component: MinimalTitleSlide,
      notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
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

