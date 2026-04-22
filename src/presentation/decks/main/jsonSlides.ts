import { defineJsonSlide } from '../defineJsonSlide';
import { DEMO_JSON_SLIDE_IDS, MIGRATED_JSON_SLIDE_IDS } from '../mainSlideIds';
import rawAsymmetric from './schemas/demo-grid-asymmetric.json';
import rawBento from './schemas/demo-grid-bento.json';
import rawEqual from './schemas/demo-grid-equal.json';
import rawHeroJourneyBento from './schemas/slide-demo-hero-journey-bento.json';
import rawPromptStructure from './schemas/slide-prompt-structure.json';
import rawAboutMe from './schemas/slide-about-me.json';
import rawAttentionModels from './schemas/slide-attention-models-2026.json';
import rawNanoBananaUseCases from './schemas/slide-nano-banana-use-cases.json';
import rawMidjourneyVsNanoBanana from './schemas/slide-midjourney-vs-nano-banana.json';
import rawPlatformsEcosystem from './schemas/slide-platforms-ecosystem.json';
import rawEditingPromptStructure from './schemas/slide-editing-prompt-structure.json';
import rawHiggsfield from './schemas/slide-higgsfield.json';
import rawNodeBasedSystems from './schemas/slide-node-based-systems.json';
import rawFlouxDemo from './schemas/slide-floux-demo.json';
import rawAgenticWorkflow from './schemas/slide-agentic-workflow.json';
import rawAgenticWorkflowResult from './schemas/slide-agentic-workflow-result.json';
import rawPromptOrderPairImages from './schemas/slide-prompt-order-pair-images.json';
import rawEditingPromptPrinciples from './schemas/slide-editing-prompt-principles.json';
import rawReferenceRoles from './schemas/slide-reference-roles.json';
import rawLeoWideShot from './schemas/slide-leo-wide-shot.json';
import rawStyleCopyPromptPrinciples from './schemas/slide-style-copy-prompt-principles.json';
import rawStyleCopyPromptPrinciplesCopy2 from './schemas/slide-style-copy-prompt-principles-copy-2.json';
import rawStyleCopyPromptPrinciplesCopy3 from './schemas/slide-style-copy-prompt-principles-copy-3.json';
import rawStyleCopyPromptPrinciplesCopy4 from './schemas/slide-style-copy-prompt-principles-copy-4.json';
import rawImageCoverNanoBananaPro from './schemas/slide-image-cover-nano-banana-pro.json';
import rawImageCoverMultiReference from './schemas/slide-image-cover-multi-reference.json';
import rawImageCoverTexturingModeling from './schemas/slide-image-cover-texturing-modeling.json';
import rawImageCoverJsonPrompting from './schemas/slide-image-cover-json-prompting.json';
import rawReferenceAnalysis from './schemas/slide-reference-analysis.json';
import rawAnglesLighting from './schemas/slide-angles-lighting.json';
import rawPhotorealismModelPicks from './schemas/slide-photorealism-model-picks.json';
import rawProContradictions from './schemas/slide-pro-contradictions.json';
import rawLessObviousUseCases from './schemas/slide-less-obvious-use-cases.json';
import rawPhotorealismSectionTitle from './schemas/slide-photorealism-section-title.json';
import rawNanoBananaConnection from './schemas/slide-nano-banana-connection.json';
import rawLessObviousSectionTitle from './schemas/slide-less-obvious-section-title.json';
import rawThreeDWorkflowLink from './schemas/slide-three-d-workflow-link.json';
import rawCompositionPhotoLink from './schemas/slide-composition-photo-link.json';
import rawGrokImagineBento from './schemas/slide-grok-imagine-bento.json';
import rawRecraftV4Bento from './schemas/slide-recraft-v4-bento.json';
import rawMidjorneyBento from './schemas/slide-midjorney-bento.json';
import rawJsonImagesTriptych from './schemas/slide-json-images-triptych.json';
import rawTextureWorkflow from './schemas/slide-texture-workflow.json';
import rawThreeDTwoRefsTwoOuts from './schemas/slide-3d-two-refs-two-outs.json';
import rawWorkflowComparison from './schemas/slide-workflow-comparison.json';
import rawOtherExamplesFlouxProjects from './schemas/slide-other-examples-floux-projects.json';
import rawPromptOrderFlex from './schemas/slide-prompt-order-flex.json';
import rawNanoBananaVersions from './schemas/slide-nano-banana-versions.json';

const D = DEMO_JSON_SLIDE_IDS;
const M = MIGRATED_JSON_SLIDE_IDS;

export const mainJsonSlides = {
  heroJourneyBento: defineJsonSlide({
    id: D.heroJourneyBento,
    title: 'Демо: путь героя (bento)',
    theme: 'editorial',
    raw: rawHeroJourneyBento,
    source: 'slide-demo-hero-journey-bento.json',
    hidden: true,
    notes:
      'JSON: bentoGrid 4×3 с разными span, slide-demo-hero-journey-bento.json; этапы мономифа Кэмпбелла сгруппированы в крупные, высокие, мини- и широкие ячейки.',
  }),
  aboutMe: defineJsonSlide({
    id: M.aboutMe,
    title: 'Евсеичев Антон',
    theme: 'editorial',
    raw: rawAboutMe,
    source: 'slide-about-me.json',
    notes: 'Из 20Feb AboutMe: имя, роли, Floux.pro founder; без изображений.',
  }),
  asymmetric: defineJsonSlide({
    id: D.asymmetric,
    title: 'JSON renderer: неравные колонки',
    theme: 'editorial',
    raw: rawAsymmetric,
    source: 'demo-grid-asymmetric.json',
    hidden: true,
    notes: 'MVP schema-driven slide: layout asymmetricColumns (7+5), данные в demo-grid-asymmetric.json.',
  }),
  equal: defineJsonSlide({
    id: D.equal,
    title: 'JSON renderer: три равные колонки',
    theme: 'signal',
    raw: rawEqual,
    source: 'demo-grid-equal.json',
    hidden: true,
    notes: 'MVP schema-driven slide: layout equalColumns (4+4+4), данные в demo-grid-equal.json.',
  }),
  bento: defineJsonSlide({
    id: D.bento,
    title: 'JSON renderer: bento-сетка',
    theme: 'editorial',
    raw: rawBento,
    source: 'demo-grid-bento.json',
    hidden: true,
    notes: 'MVP schema-driven slide: layout bentoGrid 4×3, данные в demo-grid-bento.json.',
  }),
  platformsEcosystem: defineJsonSlide({
    id: M.platformsEcosystem,
    title: 'Платформы и модели',
    theme: 'editorial',
    raw: rawPlatformsEcosystem,
    source: 'slide-platforms-ecosystem.json',
    notes: 'JSON: bentoGrid 4×3, slide-platforms-ecosystem.json; leadingIcon + watermarkIcon через registry.',
  }),
  higgsfield: defineJsonSlide({
    id: M.higgsfield,
    title: 'Higgsfield',
    theme: 'editorial',
    raw: rawHiggsfield,
    source: 'slide-higgsfield.json',
    notes: 'JSON: mediaGallery 1 image, center header; slide-higgsfield.json.',
    preloadAssets: ['/images/higgsfield.png'],
  }),
  nodeBasedSystems: defineJsonSlide({
    id: M.nodeBasedSystems,
    title: 'Нодовые системы',
    theme: 'editorial',
    raw: rawNodeBasedSystems,
    source: 'slide-node-based-systems.json',
    notes: 'JSON: mediaGallery 3 images с captions, center header; slide-node-based-systems.json.',
    preloadAssets: ['/images/nodes/freepik.png', '/images/nodes/krea.png', '/images/nodes/weavy.png'],
  }),
  flouxDemo: defineJsonSlide({
    id: M.flouxDemo,
    title: 'Floux.pro',
    theme: 'signal',
    raw: rawFlouxDemo,
    source: 'slide-floux-demo.json',
    notes: 'JSON: mediaGallery 1 video, mesh backdrop, тема signal; slide-floux-demo.json.',
    preloadAssets: ['/flow.mp4'],
  }),
  attentionModels2026: defineJsonSlide({
    id: M.attentionModels2026,
    title: 'Что актуально сейчас',
    theme: 'editorial',
    raw: rawAttentionModels,
    source: 'slide-attention-models-2026.json',
    notes: 'JSON: uniformGrid 3 колонки × 6 карточек, slide-attention-models-2026.json; watermarkIcon.',
  }),
  nanoBananaProCover: defineJsonSlide({
    id: M.nanoBananaProCover,
    title: 'Nano Banana — flash, pro, v2',
    theme: 'signal',
    raw: rawImageCoverNanoBananaPro,
    source: 'slide-image-cover-nano-banana-pro.json',
    notes: 'JSON template imageCover, slide-image-cover-nano-banana-pro.json; фон, рамка, rails, two-block display headline.',
    preloadAssets: ['/bg/banana.png'],
  }),
  nanoBananaUseCases: defineJsonSlide({
    id: M.nanoBananaUseCases,
    title: 'Сценарии использования',
    theme: 'editorial',
    raw: rawNanoBananaUseCases,
    source: 'slide-nano-banana-use-cases.json',
    notes: 'JSON: bentoGrid 4×3, slide-nano-banana-use-cases.json; lucide icons через registry.',
  }),
  midjourneyVsNanoBanana: defineJsonSlide({
    id: M.midjourneyVsNanoBanana,
    title: 'Midjourney vs Nano Banana',
    theme: 'editorial',
    raw: rawMidjourneyVsNanoBanana,
    source: 'slide-midjourney-vs-nano-banana.json',
    notes: 'JSON: equalColumns 6+6, component tagList; slide-midjourney-vs-nano-banana.json.',
  }),
  agenticWorkflow: defineJsonSlide({
    id: M.agenticWorkflow,
    title: 'Nano Banana Pro — как агент',
    theme: 'editorial',
    raw: rawAgenticWorkflow,
    source: 'slide-agentic-workflow.json',
    notes:
      'JSON: equalColumns 4+4+4, три карточки с headerBadge 01–03, leadingIcon (workflow / bar-chart-3 / layers), без стрелок; slide-agentic-workflow.json.',
  }),
  nanoBananaVersions: defineJsonSlide({
    id: M.nanoBananaVersions,
    title: 'Nano Banana',
    theme: 'signal',
    raw: rawNanoBananaVersions,
    source: 'slide-nano-banana-versions.json',
    notes: 'JSON: equalColumns 4+4+4, featureList component item (icon+label+value rows с dividers); Pro — accent card; slide-nano-banana-versions.json.',
  }),
  agenticWorkflowResult: defineJsonSlide({
    id: M.agenticWorkflowResult,
    title: 'Результат агента',
    theme: 'cinema',
    raw: rawAgenticWorkflowResult,
    source: 'slide-agentic-workflow-result.json',
    notes:
      'JSON: splitLayout 3+9, quote + mediaGallery single; slide-agentic-workflow-result.json; spotlight + borderFrame.',
    preloadAssets: ['/images/stranger.jpg'],
  }),
  promptStructure: defineJsonSlide({
    id: M.promptStructure,
    title: 'Структура промпта',
    theme: 'cinema',
    raw: rawPromptStructure,
    source: 'slide-prompt-structure.json',
    notes:
      'JSON: splitLayout 4+8, accentGradient + indexedList слева, uniformGrid 2×2 ghost cards + headerBadge + tagList; slide-prompt-structure.json; spotlight + borderFrame.',
  }),
  promptOrderFlex: defineJsonSlide({
    id: M.promptOrderFlex,
    title: 'Формула не догма',
    theme: 'cinema',
    raw: rawPromptOrderFlex,
    source: 'slide-prompt-order-flex.json',
    notes:
      'JSON: stackLayout + equalColumns, два ghost-card с variant prompt, accentGradient вывод; slide-prompt-order-flex.json; из 20Feb PromptOrderFlexSlide.',
  }),
  promptOrderPairImages: defineJsonSlide({
    id: M.promptOrderPairImages,
    title: 'Промпт: порядок',
    theme: 'cinema',
    raw: rawPromptOrderPairImages,
    source: 'slide-prompt-order-pair-images.json',
    notes:
      'JSON: splitLayout 3+9, quote + mediaGallery pair; slide-prompt-order-pair-images.json; spotlight dimmed + borderFrame.',
    preloadAssets: ['/images/prompt/001.png', '/images/prompt/002.png'],
  }),
  proContradictions: defineJsonSlide({
    id: M.proContradictions,
    title: 'про противоречия',
    theme: 'cinema',
    raw: rawProContradictions,
    source: 'slide-pro-contradictions.json',
    notes: 'Чёрный минималистичный титул: одна строка по центру, без декора и мета.',
  }),
  editingPromptStructure: defineJsonSlide({
    id: M.editingPromptStructure,
    title: 'Промпт на редактирование',
    theme: 'cinema',
    raw: rawEditingPromptStructure,
    source: 'slide-editing-prompt-structure.json',
    notes:
      'JSON: splitLayout 4+8, accentGradient + indexedList слева, uniformGrid 2×1 ghost cards; slide-editing-prompt-structure.json; spotlight + borderFrame.',
  }),
  editingPromptPrinciples: defineJsonSlide({
    id: M.editingPromptPrinciples,
    title: 'Промпт на изменение',
    theme: 'editorial',
    raw: rawEditingPromptPrinciples,
    source: 'slide-editing-prompt-principles.json',
    notes: 'JSON: splitLayout 3+9, quote + mediaGallery pair; slide-editing-prompt-principles.json; grid backdrop.',
    preloadAssets: ['/images/editing/input.png', '/images/editing/output.png'],
  }),
  styleCopyPromptPrinciples: defineJsonSlide({
    id: M.styleCopyPromptPrinciples,
    title: 'Копирование стиля',
    theme: 'editorial',
    raw: rawStyleCopyPromptPrinciples,
    source: 'slide-style-copy-prompt-principles.json',
    notes:
      'JSON: splitLayout 3+9, quote + mediaGallery pair; slide-style-copy-prompt-principles.json; grid backdrop.',
    preloadAssets: ['/images/editing/ref.jpg', '/images/editing/input.png'],
  }),
  styleCopyPromptPrinciplesCopy4: defineJsonSlide({
    id: M.styleCopyPromptPrinciplesCopy4,
    title: 'Копирование стиля',
    theme: 'editorial',
    raw: rawStyleCopyPromptPrinciplesCopy4,
    source: 'slide-style-copy-prompt-principles-copy-4.json',
    notes:
      'JSON: splitLayout 3+9, quote + mediaGallery pair; slide-style-copy-prompt-principles-copy-4.json; grid backdrop.',
    preloadAssets: ['/images/editing/var2.png', '/images/editing/var3.png'],
  }),
  styleCopyPromptPrinciplesCopy2: defineJsonSlide({
    id: M.styleCopyPromptPrinciplesCopy2,
    title: 'Точечное редактирование',
    theme: 'editorial',
    raw: rawStyleCopyPromptPrinciplesCopy2,
    source: 'slide-style-copy-prompt-principles-copy-2.json',
    notes:
      'JSON: splitLayout 3+9, quote + mediaGallery pair; slide-style-copy-prompt-principles-copy-2.json; grid backdrop.',
    preloadAssets: ['/images/editing/wrong.png', '/images/editing/output.png'],
  }),
  styleCopyPromptPrinciplesCopy3: defineJsonSlide({
    id: M.styleCopyPromptPrinciplesCopy3,
    title: 'Точечное редактирование',
    theme: 'editorial',
    raw: rawStyleCopyPromptPrinciplesCopy3,
    source: 'slide-style-copy-prompt-principles-copy-3.json',
    notes:
      'JSON: splitLayout 3+9, quote + mediaGallery pair; slide-style-copy-prompt-principles-copy-3.json; grid backdrop.',
    preloadAssets: ['/images/editing/inpainting.png', '/images/editing/result2.png'],
  }),
  multiReferenceCover: defineJsonSlide({
    id: M.multiReferenceCover,
    title: 'Мульти референсность',
    theme: 'cinema',
    raw: rawImageCoverMultiReference,
    source: 'slide-image-cover-multi-reference.json',
    notes: 'JSON imageCover, slide-image-cover-multi-reference.json; обложка riding.png, hero display headline.',
    preloadAssets: ['/images/riding.png'],
  }),
  referenceRoles: defineJsonSlide({
    id: M.referenceRoles,
    title: 'Роли референсов',
    theme: 'editorial',
    raw: rawReferenceRoles,
    source: 'slide-reference-roles.json',
    notes:
      'JSON: splitLayout 3+9 quote + nested split 4+8; stackLayout 3+9 pair+single fill + single result; slide-reference-roles.json.',
    preloadAssets: [
      '/images/multiref/Character.png',
      '/images/multiref/Horse.jpg',
      '/images/multiref/Clothes.jpg',
      '/images/multiref/result.jpg',
    ],
  }),
  leoWideShot: defineJsonSlide({
    id: M.leoWideShot,
    title: 'Фотореализм',
    theme: 'editorial',
    raw: rawLeoWideShot,
    source: 'slide-leo-wide-shot.json',
    notes:
      'JSON: splitLayout 3+9 quote + nested split 5+7; mediaGallery column fill refs/results; slide-leo-wide-shot.json.',
    preloadAssets: [
      '/images/leo/ref1.png',
      '/images/leo/ref2.jpg',
      '/images/leo/ref3.jpg',
      '/images/leo/result1.png',
      '/images/leo/result2.png',
    ],
  }),
  referenceAnalysis: defineJsonSlide({
    id: M.referenceAnalysis,
    title: 'Анализ референса',
    theme: 'editorial',
    raw: rawReferenceAnalysis,
    source: 'slide-reference-analysis.json',
    notes: 'JSON: mediaGallery (2), caption + showCaption; slide-reference-analysis.json; face/001–002.',
    preloadAssets: ['/images/face/001.jpg', '/images/face/002.jpg'],
  }),
  anglesLighting: defineJsonSlide({
    id: M.anglesLighting,
    title: 'Ракурс камеры и освещение',
    theme: 'signal',
    raw: rawAnglesLighting,
    source: 'slide-angles-lighting.json',
    notes: 'JSON: splitLayout 2+10, text region + mediaGallery pair; slide-angles-lighting.json; angles/001–002.',
    preloadAssets: ['/images/angles/001.png', '/images/angles/002.png'],
  }),
  lessObviousUseCases: defineJsonSlide({
    id: M.lessObviousUseCases,
    title: 'Ссылка на пример',
    theme: 'cinema',
    raw: rawLessObviousUseCases,
    source: 'slide-less-obvious-use-cases.json',
    notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
  }),
  photorealismModelPicks: defineJsonSlide({
    id: M.photorealismModelPicks,
    title: 'Редактирование и перенос стиля',
    theme: 'editorial',
    raw: rawPhotorealismModelPicks,
    source: 'slide-photorealism-model-picks.json',
    notes:
      'JSON: bentoGrid 12×2 (4+4+4 / 6+6), slide-photorealism-model-picks.json; только названия моделей снизу, watermark; Nano Banana accent.',
  }),
  photorealismSectionTitle: defineJsonSlide({
    id: M.photorealismSectionTitle,
    title: 'Где Nano Banana не лучший выбор',
    theme: 'cinema',
    raw: rawPhotorealismSectionTitle,
    source: 'slide-photorealism-section-title.json',
    notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
  }),
  grokImagineBento: defineJsonSlide({
    id: M.grokImagineBento,
    title: 'Grok Imagine',
    theme: 'cinema',
    raw: rawGrokImagineBento,
    source: 'slide-grok-imagine-bento.json',
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
  }),
  recraftV4Bento: defineJsonSlide({
    id: M.recraftV4Bento,
    title: 'Recraft V4',
    theme: 'cinema',
    raw: rawRecraftV4Bento,
    source: 'slide-recraft-v4-bento.json',
    notes: 'JSON: splitLayout 5+7, slide-recraft-v4-bento.json; слева 001, справа два ряда 2+2; spotlight.',
    preloadAssets: [
      '/images/recraft/001.jpg',
      '/images/recraft/002.jpg',
      '/images/recraft/003.jpg',
      '/images/recraft/004.jpg',
      '/images/recraft/005.jpg',
    ],
  }),
  midjorneyBento: defineJsonSlide({
    id: M.midjorneyBento,
    title: 'Midjorney',
    theme: 'cinema',
    raw: rawMidjorneyBento,
    source: 'slide-midjorney-bento.json',
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
  }),
  nanoBananaConnection: defineJsonSlide({
    id: M.nanoBananaConnection,
    title: 'Про связку с Nano Banana',
    theme: 'cinema',
    raw: rawNanoBananaConnection,
    source: 'slide-nano-banana-connection.json',
    notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
  }),
  lessObviousSectionTitle: defineJsonSlide({
    id: M.lessObviousSectionTitle,
    title: 'Менее очевидные сценарии использования',
    theme: 'cinema',
    raw: rawLessObviousSectionTitle,
    source: 'slide-less-obvious-section-title.json',
    notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
  }),
  texturingModelingCover: defineJsonSlide({
    id: M.texturingModelingCover,
    title: 'Текстурирование и моделинг',
    theme: 'cinema',
    raw: rawImageCoverTexturingModeling,
    source: 'slide-image-cover-texturing-modeling.json',
    notes: 'JSON imageCover, slide-image-cover-texturing-modeling.json; creme, inverted rails, center rule, white display title.',
    preloadAssets: ['/images/creme.png'],
  }),
  textureWorkflow: defineJsonSlide({
    id: M.textureWorkflow,
    title: 'Texture workflow',
    theme: 'editorial',
    raw: rawTextureWorkflow,
    source: 'slide-texture-workflow.json',
    notes:
      'JSON: splitLayout 3+9, quote + nested split 4+8, два mediaGallery single (contain + cover); slide-texture-workflow.json; grid. Без legacy ®© и фиксированной 380px колонки.',
    preloadAssets: ['/images/workflow/002.png', '/images/workflow/003.png'],
  }),
  threeDTwoRefsTwoOuts: defineJsonSlide({
    id: M.threeDTwoRefsTwoOuts,
    title: '3D',
    theme: 'editorial',
    raw: rawThreeDTwoRefsTwoOuts,
    source: 'slide-3d-two-refs-two-outs.json',
    notes:
      'JSON: splitLayout 3+9, quote + mediaGallery 2×2 (ref1, out1, ref2, out2); slide-3d-two-refs-two-outs.json; grid; /images/3d/.',
    preloadAssets: [
      '/images/3d/ref1.png',
      '/images/3d/ref2.jpg',
      '/images/3d/out1.png',
      '/images/3d/out2.png',
    ],
  }),
  workflowComparison: defineJsonSlide({
    id: M.workflowComparison,
    title: '3D воркфлоу',
    theme: 'cinema',
    raw: rawWorkflowComparison,
    source: 'slide-workflow-comparison.json',
    notes:
      'JSON: splitLayout 6+6, слева video single, справа mediaGallery column (extra1/extra2); slide-workflow-comparison.json; spotlight, borderFrame.',
    preloadAssets: ['/images/workflow/extra-v.mp4', '/images/workflow/extra1.png', '/images/workflow/extra2.png'],
  }),
  threeDWorkflowLink: defineJsonSlide({
    id: M.threeDWorkflowLink,
    title: 'Ссылка на пример',
    theme: 'cinema',
    raw: rawThreeDWorkflowLink,
    source: 'slide-three-d-workflow-link.json',
    notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
  }),
  jsonPromptingCover: defineJsonSlide({
    id: M.jsonPromptingCover,
    title: 'JSON промптинг',
    theme: 'cinema',
    raw: rawImageCoverJsonPrompting,
    source: 'slide-image-cover-json-prompting.json',
    notes: 'JSON imageCover, slide-image-cover-json-prompting.json; /bg/bg2.png, triple top rail, displayTight headline.',
    preloadAssets: ['/bg/bg2.png'],
  }),
  jsonImagesTriptych: defineJsonSlide({
    id: M.jsonImagesTriptych,
    title: 'JSON и изображения',
    theme: 'editorial',
    raw: rawJsonImagesTriptych,
    source: 'slide-json-images-triptych.json',
    notes: 'JSON: equalColumns 4+4+4, stackLayout h2 + mediaGallery; slide-json-images-triptych.json; grid.',
    preloadAssets: ['/images/json/via_ref.png', '/images/json/001.png', '/images/composition/ref.jpg'],
  }),
  compositionPhotoLink: defineJsonSlide({
    id: M.compositionPhotoLink,
    title: 'Ссылка на пример',
    theme: 'cinema',
    raw: rawCompositionPhotoLink,
    source: 'slide-composition-photo-link.json',
    notes: 'Минималистичный титул-секция перед блоком текстур/моделинга.',
  }),
  otherExamplesFlouxProjects: defineJsonSlide({
    id: M.otherExamplesFlouxProjects,
    title: 'Другие примеры',
    theme: 'cinema',
    raw: rawOtherExamplesFlouxProjects,
    source: 'slide-other-examples-floux-projects.json',
    notes: 'JSON textStack: h1 + три ссылки Floux; slide-other-examples-floux-projects.json; cinema, backdrop none + borderFrame.',
  }),
};

export type MainJsonSlideKey = keyof typeof mainJsonSlides;
