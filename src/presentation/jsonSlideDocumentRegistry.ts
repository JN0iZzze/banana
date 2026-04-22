import type { JsonSlideDocument } from './jsonSlideTypes';
import { parseJsonSlideDocument } from './parseJsonSlideDocument';
import rawAsymmetric from './schemas/demo-grid-asymmetric.json';
import rawBento from './schemas/demo-grid-bento.json';
import rawHeroJourneyBento from './schemas/slide-demo-hero-journey-bento.json';
import rawEqual from './schemas/demo-grid-equal.json';
import rawAttentionModels from './schemas/slide-attention-models-2026.json';
import rawNanoBananaUseCases from './schemas/slide-nano-banana-use-cases.json';
import rawMidjourneyVsNanoBanana from './schemas/slide-midjourney-vs-nano-banana.json';
import rawPlatformsEcosystem from './schemas/slide-platforms-ecosystem.json';
import rawPromptStructure from './schemas/slide-prompt-structure.json';
import rawEditingPromptStructure from './schemas/slide-editing-prompt-structure.json';
import rawHighsfield from './schemas/slide-higgsfield.json';
import rawNodeBasedSystems from './schemas/slide-node-based-systems.json';
import rawFlouxDemo from './schemas/slide-floux-demo.json';
import rawAgenticWorkflowResult from './schemas/slide-agentic-workflow-result.json';
import rawAgenticWorkflow from './schemas/slide-agentic-workflow.json';
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
import rawAboutMe from './schemas/slide-about-me.json';
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
import rawVibecodingDemo from './schemas/slide-vibecoding-demo.json';
import { VIBECODING_DECK_SLIDE_IDS } from './decks/vibecodingSlideIds';

export { VIBECODING_DECK_SLIDE_IDS };

export const DEMO_JSON_SLIDE_IDS = {
  asymmetric: 'demo-json-grid-asymmetric',
  equal: 'demo-json-grid-equal',
  bento: 'demo-json-grid-bento',
  heroJourneyBento: 'demo-hero-journey-bento',
} as const;

/** Slide ids that use migrated production JSON documents. */
export const MIGRATED_JSON_SLIDE_IDS = {
  platformsEcosystem: 'platforms-ecosystem-bento',
  attentionModels2026: 'attention-models-2026',
  nanoBananaUseCases: 'nano-banana-use-cases',
  midjourneyVsNanoBanana: 'midjourney-vs-nano-banana',
  promptStructure: 'prompt-structure',
  editingPromptStructure: 'editing-prompt-structure',
  higgsfield: 'higgsfield',
  nodeBasedSystems: 'node-based-systems',
  flouxDemo: 'floux-demo',
  agenticWorkflowResult: 'agentic-workflow-result',
  agenticWorkflow: 'agentic-workflow',
  promptOrderPairImages: 'prompt-order-pair-images',
  editingPromptPrinciples: 'editing-prompt-principles',
  referenceRoles: 'reference-roles',
  leoWideShot: 'leo-wide-shot',
  styleCopyPromptPrinciples: 'style-copy-prompt-principles',
  styleCopyPromptPrinciplesCopy2: 'style-copy-prompt-principles-copy-2',
  styleCopyPromptPrinciplesCopy3: 'style-copy-prompt-principles-copy-3',
  styleCopyPromptPrinciplesCopy4: 'style-copy-prompt-principles-copy-4',
  nanoBananaProCover: 'nano-banana-pro',
  multiReferenceCover: 'multi-reference',
  texturingModelingCover: 'texturing-modeling-cover',
  jsonPromptingCover: 'json-prompting-cover',
  referenceAnalysis: 'reference-analysis',
  anglesLighting: 'angles-lighting',
  photorealismModelPicks: 'photorealism-model-picks',
  aboutMe: 'about-me',
  proContradictions: 'pro-contradictions',
  lessObviousUseCases: 'less-obvious-use-cases',
  photorealismSectionTitle: 'photorealism-section-title',
  nanoBananaConnection: 'nano-banana-connection',
  lessObviousSectionTitle: 'less-obvious-section-title',
  threeDWorkflowLink: 'three-d-workflow-link',
  compositionPhotoLink: 'composition-photo-link',
  grokImagineBento: 'grok-imagine-bento',
  recraftV4Bento: 'recraft-v4-bento',
  midjorneyBento: 'midjorney-bento',
  jsonImagesTriptych: 'json-images-triptych',
  textureWorkflow: 'texture-workflow',
  threeDTwoRefsTwoOuts: '3d-two-refs-two-outs',
  workflowComparison: 'workflow-comparison',
  otherExamplesFlouxProjects: 'other-examples-floux-projects',
  promptOrderFlex: 'prompt-order-flex',
  nanoBananaVersions: 'nano-banana-versions',
} as const;

function loadDocument(raw: unknown, label: string): JsonSlideDocument {
  const parsed = parseJsonSlideDocument(raw);
  if (!parsed.ok) {
    throw new Error(`Invalid JSON slide schema (${label}): ${parsed.error}`);
  }
  return parsed.doc;
}

const docAsymmetric = loadDocument(rawAsymmetric, 'demo-grid-asymmetric.json');
const docEqual = loadDocument(rawEqual, 'demo-grid-equal.json');
const docBento = loadDocument(rawBento, 'demo-grid-bento.json');
const docHeroJourneyBento = loadDocument(rawHeroJourneyBento, 'slide-demo-hero-journey-bento.json');
const docPlatforms = loadDocument(rawPlatformsEcosystem, 'slide-platforms-ecosystem.json');
const docAttention = loadDocument(rawAttentionModels, 'slide-attention-models-2026.json');
const docUseCases = loadDocument(rawNanoBananaUseCases, 'slide-nano-banana-use-cases.json');
const docMidjourneyVsNanoBanana = loadDocument(rawMidjourneyVsNanoBanana, 'slide-midjourney-vs-nano-banana.json');
const docPromptStructure = loadDocument(rawPromptStructure, 'slide-prompt-structure.json');
const docEditingPromptStructure = loadDocument(rawEditingPromptStructure, 'slide-editing-prompt-structure.json');
const docHighsfield = loadDocument(rawHighsfield, 'slide-higgsfield.json');
const docNodeBasedSystems = loadDocument(rawNodeBasedSystems, 'slide-node-based-systems.json');
const docFlouxDemo = loadDocument(rawFlouxDemo, 'slide-floux-demo.json');
const docAgenticWorkflowResult = loadDocument(rawAgenticWorkflowResult, 'slide-agentic-workflow-result.json');
const docAgenticWorkflow = loadDocument(rawAgenticWorkflow, 'slide-agentic-workflow.json');
const docPromptOrderPairImages = loadDocument(rawPromptOrderPairImages, 'slide-prompt-order-pair-images.json');
const docEditingPromptPrinciples = loadDocument(rawEditingPromptPrinciples, 'slide-editing-prompt-principles.json');
const docReferenceRoles = loadDocument(rawReferenceRoles, 'slide-reference-roles.json');
const docLeoWideShot = loadDocument(rawLeoWideShot, 'slide-leo-wide-shot.json');
const docStyleCopyPromptPrinciples = loadDocument(rawStyleCopyPromptPrinciples, 'slide-style-copy-prompt-principles.json');
const docStyleCopyPromptPrinciplesCopy2 = loadDocument(
  rawStyleCopyPromptPrinciplesCopy2,
  'slide-style-copy-prompt-principles-copy-2.json',
);
const docStyleCopyPromptPrinciplesCopy3 = loadDocument(
  rawStyleCopyPromptPrinciplesCopy3,
  'slide-style-copy-prompt-principles-copy-3.json',
);
const docStyleCopyPromptPrinciplesCopy4 = loadDocument(
  rawStyleCopyPromptPrinciplesCopy4,
  'slide-style-copy-prompt-principles-copy-4.json',
);
const docImageCoverNanoBananaPro = loadDocument(rawImageCoverNanoBananaPro, 'slide-image-cover-nano-banana-pro.json');
const docImageCoverMultiReference = loadDocument(
  rawImageCoverMultiReference,
  'slide-image-cover-multi-reference.json',
);
const docImageCoverTexturingModeling = loadDocument(
  rawImageCoverTexturingModeling,
  'slide-image-cover-texturing-modeling.json',
);
const docImageCoverJsonPrompting = loadDocument(
  rawImageCoverJsonPrompting,
  'slide-image-cover-json-prompting.json',
);
const docReferenceAnalysis = loadDocument(rawReferenceAnalysis, 'slide-reference-analysis.json');
const docAnglesLighting = loadDocument(rawAnglesLighting, 'slide-angles-lighting.json');
const docPhotorealismModelPicks = loadDocument(rawPhotorealismModelPicks, 'slide-photorealism-model-picks.json');
const docAboutMe = loadDocument(rawAboutMe, 'slide-about-me.json');
const docProContradictions = loadDocument(rawProContradictions, 'slide-pro-contradictions.json');
const docLessObviousUseCases = loadDocument(rawLessObviousUseCases, 'slide-less-obvious-use-cases.json');
const docPhotorealismSectionTitle = loadDocument(rawPhotorealismSectionTitle, 'slide-photorealism-section-title.json');
const docNanoBananaConnection = loadDocument(rawNanoBananaConnection, 'slide-nano-banana-connection.json');
const docLessObviousSectionTitle = loadDocument(rawLessObviousSectionTitle, 'slide-less-obvious-section-title.json');
const docThreeDWorkflowLink = loadDocument(rawThreeDWorkflowLink, 'slide-three-d-workflow-link.json');
const docCompositionPhotoLink = loadDocument(rawCompositionPhotoLink, 'slide-composition-photo-link.json');
const docGrokImagineBento = loadDocument(rawGrokImagineBento, 'slide-grok-imagine-bento.json');
const docRecraftV4Bento = loadDocument(rawRecraftV4Bento, 'slide-recraft-v4-bento.json');
const docMidjorneyBento = loadDocument(rawMidjorneyBento, 'slide-midjorney-bento.json');
const docJsonImagesTriptych = loadDocument(rawJsonImagesTriptych, 'slide-json-images-triptych.json');
const docTextureWorkflow = loadDocument(rawTextureWorkflow, 'slide-texture-workflow.json');
const docThreeDTwoRefsTwoOuts = loadDocument(rawThreeDTwoRefsTwoOuts, 'slide-3d-two-refs-two-outs.json');
const docWorkflowComparison = loadDocument(rawWorkflowComparison, 'slide-workflow-comparison.json');
const docOtherExamplesFlouxProjects = loadDocument(
  rawOtherExamplesFlouxProjects,
  'slide-other-examples-floux-projects.json',
);
const docPromptOrderFlex = loadDocument(rawPromptOrderFlex, 'slide-prompt-order-flex.json');
const docNanoBananaVersions = loadDocument(rawNanoBananaVersions, 'slide-nano-banana-versions.json');
const docVibecodingDemo = loadDocument(rawVibecodingDemo, 'slide-vibecoding-demo.json');

/** Pre-validated schemas keyed by `SlideDefinition.id`. */
export const jsonSlideDocumentBySlideId: Record<string, JsonSlideDocument> = {
  [DEMO_JSON_SLIDE_IDS.asymmetric]: docAsymmetric,
  [DEMO_JSON_SLIDE_IDS.equal]: docEqual,
  [DEMO_JSON_SLIDE_IDS.bento]: docBento,
  [DEMO_JSON_SLIDE_IDS.heroJourneyBento]: docHeroJourneyBento,
  [MIGRATED_JSON_SLIDE_IDS.platformsEcosystem]: docPlatforms,
  [MIGRATED_JSON_SLIDE_IDS.attentionModels2026]: docAttention,
  [MIGRATED_JSON_SLIDE_IDS.nanoBananaUseCases]: docUseCases,
  [MIGRATED_JSON_SLIDE_IDS.midjourneyVsNanoBanana]: docMidjourneyVsNanoBanana,
  [MIGRATED_JSON_SLIDE_IDS.promptStructure]: docPromptStructure,
  [MIGRATED_JSON_SLIDE_IDS.editingPromptStructure]: docEditingPromptStructure,
  [MIGRATED_JSON_SLIDE_IDS.higgsfield]: docHighsfield,
  [MIGRATED_JSON_SLIDE_IDS.nodeBasedSystems]: docNodeBasedSystems,
  [MIGRATED_JSON_SLIDE_IDS.flouxDemo]: docFlouxDemo,
  [MIGRATED_JSON_SLIDE_IDS.agenticWorkflowResult]: docAgenticWorkflowResult,
  [MIGRATED_JSON_SLIDE_IDS.agenticWorkflow]: docAgenticWorkflow,
  [MIGRATED_JSON_SLIDE_IDS.promptOrderPairImages]: docPromptOrderPairImages,
  [MIGRATED_JSON_SLIDE_IDS.editingPromptPrinciples]: docEditingPromptPrinciples,
  [MIGRATED_JSON_SLIDE_IDS.referenceRoles]: docReferenceRoles,
  [MIGRATED_JSON_SLIDE_IDS.leoWideShot]: docLeoWideShot,
  [MIGRATED_JSON_SLIDE_IDS.styleCopyPromptPrinciples]: docStyleCopyPromptPrinciples,
  [MIGRATED_JSON_SLIDE_IDS.styleCopyPromptPrinciplesCopy2]: docStyleCopyPromptPrinciplesCopy2,
  [MIGRATED_JSON_SLIDE_IDS.styleCopyPromptPrinciplesCopy3]: docStyleCopyPromptPrinciplesCopy3,
  [MIGRATED_JSON_SLIDE_IDS.styleCopyPromptPrinciplesCopy4]: docStyleCopyPromptPrinciplesCopy4,
  [MIGRATED_JSON_SLIDE_IDS.nanoBananaProCover]: docImageCoverNanoBananaPro,
  [MIGRATED_JSON_SLIDE_IDS.multiReferenceCover]: docImageCoverMultiReference,
  [MIGRATED_JSON_SLIDE_IDS.texturingModelingCover]: docImageCoverTexturingModeling,
  [MIGRATED_JSON_SLIDE_IDS.jsonPromptingCover]: docImageCoverJsonPrompting,
  [MIGRATED_JSON_SLIDE_IDS.referenceAnalysis]: docReferenceAnalysis,
  [MIGRATED_JSON_SLIDE_IDS.anglesLighting]: docAnglesLighting,
  [MIGRATED_JSON_SLIDE_IDS.photorealismModelPicks]: docPhotorealismModelPicks,
  [MIGRATED_JSON_SLIDE_IDS.aboutMe]: docAboutMe,
  [MIGRATED_JSON_SLIDE_IDS.proContradictions]: docProContradictions,
  [MIGRATED_JSON_SLIDE_IDS.lessObviousUseCases]: docLessObviousUseCases,
  [MIGRATED_JSON_SLIDE_IDS.photorealismSectionTitle]: docPhotorealismSectionTitle,
  [MIGRATED_JSON_SLIDE_IDS.nanoBananaConnection]: docNanoBananaConnection,
  [MIGRATED_JSON_SLIDE_IDS.lessObviousSectionTitle]: docLessObviousSectionTitle,
  [MIGRATED_JSON_SLIDE_IDS.threeDWorkflowLink]: docThreeDWorkflowLink,
  [MIGRATED_JSON_SLIDE_IDS.compositionPhotoLink]: docCompositionPhotoLink,
  [MIGRATED_JSON_SLIDE_IDS.grokImagineBento]: docGrokImagineBento,
  [MIGRATED_JSON_SLIDE_IDS.recraftV4Bento]: docRecraftV4Bento,
  [MIGRATED_JSON_SLIDE_IDS.midjorneyBento]: docMidjorneyBento,
  [MIGRATED_JSON_SLIDE_IDS.jsonImagesTriptych]: docJsonImagesTriptych,
  [MIGRATED_JSON_SLIDE_IDS.textureWorkflow]: docTextureWorkflow,
  [MIGRATED_JSON_SLIDE_IDS.threeDTwoRefsTwoOuts]: docThreeDTwoRefsTwoOuts,
  [MIGRATED_JSON_SLIDE_IDS.workflowComparison]: docWorkflowComparison,
  [MIGRATED_JSON_SLIDE_IDS.otherExamplesFlouxProjects]: docOtherExamplesFlouxProjects,
  [MIGRATED_JSON_SLIDE_IDS.promptOrderFlex]: docPromptOrderFlex,
  [MIGRATED_JSON_SLIDE_IDS.nanoBananaVersions]: docNanoBananaVersions,
  [VIBECODING_DECK_SLIDE_IDS.demo]: docVibecodingDemo,
};

export function getJsonSlideDocumentForSlideId(id: string): JsonSlideDocument | undefined {
  return jsonSlideDocumentBySlideId[id];
}
